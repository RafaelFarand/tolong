import React from "react";
import axios from "axios";

class Cart extends React.Component {
  state = {
    orders: [],
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      // Ambil userId dari token JWT
      const token = localStorage.getItem("token");
      let userId = null;
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload && payload.id;
      }
      if (!userId) throw new Error("User tidak ditemukan");
      const res = await axios.get(`/api/orders/user/${userId}`);
      this.setState({ orders: res.data, loading: false });
    } catch (err) {
      this.setState({ error: "Gagal memuat keranjang", loading: false });
    }
  }

  render() {
    const { orders, loading, error } = this.state;
    return (
      <div className="box" style={{ minWidth: 320 }}>
        <h4 className="title is-6 has-text-link mb-3">Keranjang Belanja</h4>
        {loading ? (
          <div>Memuat...</div>
        ) : error ? (
          <div className="notification is-danger is-light is-size-7 mb-2">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="has-text-grey-light">Keranjang kosong</div>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order.id} style={{ marginBottom: 8 }}>
                {order.product_name} x{order.quantity} - Rp{" "}
                {order.total_price?.toLocaleString("id-ID")}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default Cart;
