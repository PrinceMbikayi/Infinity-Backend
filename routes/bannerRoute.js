const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createBanner, getAllBanners, updateBanner, deleteBanner, getBanner } = require('../controller/bannerCtr');

// Create new banner - Admin only
router.route('/admin/banner/new').post(authMiddleware, isAdmin, createBanner);

// Get all banners - Public
router.route('/banners').get(getAllBanners);

// Get single banner
router.route('/banner/:id').get(getBanner);

// Update banner - Admin only
router.route('/admin/banner/:id').put(authMiddleware, isAdmin, updateBanner);

// Delete banner - Admin only 
router.route('/admin/banner/:id').delete(authMiddleware, isAdmin, deleteBanner);

module.exports = router;
