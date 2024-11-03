const Banner = require("../models/bannerModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createBanner = asyncHandler(async (req, res) => {
  try {
    const newBanner = await Banner.create(req.body);
    res.json(newBanner);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedBanner = await Banner.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedBanner);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedBanner = await Banner.findByIdAndDelete(id);
    res.json(deletedBanner);
  } catch (error) {
    throw new Error(error);
  }
});

const getBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const banner = await Banner.findById(id);
    res.json(banner);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBanners = asyncHandler(async (req, res) => {
  try {
    const banners = await Banner.find();
    console.log(banners);
    res.json(banners);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBanner,
  updateBanner,
  deleteBanner,
  getBanner,
  getAllBanners,
};
