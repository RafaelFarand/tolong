const Product = require("../models/ProductModel");
const { uploadFile } = require("../config/Storage");
const multer = require("multer");
const path = require("path");

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
  const { name, price, stock, description, category } = req.body;
  let image = "";
  if (req.file) {
    try {
      image = await uploadFile(req.file); // upload ke GCS
    } catch (err) {
      return res.status(500).json({ message: "Gagal upload gambar", error: err });
    }
  }
  try {
    await Product.createProduct(
      name,
      price,
      stock,
      image,
      description,
      category
    );
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const db = require('../config/Database');
    await db.execute('DELETE FROM orders WHERE product_id = ?', [id]);
    await Product.deleteProduct(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
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
  const { name, price, stock, description, category } = req.body;
  let image;
  if (req.file) {
    try {
      image = await uploadFile(req.file); // upload ke GCS
    } catch (err) {
      return res.status(500).json({ message: "Gagal upload gambar", error: err });
    }
  } else {
    const [product] = await Product.getProductById(id);
    image = product[0]?.image_url || "";
  }
  try {
    await Product.updateProduct(
      id,
      name,
      price,
      stock,
      image,
      description,
      category
    );
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error });
  }
};