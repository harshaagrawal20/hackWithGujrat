const express = require('express');
const JournalEntry = require('../models/JournalEntry');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Save journal
router.post('/', auth, async (req, res) => {
  const { date, mood, rating, text } = req.body;
  const entry = new JournalEntry({
    userId: req.user.id,
    date: date || new Date(),  // if no date sent, use current date
    mood,
    rating,
    text,
  });
  await entry.save();
  res.json(entry);
});

// Get all user journals
router.get('/', auth, async (req, res) => {
  const entries = await JournalEntry.find({ userId: req.user.id });
  res.json(entries);
});

// in your journal routes (e.g., journal.js)

// router.get('/:id', auth, async (req, res) => {
//   try {
//     const entry = await JournalEntry.findOne({ _id: req.params.id, userId: req.user.id });
//     if (!entry) return res.status(404).json({ error: 'Entry not found' });
//     res.json(entry);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

module.exports = router;
