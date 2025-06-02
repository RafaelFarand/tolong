const express = require("express");
const router = express.Router();
const controller = require("../controllers/ProductController");
const verifyToken = require("../middleware/VerifyToken");
const multer = require("multer");
const path = require("path"); // Pastikan path diimpor di sini

// Konfigurasi multer (menyimpan file gambar)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Menyimpan file gambar di folder 'uploads'
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Mengambil ekstensi file
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

// Menambahkan middleware untuk upload gambar
router.post("/", verifyToken, upload.single("image"), controller.create);
router.put("/:id", verifyToken, upload.single("image"), controller.update);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;