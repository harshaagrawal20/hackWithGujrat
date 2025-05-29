require("dotenv").config();
const express = require("express");
const { callGeminiChat } = require("./gemini");
const { getRelevantChunks } = require("./qdrant");
const cors = require('cors');
const use = require("@tensorflow-models/universal-sentence-encoder");
const tf = require("@tensorflow/tfjs-node");

const app = express();
app.use(express.json());



app.use(cors({
  origin: 'http://localhost:3002',
  methods: '*', // Allow all HTTP methods
  credentials: true
}));

const PORT = 3000;

let embedModel = null;

(async () => {
  console.log("Loading Universal Sentence Encoder model...");
  embedModel = await use.load();
  console.log("USE model loaded");
})();

// Helper to pad 512-dim vector to 1024-dim
function padEmbeddingTo1024(vec512) {
  const needed = 1024 - vec512.length;
  if (needed <= 0) return vec512;
  return vec512.concat(new Array(needed).fill(0));
}

app.post("/chat", async (req, res) => {
  const { mood, journal, userInput } = req.body;

  try {
    if (!embedModel) {
      return res.status(503).json({ error: "Embedding model not loaded yet, try again shortly." });
    }

    const combined = `${mood} ${journal} ${userInput}`;
    const embeddingsTensor = await embedModel.embed([combined]);
    const embedding512 = embeddingsTensor.arraySync()[0]; // 512 dims

    // Pad to 1024 dims to match Qdrant collection
    const embedding1024 = padEmbeddingTo1024(embedding512);

    const context = await getRelevantChunks(embedding1024);
    const reply = await callGeminiChat({ userInput, journal, mood, context });

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`Therapy chatbot API running at http://localhost:${PORT}`);
});
