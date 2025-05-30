import axios from "axios";
import Loading from "../components/loading";
import BasePage from "./BasePage";
import { useNavigate } from "react-router-dom";

class Product extends BasePage {
  state = {
    products: [],
    filteredProducts: [],
    loading: true,
    error: null,
    role: null,
    selectedCategory: "sparepart",
    categories: ["sparepart", "oli", "aksesoris"],
  };

  async componentDidMount() {
    let role = null;
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        role = payload.role;
      }
    } catch {}
    this.setState({ loading: true, role });
    try {
      const res = await fetch("/api/products");
      const products = await res.json();
      this.setState({ products, filteredProducts: products, loading: false });
    } catch (err) {
      this.setState({ error: "Gagal memuat produk", loading: false });
    }
  }

  handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    this.setState({ selectedCategory }, this.filterProducts); // Panggil fungsi untuk filter produk
  };

  filterProducts = () => {
    const { selectedCategory, products } = this.state;
    if (selectedCategory) {
      const filteredProducts = products.filter(
        (product) => product.category === selectedCategory
      );
      this.setState({ filteredProducts });
    } else {
      this.setState({ filteredProducts: products });
    }
  };

  handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Silakan login untuk menambah ke keranjang.");
      return;
    }
    try {
      // Default quantity 1, total_price = product.price
      await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
          total_price: product.price,
        }),
      });
      alert("Produk berhasil dimasukkan ke keranjang!");
    } catch (err) {
      alert("Gagal menambah ke keranjang");
    }
  };

  handleDeleteProduct = async (productId) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Setelah hapus, refresh produk dari server
      const res = await fetch("/api/products");
      const products = await res.json();
      this.setState({
        products,
        filteredProducts: this.state.selectedCategory
          ? products.filter(
              (product) => product.category === this.state.selectedCategory
            )
          : products,
      });
      // Notifikasi sukses
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.setState({ error: null });
    } catch (err) {
      let msg = "Gagal menghapus produk";
      if (err.response && err.response.data && err.response.data.error) {
        if (
          err.response.data.error.includes("a foreign key constraint fails") ||
          err.response.data.error.includes(
            "Cannot delete or update a parent row"
          )
        ) {
          msg =
            "Tidak dapat menghapus produk karena masih ada order/transaksi yang menggunakan produk ini.";
        }
      }
      this.setState({ error: msg });
    }
  };

  render() {
    const {
      filteredProducts,
      loading,
      error,
      role,
      selectedCategory,
      categories,
    } = this.state;
    if (loading) return <Loading />;
    if (error) return <div className="notification is-danger">{error}</div>;

    return this.renderContainer(
      <div className="container is-widescreen">
        <div className="container">
          <h2 className="title has-text-link-dark has-text-centered">
            🏍️ Daftar Sparepart Motor
          </h2>

          {/* Filter kategori di atas grid produk */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: 18,
            }}
          >
            <div
              className="field has-addons"
              style={{
                borderRadius: 10,
                boxShadow: "0 2px 8px #f1efec55",
                padding: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
                minWidth: 0,
                maxWidth: 200,
                width: "100%",
              }}
            >
              <p className="control" style={{ marginBottom: 0 }}>
                <span className="icon is-small has-text-warning">
                  <i className="fas fa-filter"></i>
                </span>
              </p>
              <div className="control" style={{ flex: 1 }}>
                <div
                  className="select is-small is-warning"
                  style={{ width: "100%" }}
                >
                  <select
                    value={selectedCategory}
                    onChange={this.handleCategoryChange}
                    style={{
                      color: "var(--primary)",
                      background: "#fff",
                      border: "2px solid var(--blue)",
                      fontWeight: 600,
                      minWidth: 70,
                      fontSize: 13,
                      padding: "2px 4px",
                      width: "100%",
                    }}
                  >
                    <option value="sparepart">Sparepart</option>
                    <option value="oli">Oli</option>
                    <option value="aksesoris">Aksesoris Motor</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tampilkan produk yang sudah difilter */}
          <div
            className="columns is-multiline is-mobile"
            style={{ marginLeft: -10, marginRight: -10 }}
          >
            {/* Render produk */}
            {filteredProducts.length === 0 && (
              <div className="column is-12 has-text-centered has-text-grey">
                Tidak ada produk.
              </div>
            )}
            {filteredProducts.map((product, idx) => (
              <div
                key={product.id}
                className="column is-one-quarter-desktop is-one-third-tablet is-half-mobile"
                style={{ marginBottom: 32 }}
              >
                <div
                  className="card"
                  style={{
                    border: "2px solid #ffe082",
                    borderRadius: 16,
                    boxShadow: "0 6px 24px 0 rgba(255,224,130,0.13)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    overflow: "hidden",
                    background: "#fffde7",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.03)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 32px 0 rgba(255,224,130,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow =
                      "0 6px 24px 0 rgba(255,224,130,0.13)";
                  }}
                >
                  <div
                    className="card-image has-text-centered"
                    style={{
                      background: "var(--secondary-bg)",
                      padding: 24,
                      position: "relative",
                    }}
                  >
                    <figure
                      className="image is-128x128 is-inline-block"
                      style={{ margin: 0 }}
                    >
                      <img
                        src={product.image_url || "/logo192.png"}
                        alt={product.name}
                        style={{
                          objectFit: "cover",
                          borderRadius: 12,
                          boxShadow: "0 2px 8px 0 rgba(74,98,138,0.08)",
                        }}
                      />
                    </figure>
                    {role === "admin" && (
                      <span
                        className="tag is-warning is-light"
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          fontWeight: 700,
                          fontSize: 12,
                          letterSpacing: 1,
                          borderRadius: 8,
                          padding: "4px 10px",
                        }}
                      >
                        <i
                          className="fas fa-user-shield"
                          style={{ marginRight: 5 }}
                        ></i>
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="card-content" style={{ padding: 12 }}>
                    <p
                      className="title is-5"
                      style={{
                        color: "var(--primary)",
                        fontWeight: 600,
                        marginBottom: 2,
                        fontSize: 13,
                      }}
                    >
                      {product.name}
                    </p>
                    <p
                      className="subtitle is-6"
                      style={{
                        color: "var(--accent)",
                        fontWeight: 500,
                        marginBottom: 6,
                        fontSize: 12,
                      }}
                    >
                      Rp {product.price?.toLocaleString("id-ID")}
                    </p>
                    <p
                      className="has-text-grey"
                      style={{ fontSize: 11, minHeight: 24 }}
                    >
                      {product.description}
                    </p>
                  </div>
                  <footer
                    className="card-footer"
                    style={{
                      background: "var(--primary-bg)",
                      borderTop: "none",
                      display: "flex",
                      flexDirection: "row",
                      gap: 0,
                    }}
                  >
                    {role === "admin" ? (
                      <>
                        <button
                          className="card-footer-item button is-danger is-light"
                          style={{
                            borderRadius: 0,
                            borderBottomLeftRadius: 16,
                            fontWeight: 700,
                            color: "#c0392b",
                            borderRight: "1px solid #ffe0b2",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                          onClick={() => this.handleDeleteProduct(product.id)}
                        >
                          <i className="fas fa-trash-alt"></i> Hapus
                        </button>
                        <button
                          className="card-footer-item button is-warning is-light"
                          style={{
                            borderRadius: 0,
                            borderBottomRightRadius: 16,
                            fontWeight: 700,
                            color: "#b26a00",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                          onClick={() =>
                            this.props.navigate(`/edit-product/${product.id}`)
                          }
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                      </>
                    ) : (
                      <button
                        className="card-footer-item button is-link is-light"
                        style={{
                          borderRadius: 0,
                          borderBottomLeftRadius: 16,
                          borderBottomRightRadius: 16,
                          fontWeight: 600,
                        }}
                        onClick={() => this.handleAddToCart(product)}
                      >
                        Tambah ke Keranjang
                      </button>
                    )}
                  </footer>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

function ProductWithNavigate(props) {
  const navigate = useNavigate();
  return <Product {...props} navigate={navigate} />;
}

export default ProductWithNavigate;
