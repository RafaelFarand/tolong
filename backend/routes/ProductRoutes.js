const express = require("express");
const router = express.Router();
const controller = require("../controllers/ProductController");
const verifyToken = require("../middleware/VerifyToken");
const multer = require("multer");
const { Storage } = require('@google-cloud/storage');

// Initialize Google Cloud Storage
const storage = new Storage();
const bucketName = "tolong"; // Changed to your bucket name
const bucket = storage.bucket(bucketName);

// Multer configuration
const multerStorage = multer.memoryStorage();
const upload = multer({ 
  storage: multerStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Product routes
router.post("/add", verifyToken, upload.single("image"), controller.create);
router.put("/:id", verifyToken, upload.single("image"), controller.update);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;