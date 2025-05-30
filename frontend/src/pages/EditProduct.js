import React from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(res.data);
        setLoading(false);
      } catch (err) {
        setError("Gagal memuat data produk");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setProduct({ ...product, image: e.target.files[0] });
    } else {
      setProduct({ ...product, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("stock", product.stock);
      formData.append("description", product.description);
      formData.append("category", product.category);
      if (product.image) {
        formData.append("image", product.image);
      }
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`/api/products/${id}`, formData, config);
      alert("Produk berhasil diupdate!");
      navigate("/products");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Gagal update produk"
      );
    }
  };

  if (loading) return <div>Memuat...</div>;
  if (error) return <div className="notification is-danger">{error}</div>;
  if (!product) return null;

  return (
    <section className="section">
      <div className="box" style={{ maxWidth: 500, margin: "0 auto" }}>
        <h2 className="title has-text-centered has-text-link-dark mb-5">
          Edit Produk
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label
              className="label"
              style={{
                color: "var(--primary)",
                fontWeight: 700,
                borderColor: "var(--red)",
                background: "var(--white)",
              }}
            >
              Nama Produk
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="name"
                value={product.name || ""}
                onChange={handleChange}
                required
                style={{
                  borderColor: "var(--red)",
                  background: "var(--white)",
                }}
              />
            </div>
          </div>
          <div className="field">
            <label
              className="label"
              style={{
                color: "var(--primary)",
                fontWeight: 700,
                borderColor: "var(--red)",
                background: "var(--white)",
              }}
            >
              Harga
            </label>
            <div className="control">
              <input
                className="input"
                type="number"
                name="price"
                value={product.price || ""}
                onChange={handleChange}
                required
                style={{
                  borderColor: "var(--red)",
                  background: "var(--white)",
                }}
              />
            </div>
          </div>
          <div className="field">
            <label
              className="label"
              style={{
                color: "var(--primary)",
                fontWeight: 700,
                borderColor: "var(--red)",
                background: "var(--white)",
              }}
            >
              Stok
            </label>
            <div className="control">
              <input
                className="input"
                type="number"
                name="stock"
                value={product.stock || ""}
                onChange={handleChange}
                required
                style={{
                  borderColor: "var(--red)",
                  background: "var(--white)",
                }}
              />
            </div>
          </div>
          <div className="field mb-3">
            <label
              className="label"
              style={{
                color: "var(--primary)",
                fontWeight: 700,
                borderColor: "var(--red)",
                background: "var(--white)",
              }}
            >
              Kategori
            </label>
            <div className="control">
              <select
                className="input"
                name="category"
                value={product.category || ""}
                onChange={handleChange}
                required
                style={{
                  borderColor: "var(--red)",
                  background: "var(--white)",
                }}
              >
                <option value="">Pilih Kategori</option>
                <option value="sparepart">Sparepart</option>
                <option value="oli">Oli</option>
                <option value="aksesoris">Aksesoris Motor</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label
              className="label"
              style={{
                color: "var(--primary)",
                fontWeight: 700,
                borderColor: "var(--red)",
                background: "var(--white)",
              }}
            >
              Deskripsi
            </label>
            <div className="control">
              <textarea
                className="textarea"
                name="description"
                value={product.description || ""}
                onChange={handleChange}
                required
                style={{
                  borderColor: "var(--red)",
                  background: "var(--white)",
                }}
              />
            </div>
          </div>
          <div className="field">
            <label
              className="label"
              style={{
                color: "var(--primary)",
                fontWeight: 700,
                borderColor: "var(--red)",
                background: "var(--white)",
              }}
            >
              Image URL
            </label>
            <div className="control">
              <input
                className="input"
                type="file"
                name="image"
                accept="image/jpeg, image/jpg"
                onChange={handleChange}
                style={{
                  borderColor: "var(--red)",
                  background: "var(--white)",
                }}
              />
            </div>
          </div>
          <div className="field has-text-right">
            <button className="button is-link is-medium" type="submit">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default EditProduct;
