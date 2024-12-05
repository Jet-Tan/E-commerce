const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const {
  authMiddleWare,
  authUserMiddleWare,
} = require("../middleware/authMiddleware");

router.post("/create-product", productController.createProduct);
router.put(
  "/update-product/:id",
  authMiddleWare,
  productController.updateProduct
);
router.delete(
  "/delete-product/:id",
  authMiddleWare,
  productController.deleteProduct
);
router.get("/get-all-product", productController.getAllProduct);
router.get("/get-detail-product/:id", productController.getDetailProduct);
router.post("/delete-many", authMiddleWare, productController.deleteMany);
router.get("/get-all-type", productController.getAllType);

module.exports = router;
