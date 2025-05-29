// const { QdrantClient } = require("@qdrant/js-client-rest");
// const axios = require("axios");

// const client = new QdrantClient({ url: process.env.QDRANT_URL });

// async function getRelevantChunks(userQueryEmbedding, limit = 4) {
//   const result = await client.search("therapy_muse", {
//     vector: userQueryEmbedding,
//     limit,
//   });
  

//   return result.map(hit => hit.payload.text);
// }

// module.exports = { getRelevantChunks };




const { QdrantClient } = require("@qdrant/js-client-rest");
const axios = require("axios");

const client = new QdrantClient({ url: process.env.QDRANT_URL });

async function getRelevantChunks(userQueryEmbedding, limit = 4) {
  const result = await client.search("therapy_muse", {
    vector: userQueryEmbedding,
    limit,
  });

  const chunks = result.map(hit => hit.payload.text);

  // Log the retrieved chunks
  console.log("Retrieved relevant chunks:", chunks);

  return chunks;
}

module.exports = { getRelevantChunks };
