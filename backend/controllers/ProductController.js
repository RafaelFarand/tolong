const Product = require("../models/ProductModel");
const { uploadFile, deleteFile } = require("../config/Storage");

exports.getAll = async (req, res) => {
  try {
    const [products] = await Product.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to get products", error });
  }
};

exports.getById = async (req, res) => {
  try {
    const [product] = await Product.getProductById(req.params.id);
    if (!product.length)
      return res.status(404).json({ message: "Product not found" });
    res.json(product[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to get product", error });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, price, stock, description, category } = req.body;
    let imageUrl = "";

    if (req.file) {
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
      imageUrl,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock, description, category } = req.body;
    let imageUrl = undefined;

    // Tambahkan logging untuk debug
    console.log("Update request:", {
      id,
      body: req.body,
      file: req.file,
    });

    // Get existing product
    const [existingProduct] = await Product.getProductById(id);
    if (!existingProduct.length) {
      console.log("Product not found:", id);
      return res.status(404).json({ message: "Product not found" });
    }

    // Handle image upload if new image provided
    if (req.file) {
      try {
        // Delete old image if exists
        if (existingProduct[0].image_url) {
          await deleteFile(existingProduct[0].image_url);
        }
        // Upload new image
        imageUrl = await uploadFile(req.file);
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        return res.status(500).json({
          message: "Failed to upload image",
          error: uploadError.message,
        });
      }
    }

    // Prepare update data
    const updateData = {
      name: name || existingProduct[0].name,
      price: price || existingProduct[0].price,
      stock: stock !== undefined ? stock : existingProduct[0].stock,
      description: description || existingProduct[0].description,
      category: category || existingProduct[0].category,
      image_url:
        imageUrl !== undefined
          ? imageUrl
          : existingProduct[0].image_url,
    };

    console.log("Update data:", updateData);

    // Update product
    await Product.updateProduct(
      id,
      updateData.name,
      updateData.price,
      updateData.stock,
      updateData.image_url,
      updateData.description,
      updateData.category
    );

    res.json({
      message: "Product updated successfully",
      data: updateData,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    // Get product details first
    const [product] = await Product.getProductById(id);
    if (!product.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete image from Cloud Storage if exists
    if (product[0].image_url) {
      await deleteFile(product[0].image_url);
    }

    // Delete product from database
    await Product.deleteProduct(id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Failed to delete product", error });
  }
};
