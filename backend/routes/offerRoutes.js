const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');

router.post('/offer', offerController.addOffers);
router.get('/highest-discount', offerController.getHighestDiscount);
router.get('/offers', offerController.getAllOffers);

module.exports = router;