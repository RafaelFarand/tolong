import React from "react";
import axios from "axios";

function CheckoutHistory() {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        let userId = null;
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          userId = payload && payload.id;
        }
        if (!userId) throw new Error("User tidak ditemukan");
        const res = await axios.get(`/api/orders/user/${userId}/checkedout`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        setError("Gagal memuat riwayat checkout");
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <section className="section">
      <div className="box" style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2 className="title has-text-centered has-text-link-dark mb-5">
          Riwayat Checkout
        </h2>
        {loading ? (
          <div>Memuat...</div>
        ) : error ? (
          <div className="notification is-danger is-light is-size-7 mb-2">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="has-text-grey-light">
            Belum ada barang yang di-checkout
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {orders.map((order) => (
              <li
                key={order.id}
                style={{
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  background: "var(--secondary-bg)",
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <img
                  src={order.image_url || order.product_image || "/logo192.png"}
                  alt={order.product_name || order.name || "Produk"}
                  style={{
                    width: 56,
                    height: 56,
                    objectFit: "cover",
                    borderRadius: 8,
                    marginRight: 16,
                    background: "#fff",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "var(--primary)",
                      fontSize: 15,
                    }}
                  >
                    {order.product_name || order.name || "(Tanpa Nama)"}
                  </div>
                  <div
                    style={{
                      color: "var(--accent)",
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    Rp {order.total_price?.toLocaleString("id-ID")}
                  </div>
                  <div style={{ color: "#888", fontSize: 13 }}>
                    x{order.quantity}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default CheckoutHistory;
