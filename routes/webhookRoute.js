const express = require('express');
const router = express.Router();
const {  stripeWebhook } = require('../controller/paymentCtr');


router.post('/payment', express.raw({ type: "application/json" }), stripeWebhook);
module.exports = router;
