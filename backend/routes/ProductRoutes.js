const express = require("express");
const router = express.Router();
const controller = require("../controllers/ProductController");
const verifyToken = require("../middleware/VerifyToken");
const multer = require("multer");
const {Storage} = require('@google-cloud/storage');

// Initialize storage with credentials
const storage = new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || 'b-01-450713-b4127fd5bf61.json'
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

router.post("/", verifyToken, upload.single("image"), controller.create);
router.put("/:id", verifyToken, upload.single("image"), controller.update);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;