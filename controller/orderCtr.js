// controllers/orderController.js
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');

// Get all orders for an admin
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('products.product');
    res.json(orders);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Get orders for a specific user
const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  try {
    const orders = await Order.find({ user: userId }).populate('products.product');
    res.json(orders);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Delete an order
const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  try {
    await Order.findByIdAndDelete(orderId);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = {
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
};
