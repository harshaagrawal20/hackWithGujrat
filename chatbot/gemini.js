const axios = require("axios");

async function callGeminiChat({ userInput, journal, mood, context }) {
  const prompt = `
You are a compassionate mental health AI assistant. Here is the user's data:

Mood: ${mood}
Journal: ${journal}

Relevant context:
${context.map((c, i) => `Context ${i + 1}: ${c}`).join("\n")}

User says: ${userInput}

You are a kind, supportive therapy assistant who speaks like a caring friend. Be warm, natural, and empathetic. Avoid robotic or formal language. Never mention limitations or what data you don't have — just respond with what feels helpful and human.

Key points:

    Gently reflect what the user says using natural language.

    Avoid generic or clinical phrases (e.g., “youre feeling undefined”).

    Dont explain what you can or cant access — just respond thoughtfully.

    Encourage small reflections or next steps if it feels right.

    Keep responses short to medium. Be real, calm, and kind.`;

  const API_KEY = process.env.GEMINI_API_KEY;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  try {
    const res = await axios.post(
      url,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I'm having trouble responding.";
  } catch (error) {
    console.error("Error calling Gemini API:", error.response?.data || error.message);
    return "Sorry, I'm having trouble responding right now.";
  }
}

module.exports = { callGeminiChat };
