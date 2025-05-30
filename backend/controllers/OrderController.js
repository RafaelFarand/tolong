const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

exports.getAll = async (req, res) => {
  try {
    const [orders] = await Order.getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  const [order] = await Order.getOrderById(id);
  res.json(order[0]);
};

exports.create = async (req, res) => {
  const { product_id, quantity, total_price } = req.body;
  const user_id = req.user.id; // ambil dari token
  try {
    // Cek apakah order sudah ada
    const [existing] = await Order.findPendingOrderByUserAndProduct(
      user_id,
      product_id
    );
    if (existing.length > 0) {
      // Jika sudah ada, update quantity dan total_price
      const order = existing[0];
      // Hitung ulang total_price berdasarkan harga produk * quantity baru
      // Ambil harga produk dari database (hindari penjumlahan total lama + total baru)
      const [[productRow]] = await Order.getProductById(product_id);
      const productPrice = productRow ? productRow.price : 0;
      const newQty = order.quantity + quantity;
      const newTotal = productPrice * newQty;
      await Order.updateOrder(order.id, newQty, newTotal);
      return res.status(200).json({ message: "Order updated" });
    } else {
      // Jika belum ada, insert baru
      await Order.createOrder(user_id, product_id, quantity, total_price);
      return res.status(201).json({ message: "Order created" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { quantity, total_price } = req.body;

  if (quantity === undefined || total_price === undefined) {
    return res.status(400).json({ message: "Missing quantity or total_price" });
  }

  try {
    await Order.updateOrder(id, quantity, total_price);
    res.json({ message: "Order updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await Order.deleteOrder(id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const [orders] = await Order.getOrdersByUserId(userId);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCheckedOutByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const [orders] = await Order.getCheckedOutOrdersByUserId(userId);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkoutAll = async (req, res) => {
  console.log("USER:", req.user); // Cek req.user di log server

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized or token missing" });
  }

  const userId = req.user.id;

  try {
    console.log("User ID:", userId); // Pastikan userId benar

    const [orders] = await Order.getPendingOrdersByUserId(userId);
    if (orders.length === 0) {
      return res.status(400).json({ message: "No pending orders to checkout" });
    }

    const total = orders.reduce((sum, order) => sum + order.total_price, 0);

    // Cek stok produk sebelum checkout
    for (const order of orders) {
      const [[product]] = await Product.getProductById(order.product_id);
      if (!product || product.stock < order.quantity) {
        return res.status(400).json({
          message: `Stok produk '${
            product?.name || "Unknown"
          }' tidak cukup untuk checkout (tersisa: ${
            product?.stock || 0
          }, diminta: ${order.quantity})`,
        });
      }
    }
    // Kurangi stok produk untuk setiap order yang di-checkout
    for (const order of orders) {
      await Product.reduceProductStock(order.product_id, order.quantity);
    }
    await Order.checkoutAllOrdersByUserId(userId);

    res.json({
      message: "Checkout successful",
      total_price: total,
      total_items: orders.length,
      orders,
    });
  } catch (err) {
    console.error("Error:", err); // Log error untuk debugging
    res.status(500).json({ error: err.message });
  }
};

exports.checkoutById = async (req, res) => {
  const { id } = req.params; // Ambil id order dari parameter
  const userId = req.user?.id; // Ambil userId dari token yang sudah terverifikasi

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Cari order berdasarkan userId dan orderId yang diberikan
    const [order] = await Order.getOrderByIdAndUserId(id, userId);

    if (!order.length) {
      return res
        .status(404)
        .json({ message: "Order not found or unauthorized" });
    }

    if (order[0].status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be checked out" });
    }

    // Cek stok produk sebelum checkout
    const [[product]] = await Product.getProductById(order[0].product_id);
    if (!product || product.stock < order[0].quantity) {
      return res.status(400).json({
        message: `Stok produk '${
          product?.name || "Unknown"
        }' tidak cukup untuk checkout (tersisa: ${
          product?.stock || 0
        }, diminta: ${order[0].quantity})`,
      });
    }
    // Update status order menjadi checked_out
    await Order.checkoutOrderById(id);
    // Kurangi stok produk sesuai quantity order
    await Product.reduceProductStock(order[0].product_id, order[0].quantity);

    res.json({
      message: "Order checked out successfully",
      order: order[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
