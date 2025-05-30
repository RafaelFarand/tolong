import React from "react";
import BasePage from "./BasePage";
import axios from "axios";

class Home extends BasePage {
  state = {
    carouselIndex: 0,
    products: [],
    loading: true,
    error: null,
    animating: false,
    direction: "right",
  };

  async componentDidMount() {
    try {
      const res = await axios.get("/api/products");
      this.setState({ products: res.data, loading: false });
      this.carouselTimer = setInterval(() => this.nextCarousel("right"), 3500);
    } catch (err) {
      this.setState({ error: "Gagal memuat produk", loading: false });
    }
  }
  componentWillUnmount() {
    clearInterval(this.carouselTimer);
  }
  nextCarousel = (direction = "right") => {
    const { products, animating } = this.state;
    if (!products.length || animating) return;
    this.setState({ animating: true, direction });
    setTimeout(() => {
      this.setState((prev) => ({
        carouselIndex:
          direction === "right"
            ? (prev.carouselIndex + 1) % Math.min(products.length, 3)
            : (prev.carouselIndex - 1 + Math.min(products.length, 3)) %
              Math.min(products.length, 3),
        animating: false,
      }));
    }, 350); // durasi animasi
  };
  setCarousel = (idx) => {
    const { carouselIndex, animating } = this.state;
    if (animating || idx === carouselIndex) return;
    this.nextCarousel(idx > carouselIndex ? "right" : "left");
    setTimeout(() => this.setState({ carouselIndex: idx }), 350);
  };

  render() {
    const { carouselIndex, products, loading, error, animating, direction } =
      this.state;
    const featured = products.slice(0, 3);
    const product = featured[carouselIndex] || {};
    return this.renderContainer(
      <section className="section" style={{ minHeight: "100vh" }}>
        <div className="container" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="has-text-centered mb-5">
            <h1
              className="title is-2 mb-2"
              style={{
                color: "red",
                fontWeight: 800,
                letterSpacing: 1,
              }}
            >
               Selamat Datang di Allparts Motorcycle Store!
            </h1>
            <p
              className="subtitle is-5"
              style={{
                color: "#1976d2", // biru
                fontWeight: 500,
                marginBottom: 0,
              }}
            >
              Temukan berbagai suku cadang & aksesoris motor terbaik dengan harga
              terjangkau dan kualitas terjamin.
            </p>
          </div>
          {loading ? (
            <div className="has-text-centered">Memuat produk...</div>
          ) : error ? (
            <div className="notification is-danger is-light has-text-centered">
              {error}
            </div>
          ) : featured.length === 0 ? (
            <div className="has-text-centered has-text-grey">
              Belum ada produk tersedia.
            </div>
          ) : (
            <>
              {/* Banner/Carousel */}
              <div
                className="box"
                style={{
                  background: "var(--secondary-bg)",
                  borderRadius: 22,
                  boxShadow: "0 4px 24px #7ab2d320",
                  marginBottom: 40,
                  padding: 0,
                  overflow: "hidden",
                }}
              >
                <div
                  className="columns is-vcentered is-mobile"
                  style={{
                    minHeight: 220,
                    margin: 0,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="column is-5 has-text-centered"
                    style={{ padding: 32, position: "relative", height: 180 }}
                  >
                    <div
                      style={{
                        width: 150,
                        height: 150,
                        margin: "0 auto",
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        transition:
                          "transform 0.35s cubic-bezier(.4,2,.6,1), opacity 0.35s",
                        transform: animating
                          ? direction === "right"
                            ? "translateX(-80px) scale(0.9)"
                            : "translateX(80px) scale(0.9)"
                          : "translateX(0) scale(1.08)",
                        opacity: animating ? 0.3 : 1,
                        zIndex: 2,
                      }}
                    >
                      <img
                        src={product.image_url || "/logo192.png"}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 18,
                          boxShadow: "0 2px 12px #4a628a22",
                        }}
                      />
                    </div>
                  </div>
                  <div className="column is-7" style={{ padding: 32 }}>
                    <h2
                      className="title is-3 mb-1"
                      style={{ color: "var(--primary)", fontWeight: 700 }}
                    >
                      {product.name}
                    </h2>
                    <p
                      className="subtitle is-5 mb-2"
                      style={{ color: "var(--accent)", fontWeight: 600 }}
                    >
                      Rp {product.price?.toLocaleString("id-ID")}
                    </p>
                    <p
                      style={{
                        color: "#555",
                        fontSize: 16,
                        marginBottom: 18,
                        minHeight: 32,
                      }}
                    >
                      {product.description}
                    </p>
                    <a
                      href="/products"
                      className="button is-link is-medium"
                      style={{ fontWeight: 600, borderRadius: 8 }}
                    >
                      Lihat Semua Produk
                    </a>
                  </div>
                </div>
                {/* Carousel dots & nav */}
                <div className="has-text-centered mt-2 mb-2">
                  <button
                    className="button is-small is-light mr-2"
                    style={{ borderRadius: 20, minWidth: 32 }}
                    onClick={() => this.nextCarousel("left")}
                    disabled={animating}
                  >
                    &#8592;
                  </button>
                  {featured.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => this.setCarousel(idx)}
                      style={{
                        width: 13,
                        height: 13,
                        borderRadius: "50%",
                        margin: "0 5px",
                        border: "none",
                        background:
                          idx === carouselIndex ? "var(--accent)" : "#dff2eb",
                        boxShadow:
                          idx === carouselIndex
                            ? "0 0 0 2px var(--primary)"
                            : "none",
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                      aria-label={`Pilih produk unggulan ${idx + 1}`}
                    />
                  ))}
                  <button
                    className="button is-small is-light ml-2"
                    style={{ borderRadius: 20, minWidth: 32 }}
                    onClick={() => this.nextCarousel("right")}
                    disabled={animating}
                  >
                    &#8594;
                  </button>
                </div>
              </div>

              {/* Produk Unggulan Section */}
              <h2
                className="title has-text-centered mb-4"
                style={{
                  color: "var(--primary)",
                  fontWeight: 700,
                  fontSize: 28,
                }}
              >
                Sparepart Motor Unggulan
              </h2>
              <div
                className="columns is-multiline is-mobile"
                style={{ marginLeft: -10, marginRight: -10 }}
              >
                {featured.map((product, idx) => (
                  <div
                    key={product.id}
                    className="column is-one-third-desktop is-half-tablet is-12-mobile"
                    style={{ marginBottom: 32 }}
                  >
                    <div
                      className="card"
                      style={{
                        border: "none",
                        borderRadius: 18,
                        boxShadow: "0 4px 16px 0 rgba(122,178,211,0.10)",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        overflow: "hidden",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.04)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                      onClick={() => (window.location.href = "/products")}
                    >
                      <div
                        className="card-image has-text-centered"
                        style={{
                          background: "var(--secondary-bg)",
                          padding: 24,
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
                              borderRadius: 14,
                              boxShadow: "0 2px 8px 0 rgba(74,98,138,0.08)",
                            }}
                          />
                        </figure>
                      </div>
                      <div className="card-content" style={{ padding: 14 }}>
                        <p
                          className="title is-5"
                          style={{
                            color: "var(--primary)",
                            fontWeight: 600,
                            marginBottom: 2,
                            fontSize: 14,
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
                            fontSize: 13,
                          }}
                        >
                          Rp {product.price?.toLocaleString("id-ID")}
                        </p>
                        <p
                          className="has-text-grey"
                          style={{ fontSize: 12, minHeight: 24 }}
                        >
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    );
  }
}

export default Home;
