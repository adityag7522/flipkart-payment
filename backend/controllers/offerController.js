const Offer = require('../models/Offer');

const extractAmount = (text) => {
  const match = text.match(/₹(\d{2,5})/);
  return match ? parseInt(match[1]) : 0;
};

exports.addOffers = async (req, res) => {
  const offerList = req.body.offers?.offerList || [];
  let created = 0;

  for (const offer of offerList) {
    const offerData = {
      offerId: offer.offerDescription?.id,
      provider: offer.provider || [],
      logo: offer.logo,
      offerTitle: offer.offerText?.text,
      offerDetailText: offer.offerDescription?.text
    };

    if (!offerData.offerId) continue;

    const exists = await Offer.findOne({ offerId: offerData.offerId });
    if (!exists) {
      await Offer.create(offerData);
      created++;
    }
  }

  res.json({
    noOfOffersIdentified: offerList.length,
    noOfNewOffersCreated: created
  });
};

exports.getHighestDiscount = async (req, res) => {
  const { amountToPay, bankName } = req.query;
  if (!amountToPay || !bankName) {
    return res.status(400).json({ error: 'amountToPay and bankName are required' });
  }

  const offers = await Offer.find({ provider: bankName });
  const enriched = offers.map(o => ({
    ...o._doc,
    discountAmount: extractAmount(o.offerDetailText || o.offerTitle)
  }));

  // Only include offers where discountAmount <= amountToPay
  const applicable = enriched.filter(o => o.discountAmount > 0 && o.discountAmount <= parseInt(amountToPay));
  const max = applicable.reduce((acc, o) => Math.max(acc, o.discountAmount), 0);

  res.json({ highestDiscountAmount: max });
};

exports.getAllOffers = async (req, res) => {
  const offers = await Offer.find({});
  const enriched = offers.map(o => ({
    ...o._doc,
    discountAmount: parseInt((o.offerDetailText?.match(/₹(\d{2,5})/) || [])[1] || 0)
  }));
  res.json(enriched);
};