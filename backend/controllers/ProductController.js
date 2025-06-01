const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
const bucket = storage.bucket("tolong");

// Konfigurasi penyimpanan gambar dengan multer
const upload = multer({ storage }); // Menggunakan konfigurasi multer

// Pastikan semua method diekspor dengan benar
const ProductController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products", error });
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await Product.getProductById(req.params.id);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching product", error });
    }
  },

  create: async (req, res) => {
    const { name, price, stock, description, category } = req.body;
    try {
      let imageUrl = "";
      if (req.file) {
        // Upload ke Cloud Storage
        const blob = bucket.file(req.file.originalname);
        const blobStream = blob.createWriteStream({
          resumable: false,
          public: true,
        });

        await new Promise((resolve, reject) => {
          blobStream.on("error", (err) => reject(err));
          blobStream.on("finish", () => {
            imageUrl = `https://storage.googleapis.com/tolong/${blob.name}`;
            resolve();
          });
          blobStream.end(req.file.buffer);
        });
      }

      // Menyimpan produk ke database dengan path gambar yang di-upload
      await Product.createProduct(
        name,
        price,
        stock,
        imageUrl, // URL dari Cloud Storage
        description,
        category
      );

      res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to create product", error });
    }
  },

  update: async (req, res) => {
    const { name, price, stock, description, category } = req.body;
    try {
      let imageUrl = "";
      if (req.file) {
        const blob = bucket.file(req.file.originalname);
        const blobStream = blob.createWriteStream({
          resumable: false,
          public: true,
        });

        await new Promise((resolve, reject) => {
          blobStream.on("error", (err) => reject(err));
          blobStream.on("finish", () => {
            imageUrl = `https://storage.googleapis.com/tolong/${blob.name}`;
            resolve();
          });
          blobStream.end(req.file.buffer);
        });
      }

      await Product.updateProduct(
        req.params.id,
        name,
        price,
        stock,
        imageUrl || req.body.image, // Use existing image if no new file
        description,
        category
      );
      res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update product", error });
    }
  },

  delete: async (req, res) => {
    try {
      await Product.deleteProduct(req.params.id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting product", error });
    }
  },
};

module.exports = ProductController;