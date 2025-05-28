// const express = require('express');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const router = express.Router();

// const SECRET = "super-secret"; // move to env in prod

// router.post('/signup', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = new User({ email, password });
//     await user.save();
//     const token = jwt.sign({ id: user._id }, SECRET);
//     res.json({ token });
//   } catch (e) {
//     res.status(400).json({ error: 'Email already exists' });
//   }
// });

// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user || !(await user.comparePassword(password))) {
//     return res.status(401).json({ error: 'Invalid credentials' });
//   }
//   const token = jwt.sign({ id: user._id }, SECRET);
//   res.json({ token });
// });

// module.exports = router;


const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const SECRET = "super-secret"; // move to env in prod

// Signup Route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, SECRET);

    res.json({ success: true, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, SECRET);
  res.json({ success: true, token });
});

module.exports = router;
