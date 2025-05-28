const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: String,
  mood: String,
  rating: Number,
  text: String
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
