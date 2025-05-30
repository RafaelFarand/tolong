const express = require("express");
const router = express.Router();
const controller = require("../controllers/OrderController");
const verifyToken = require("../middleware/VerifyToken");

// CRUD order
router.get("/", verifyToken, controller.getAll);
router.get("/:id", verifyToken, controller.getById);
router.post("/", verifyToken, controller.create);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);
router.get("/user/:userId", verifyToken, controller.getByUserId);
router.put("/checkout", verifyToken, controller.checkoutAll);
router.put("/checkout/:id", verifyToken, controller.checkoutById);
router.get(
  "/user/:userId/checkedout",
  verifyToken,
  controller.getCheckedOutByUserId
);

module.exports = router;
