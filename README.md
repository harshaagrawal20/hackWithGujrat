# 🌿 MindSpace - AI Therapy Assistant and Mood Journal

![MindSpace Banner](https://images.pexels.com/photos/3759655/pexels-photo-3759655.jpeg)

**MindSpace** is a calming, intelligent, and supportive AI-powered therapy companion. It integrates journaling, mood tracking (with optional face-based detection), daily tasks, soothing mini-games, and a responsive AI chatbot provided context on real-world therapeutic datasets.

---

## 🧠 Features

### 🗣️ AI Therapy Chatbot (Gemini + RAG)

- Uses Google's free **Gemini API** to generate responses.
- Context-aware, powered by **Qdrant vector database**.
- Personalizes therapy based on:
  - Mood (0–5 scale)
  - Daily journal entries
  - Conversation input

---

### 📓 Mood Journal

- Secure, timestamped entries to track thoughts and feelings.
- Mood scale: **0 (Very Low)** to **5 (Very High)**.
- Supports rich text and emojis.

---

### 🎯 Personalized Daily Tasks

- AI-generated tasks based on current mood + journal.
- Examples:
  - "Take a 10-minute walk"
  - "Write 3 things you’re grateful for"
  - "Try deep breathing for 3 mins"

---

### 🎮 Soothing Games

- Calming, simple games to reduce anxiety and distract the mind.
- Ideas:
  - Bubble Popping
  - Memory Match
  - Breathing Simulator

---

### 😌 Mood Detection (Optional)

- Use **OpenCV** + camera for face-based mood scoring.
- Works locally and requires user permission.
- Great for validating self-reported mood.

---

## 💡 Architecture Overview

```plaintext
                       <- [Frontend (React)] -> [Node.js Backend]
                                                        |
                                               [Gemini API (Free)]
                                                        |
                                         [RAG Engine -> Qdrant + BGE-M3]

````


## 🧱 Tech Stack

| Component              | Technology              |
|------------------------|--------------------------|
| Frontend               | React (Vite)             |
| Chatbot API            | Node.js + Gemini         |
| Vector DB              | Qdrant                   |
| Embeddings             | BGE-M3                   |
| Mood Detection         | OpenCV   |
| CSV Knowledge Chunks   | Python Chunker Script    |

---

## 🧰 Setup Instructions

### 1. Install Requirements

```bash
npm install
pip install -r requirements.txt  # for chunking script
