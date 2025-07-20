import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FilterPage from './FilterPage';

const Home = () => {
  const [offers, setOffers] = useState([]);
  const [sortDesc, setSortDesc] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/offers')
      .then(res => {
        const sorted = res.data.map(o => ({
          ...o,
          discountAmount: parseInt(o.discountAmount || 0)
        }));
        setOffers(sorted);
      });
  }, []);

  const sortedOffers = [...offers].sort((a, b) => 
    sortDesc ? b.discountAmount - a.discountAmount : a.discountAmount - b.discountAmount
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>PiePay Offers</h1>
      <Link to="/filter">Go to Filter Page</Link>
      <br/><br/>
      <button onClick={() => setSortDesc(!sortDesc)}>
        Sort by Discount {sortDesc ? '(High to Low)' : '(Low to High)'}
      </button>
      <ul>
        {sortedOffers.map((offer) => (
          <li key={offer.offerId}>
            <strong>{offer.offerTitle}</strong> - ₹{offer.discountAmount}<br/>
            <em>{offer.offerDetailText}</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/filter" element={<FilterPage />} />
    </Routes>
  </Router>
);

export default App;