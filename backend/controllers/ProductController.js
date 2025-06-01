const Product = require("../models/ProductModel");
const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
const path = require("path");

// Konfigurasi penyimpanan gambar di memory
const upload = multer({ storage: multer.memoryStorage() });

// Konfigurasi Google Cloud Storage
const storage = new Storage();
const bucketName = "tolong";
const bucket = storage.bucket(bucketName);

// Middleware untuk meng-handle upload
exports.upload = upload.single("image");

// Create product with image upload to GCS
exports.create = async (req, res) => {
  const { name, price, stock, description, category } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No image file provided." });
  }

  // Validasi field
  if (!name || !price || !stock || !description || !category) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const blob = bucket.file(`uploads/${Date.now()}${path.extname(file.originalname)}`);
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: file.mimetype,
  });

  blobStream.on("error", (err) => {
    console.error("GCP UPLOAD ERROR:", err);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Error uploading file", error: err.message });
    }
  });

  blobStream.on("finish", async () => {
    const imageUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
    try {
      await Product.createProduct(
        name,
        price,
        stock,
        imageUrl,
        description,
        category
      );
      res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);
      res.status(500).json({ message: "Failed to create product", error });
    }
  });

  blobStream.end(file.buffer);
};

// Get all products
exports.getAll = async (req, res) => {
  try {
    const [products] = await Product.getAllProducts();
    const updatedProducts = products.map(product => {
      if (product.image_url) {
        product.image_url = `https://storage.googleapis.com/${bucketName}/uploads/${path.basename(product.image_url)}`;
      }
      return product;
    });
    res.json(updatedProducts);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve products", error });
  }
};

// Get product by ID
exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const [product] = await Product.getProductById(id);
    if (!product || product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    const productData = product[0];
    if (productData.image_url) {
      productData.image_url = `https://storage.googleapis.com/${bucketName}/uploads/${path.basename(productData.image_url)}`;
    }
    res.json(productData);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve product", error });
  }
};

// Update product
exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, description, category } = req.body;
  let imageUrl = "";

  try {
    if (req.file) {
      const blob = bucket.file(`uploads/${Date.now()}${path.extname(req.file.originalname)}`);
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: req.file.mimetype,
      });

      blobStream.end(req.file.buffer);

      await new Promise((resolve, reject) => {
        blobStream.on("finish", resolve);
        blobStream.on("error", reject);
      });

      imageUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
    } else {
      const [product] = await Product.getProductById(id);
      imageUrl = product[0]?.image_url || "";
    }

    await Product.updateProduct(id, name, price, stock, imageUrl, description, category);
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error });
  }
};

// Delete product
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const db = require("../config/Database");
    await db.execute("DELETE FROM orders WHERE product_id = ?", [id]);
    await Product.deleteProduct(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    let msg = "Failed to delete product";
    if (error?.sqlMessage?.includes("a foreign key constraint fails")) {
      msg = "Tidak dapat menghapus produk karena masih ada order/transaksi.";
    }
    res.status(500).json({ error: msg });
  }
};
