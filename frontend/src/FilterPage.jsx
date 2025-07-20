import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FilterPage = () => {
  const [offers, setOffers] = useState([]);
  const [totalAmount, setTotalAmount] = useState('');
  const [bank, setBank] = useState('');
  const [bestOffer, setBestOffer] = useState(null);
  const [banks, setBanks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/offers')
      .then(res => {
        const data = res.data.map(o => ({
          ...o,
          discountAmount: parseInt(o.discountAmount || 0),
          minTxnAmount: parseInt(o.minTxnAmount || 0) // Make sure this field exists in your data
        }));
        setOffers(data);

        // Extract unique banks from offers
        setBanks([...new Set(data.map(o => o.provider[0]).filter(Boolean))]);
      });
  }, []);

  // Helper to extract discount info from offer text
  function extractDiscount(offer, totalAmount) {
    // Try to find a percentage discount
    const percentMatch = offer.offerDetailText.match(/(\d+)%\s*(?:off|discount|cashback)[^₹]*up to[^\d]*(\d+)/i);
    if (percentMatch) {
      const percentage = parseFloat(percentMatch[1]);
      const maxDiscount = parseFloat(percentMatch[2]);
      const discount = Math.min((totalAmount * percentage) / 100, maxDiscount);
      return { discount, type: 'percentage', percentage, maxDiscount };
    }

    // Try to find a flat discount/cashback
    const flatMatch = offer.offerDetailText.match(/₹\s?(\d+)\s?(?:cashback|discount|off)/i) ||
                      offer.offerTitle.match(/₹\s?(\d+)\s?(?:cashback|discount|off)/i);
    if (flatMatch) {
      const discount = parseFloat(flatMatch[1]);
      return { discount, type: 'flat' };
    }

    // Default: no discount
    return { discount: 0, type: 'none' };
  }

  useEffect(() => {
    let filteredOffers = offers;
    if (bank) {
      filteredOffers = filteredOffers.filter(o => o.provider[0] === bank);
    }
    if (totalAmount) {
      const amount = parseInt(totalAmount);
      // Only consider offers where totalAmount >= minTxnAmount (if you have this field)
      // filteredOffers = filteredOffers.filter(o => amount >= o.minTxnAmount);

      // Calculate the discount for each offer
      const offersWithDiscount = filteredOffers.map(o => {
        const { discount } = extractDiscount(o, amount);
        return { ...o, calculatedDiscount: discount };
      });

      // Find the offer with the highest calculated discount
      const best = offersWithDiscount.reduce(
        (max, o) => o.calculatedDiscount > (max?.calculatedDiscount || 0) ? o : max,
        null
      );
      setBestOffer(best);
    } else {
      setBestOffer(null);
    }
  }, [totalAmount, bank, offers]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Find Best Offer</h1>
      <Link to="/">Back to Home</Link>
      <br /><br />
      <label>
        Total Amount:
        <input
          type="number"
          value={totalAmount}
          onChange={e => setTotalAmount(e.target.value)}
        />
      </label>
      <br /><br />
      <label>
        Bank:
        <select value={bank} onChange={e => setBank(e.target.value)}>
          <option value="">All Banks</option>
          {banks.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </label>
      <br /><br />
      {bestOffer ? (
        <div>
          <h2>Best Offer</h2>
          <strong>{bestOffer.offerTitle}</strong> - ₹{bestOffer.calculatedDiscount}<br />
          <em>{bestOffer.offerDetailText}</em><br />
          <span>Bank: {bestOffer.provider[0]}</span>
          <br />
          {totalAmount && (
            <div>
              <strong>Discounted Price: </strong>
              ₹{Math.max(0, parseInt(totalAmount) - bestOffer.calculatedDiscount)}
            </div>
          )}
        </div>
      ) : (
        <div>No offer available for this amount and bank.</div>
      )}
    </div>
  );
};

export default FilterPage; 