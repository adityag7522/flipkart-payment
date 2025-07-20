const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  offerId: { type: String, unique: true },
  provider: [String],
  logo: String,
  offerTitle: String,
  offerDetailText: String
});

module.exports = mongoose.model('Offer', offerSchema);