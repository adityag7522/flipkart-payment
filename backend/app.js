const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const offerRoutes = require('./routes/offerRoutes');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use('/api', offerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));