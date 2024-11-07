// models/orderModel.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number,
  }],
  totalAmount: Number,
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'Processing' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
