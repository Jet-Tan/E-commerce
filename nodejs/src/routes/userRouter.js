const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  authMiddleWare,
  authUserMiddleWare,
} = require("../middleware/authMiddleware");
router.post("/sign-up", userController.createUser);
router.post("/sign-in", userController.loginUser);
router.post("/log-out", userController.logoutUser);
router.put("/update-user/:id", authUserMiddleWare, userController.updateUser);
router.delete("/delete-user/:id", authMiddleWare, userController.deleteUser);
router.get("/get-all-user", userController.getAllUser);
router.get("/get-detail-user/:id", userController.getDetailUser);
router.post("/refresh-token", userController.refreshToken);
router.post("/delete-many", authMiddleWare, userController.deleteMany);
module.exports = router;
