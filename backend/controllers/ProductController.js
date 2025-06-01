const Product = require("../models/ProductModel");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
const bucketName = "tolong"; // Changed to your bucket name
const bucket = storage.bucket(bucketName);
const path = require("path");

// Create product
exports.create = async (req, res) => {
  const { name, price, stock, description, category } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No image file provided." });
  }

  if (!name || !price || !stock || !description || !category) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const blob = bucket.file(
    `uploads/${Date.now()}${path.extname(file.originalname)}`
  );
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on("error", (err) => {
    console.error("GCP UPLOAD ERROR:", err);
    if (!res.headersSent) {
      return res.status(500).json({
        message: "Error uploading file to GCP",
        error: err.message || err,
      });
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
      console.error("CREATE PRODUCT DB ERROR:", error);
      if (!res.headersSent) {
        res.status(500).json({
          message: "Failed to create product",
          error: error.message || error,
        });
      }
    }
  });

  blobStream.end(file.buffer);
};

// Get all products
exports.getAll = async (req, res) => {
  try {
    const [products] = await Product.getAllProducts();
    const updatedProducts = products.map((product) => {
      if (product.image_url) {
        if (!product.image_url.startsWith("https://")) {
          product.image_url = `https://storage.googleapis.com/${bucketName}/${product.image_url}`;
        }
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
    if (productData.image_url && !productData.image_url.startsWith("https://")) {
      productData.image_url = `https://storage.googleapis.com/${bucketName}/${productData.image_url}`;
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
  let imageUrl;

  try {
    // Get existing product
    const [existingProduct] = await Product.getProductById(id);
    if (!existingProduct || existingProduct.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.file) {
      // Upload new image
      const blob = bucket.file(
        `uploads/${Date.now()}${path.extname(req.file.originalname)}`
      );
      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      blobStream.on("error", (err) => {
        throw new Error(`Error uploading file to GCP: ${err.message}`);
      });

      // Handle new image upload
      await new Promise((resolve, reject) => {
        blobStream.on("finish", () => {
          imageUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
          resolve();
        });
        blobStream.on("error", reject);
        blobStream.end(req.file.buffer);
      });
    }

    // Update product with new or existing image
    await Product.updateProduct(
      id,
      name || existingProduct[0].name,
      price || existingProduct[0].price,
      stock || existingProduct[0].stock,
      imageUrl || existingProduct[0].image_url,
      description || existingProduct[0].description,
      category || existingProduct[0].category
    );

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// Delete product
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const [product] = await Product.getProductById(id);
    if (product && product.length > 0 && product[0].image_url) {
      // Delete image from GCP if exists
      const fileName = product[0].image_url.split("/").pop();
      try {
        await bucket.file(`uploads/${fileName}`).delete();
      } catch (deleteError) {
        console.error("Failed to delete image from GCP:", deleteError);
      }
    }

    await Product.deleteProduct(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error });
  }
};