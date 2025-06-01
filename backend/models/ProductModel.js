const db = require("../config/Database");

class Product {
  static getAllProducts() {
    return db.execute("SELECT * FROM products");
  }

  static getProductById(id) {
    return db.execute("SELECT * FROM products WHERE id = ?", [id]);
  }

  static createProduct(name, price, stock, imageUrl, description, category) {
    return db.execute(
      "INSERT INTO products (name, price, stock, image_url, description, category) VALUES (?, ?, ?, ?, ?, ?)",
      [name, price, stock, imageUrl, description, category]
    );
  }

  static updateProduct(id, name, price, stock, imageUrl, description, category) {
    const updates = [];
    const values = [];

    if (name) {
      updates.push("name = ?");
      values.push(name);
    }
    if (price) {
      updates.push("price = ?");
      values.push(price);
    }
    if (stock !== undefined) {
      updates.push("stock = ?");
      values.push(stock);
    }
    if (imageUrl) {
      updates.push("image_url = ?");
      values.push(imageUrl);
    }
    if (description) {
      updates.push("description = ?");
      values.push(description);
    }
    if (category) {
      updates.push("category = ?");
      values.push(category);
    }

    values.push(id);

    return db.execute(
      `UPDATE products SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
  }

  static deleteProduct(id) {
    return db.execute("DELETE FROM products WHERE id = ?", [id]);
  }
}

module.exports = Product;
