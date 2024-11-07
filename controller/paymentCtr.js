// controllers/paymentController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('express-async-handler');
const Payment = require('../models/paymentModal');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// Create Stripe Checkout Session
const createCheckoutSession = asyncHandler(async (req, res) => {
  const { products } = req.body; // Array of { productId, quantity }
  const userId = req.user._id;

  try {
    let lineItems = [];

    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        res.status(404);
        throw new Error('Product not found');
      }

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
            description: product.description,
            images: product.images.map(img => img.url),
          },
          unit_amount: product.price * 100, // amount in cents
        },
        quantity: item.quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `http://localhost:3000/`,
      cancel_url: `http://localhost:3000/`,
      metadata: {
        userId: userId.toString(),
        orderItems: JSON.stringify(products),
      },
    });

    console.log('session',session.id)
    res.status(200).send({
      sessionId: session.id,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
// Stripe Webhook Handler
const stripeWebhook = asyncHandler(async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleCheckoutSessionCompleted(session);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
});

// Handle Successful Checkout Session
const handleCheckoutSessionCompleted = async (session) => {
  try {
    const userId = session.metadata.userId;
    const orderItems = JSON.parse(session.metadata.orderItems);

    const totalAmount = session.amount_total / 100; // Convert to dollars

    // Create Payment Record
    const payment = await Payment.create({
      stripePaymentIntentId: session.payment_intent,
      amount: totalAmount,
      currency: session.currency,
      status: session.payment_status,
      user: userId,
    });

    // Create Order
    const order = await Order.create({
      user: userId,
      products: orderItems.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        price: totalAmount, // Assuming totalAmount is for the entire order
      })),
      totalAmount: totalAmount,
      payment: payment._id,
      status: 'Completed',
    });

    // Update product stock and sold count
    for (let item of orderItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: {
            quantity: -item.quantity,
            sold: item.quantity,
          },
        },
        { new: true }
      );
    }

    console.log('Order created successfully:', order._id);
  } catch (error) {
    console.error('Error handling checkout session completed:', error.message);
  }
};

module.exports = {
  createCheckoutSession,
  stripeWebhook,
};
