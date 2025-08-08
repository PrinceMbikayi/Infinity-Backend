const express = require("express");
const {
  createUser,
  createAdmin,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
  uploadProfileImage,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  userCart,
  getUserCart,
  saveAddress,
  createOrder,
  emptyCart,
  removeProductFromCart,
  updateProductQuantityFromCart,
  getMyOrders,
  getMonthWiseOrderIncome,
  getYearlyTotalOrders,
  getAllOrders,
  getSingleOrders,
  updateOrder,
  getAdminProfile,
  updateAdminProfile,
  updateAdminPassword,
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { uploadPhoto, profileImgResize } = require("../middlewares/uploadImage");
const { checkout, paymentVerification } = require("../controller/paymentCtrl");
const router = express.Router();
router.post("/register", createUser);
router.post("/admin-register", createAdmin);
router.post("/forgot-password-token", forgotPasswordToken);

router.put("/reset-password/:token", resetPassword);

router.put("/password", authMiddleware, updatePassword);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.post("/cart", authMiddleware, userCart);
router.post('/order/checkout', authMiddleware, checkout)
router.post("/order/paymentVerification",authMiddleware,paymentVerification)
/* router.post("/cart/applycoupon", authMiddleware, applyCoupon); */
router.post("/cart/create-order", authMiddleware, createOrder);
router.get("/all-users", getallUser);
 router.get("/getmyorders", authMiddleware, getMyOrders);
router.get("/getallorders", authMiddleware, isAdmin, getAllOrders);
router.get("/getaOrder/:id", authMiddleware, isAdmin, getSingleOrders);
router.put("/updateOrder/:id", authMiddleware, isAdmin, updateOrder);
/*Wrouter.post("/getorderbyuser/:id", authMiddleware, isAdmin, getAllOrders); */
router.get("/getMonthWiseOrderIncome", authMiddleware,isAdmin, getMonthWiseOrderIncome);
router.get("/getyearlyorders", authMiddleware,isAdmin, getYearlyTotalOrders);

router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);
router.get("/profile", authMiddleware, getaUser);

// Admin Profile Routes - must come before /:id route
router.get("/admin-profile", authMiddleware, isAdmin, getAdminProfile);
router.put("/admin-profile", authMiddleware, isAdmin, updateAdminProfile);
router.put("/admin-password", authMiddleware, isAdmin, updateAdminPassword);

// Generic user route with ID parameter - must come after specific routes
router.get("/:id", authMiddleware, isAdmin, getaUser);
router.delete("/delete-product-cart/:cartItemId", authMiddleware, removeProductFromCart);
router.delete("/update-product-cart/:cartItemId/:newQuantiy", authMiddleware, updateProductQuantityFromCart);

/* router.delete("/empty-cart", authMiddleware, emptyCart);
 */
router.delete("/:id", deleteaUser);
/* router.put(
  "/order/update-order/:id",
  authMiddleware,
  isAdmin,
  updateOrderStatus
); */
router.put("/edit-user", authMiddleware, updatedUser);
router.put("/upload-profile-image", authMiddleware, uploadPhoto.single("image"), profileImgResize, uploadProfileImage);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
