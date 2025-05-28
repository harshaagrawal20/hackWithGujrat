const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost/hackwithguj')
  .then(() => console.log("MongoDB Connected"));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/journal', require('./routes/journal'));

app.listen(5000, () => console.log('Server on port 5000'));
