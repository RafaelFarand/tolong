const express = require("express");
const router = express.Router();
const controller = require("../controllers/ProductController");
const verifyToken = require("../middleware/VerifyToken");
const multer = require("multer");

// Konfigurasi multer untuk menyimpan file di memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diperbolehkan'));
    }
  }
});

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", verifyToken, upload.single("image"), controller.create);
router.put("/:id", verifyToken, upload.single("image"), controller.update);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;
