const Product = require("../models/ProductModel");
const { uploadFile } = require("../config/Storage");

exports.getAll = async (req, res) => {
  const [products] = await Product.getAllProducts();
  res.json(products);
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  const [product] = await Product.getProductById(id);
  res.json(product[0]);
};

exports.create = async (req, res) => {
  try {
    const { name, price, stock, description, category } = req.body;
    let imageUrl = '';

    if (req.file) {
      // Upload ke Cloud Storage
      imageUrl = await uploadFile(req.file);
    }

    await Product.createProduct(
      name,
      price,
      stock,
      imageUrl,
      description,
      category
    );

    res.status(201).json({ 
      message: "Product created successfully",
      imageUrl 
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      message: "Failed to create product", 
      error: error.message 
    });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    // Hapus semua order yang terkait dengan produk ini (baik pending maupun checked_out)
    const db = require('../config/Database');
    await db.execute('DELETE FROM orders WHERE product_id = ?', [id]);
    // Hapus produk setelah semua order terkait dihapus
    await Product.deleteProduct(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    // Tangani error constraint foreign key
    let msg = "Failed to delete product";
    if (
      error &&
      error.sqlMessage &&
      error.sqlMessage.includes("a foreign key constraint fails")
    ) {
      msg =
        "Tidak dapat menghapus produk karena masih ada order/transaksi yang menggunakan produk ini.";
    }
    res.status(500).json({ error: msg });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const { name, price, stock, description, category } = req.body;
    let imageUrl = undefined;

    if (req.file) {
      imageUrl = await uploadFile(req.file);
    }

    await Product.updateProduct(
      id,
      name,
      price,
      stock,
      imageUrl,
      description,
      category
    );

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error });
  }
};
