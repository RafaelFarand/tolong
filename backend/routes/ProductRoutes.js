const express = require("express");
const router = express.Router();
const controller = require("../controllers/ProductController");
const verifyToken = require("../middleware/VerifyToken");
const multer = require("multer");

// Konfigurasi multer: menyimpan file di memory (untuk dikirim ke Google Cloud Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Product Routes
router.post("/", verifyToken, upload.single("image"), controller.create);
router.put("/:id", verifyToken, upload.single("image"), controller.update);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;
