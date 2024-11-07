// routes/paymentRoute.js
const express = require('express');
const router = express.Router();
const { createCheckoutSession, stripeWebhook } = require('../controller/paymentCtr');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Route to create a Payment Intent
router.post('/create-checkout-session', authMiddleware,createCheckoutSession);

// Stripe Webhook endpoint (must use raw body parser)

module.exports = router;
