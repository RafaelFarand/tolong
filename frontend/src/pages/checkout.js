import React from "react";
import axios from "axios";
import { Navigate, useLocation } from "react-router-dom";

function CheckoutPage() {
  const location = useLocation();
  const { selectedOrders, orders } = location.state || {};
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      // Checkout semua order yang dipilih
      await Promise.all(
        selectedOrders.map((orderId) =>
          axios.put(
            `/api/orders/checkout/${orderId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );
      setSuccess(true);
    } catch (err) {
      setError("Checkout gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (success) return <Navigate to="/cart" replace />;
  if (!selectedOrders || !orders) return <Navigate to="/cart" replace />;

  const selectedOrderDetails = orders.filter((o) =>
    selectedOrders.includes(o.id)
  );
  const total = selectedOrderDetails.reduce(
    (sum, o) => sum + (o.total_price || 0),
    0
  );

  return (
    <section className="section">
      <div className="box" style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2 className="title has-text-centered has-text-link-dark mb-5">
          Checkout
        </h2>
        {error && (
          <div className="notification is-danger is-light is-size-7 mb-3">
            {error}
          </div>
        )}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {selectedOrderDetails.map((order) => (
            <li
              key={order.id}
              style={{
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={order.image_url || order.product_image || "/logo192.png"}
                alt={order.product_name || order.name || "Produk"}
                style={{
                  width: 48,
                  height: 48,
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
        <div className="mt-4 mb-4 has-text-right">
          <span className="is-size-5 has-text-weight-bold">
            Total: Rp {total.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="has-text-right">
          <button
            className={`button is-link is-medium${
              loading ? " is-loading" : ""
            }`}
            onClick={handleCheckout}
            disabled={loading}
          >
            Konfirmasi & Bayar
          </button>
        </div>
      </div>
    </section>
  );
}

export default CheckoutPage;
