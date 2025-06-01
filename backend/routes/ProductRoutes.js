const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const multer = require("multer");
const path = require("path");

// Konfigurasi multer untuk penyimpanan di memori
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: File upload only supports images!"));
  },
});

// Rute
router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);
router.post("/", upload.single("image"), ProductController.create);
router.put("/:id", upload.single("image"), ProductController.update);
router.delete("/:id", ProductController.delete);

module.exports = router;