import axios from "axios";
import React from "react";

class ProductForm extends React.Component {
  state = {
    name: "",
    price: "",
    stock: "",
    image: null, // Menyimpan gambar yang di-upload
    description: "",
    category: "", // Menambahkan kategori ke state
    loading: false,
    error: null,
    success: null,
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // Mengubah handleChange untuk file input
  handleFileChange = (e) => {
    this.setState({ image: e.target.files[0] });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, error: null, success: null });

    const { name, price, stock, description, category, image } = this.state;
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("image", image); // Menambahkan gambar ke FormData

      const config = {
        headers: {
          "Content-Type": "multipart/form-data", // Mengatur header untuk upload file
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        "http://localhost:5000/api/products",
        formData,
        config
      );

      this.setState({
        name: "",
        price: "",
        stock: "",
        description: "",
        category: "",
        image: null, // Reset image setelah upload
        loading: false,
        success: "Produk berhasil ditambahkan!",
      });

      if (this.props.onSuccess) this.props.onSuccess();
    } catch (err) {
      this.setState({
        error: err.response?.data?.error || "Gagal menambah produk",
        loading: false,
      });
    }
  };

  render() {
    const {
      name,
      price,
      stock,
      description,
      category,
      image,
      loading,
      error,
      success,
    } = this.state;

    return (
      <form onSubmit={this.handleSubmit} autoComplete="off">
        {error && (
          <div className="notification is-danger is-light is-size-7 mb-3">
            {error}
          </div>
        )}
        {success && (
          <div className="notification is-success is-light is-size-7 mb-3">
            {success}
          </div>
        )}
        <div className="field mb-3">
          <label className="label" style={{ color: "var(--primary)" }}>
            Nama Sparepart
          </label>
          <div className="control">
            <input
              className="input"
              name="name"
              value={name}
              onChange={this.handleChange}
              required
              style={{ color: "var(--primary)", borderColor: "var(--red)", background: "var(--white)" }}
            />
          </div>
        </div>
        <div className="field mb-3">
          <label className="label" style={{ color: "var(--primary)" }}>
            Harga
          </label>
          <div className="control">
            <input
              className="input"
              name="price"
              type="number"
              value={price}
              onChange={this.handleChange}
              required
              style={{ color: "var(--primary)", borderColor: "var(--red)", background: "var(--white)" }}
            />
          </div>
        </div>
        <div className="field mb-3">
          <label className="label" style={{ color: "var(--primary)" }}>
            Stok
          </label>
          <div className="control">
            <input
              className="input"
              name="stock"
              type="number"
              value={stock}
              onChange={this.handleChange}
              required
              style={{ color: "var(--primary)", borderColor: "var(--red)", background: "var(--white)" }}
            />
          </div>
        </div>
        <div className="field mb-3">
          <label className="label" style={{ color: "var(--primary)" }}>
            Deskripsi
          </label>
          <div className="control">
            <textarea
              className="textarea"
              name="description"
              value={description}
              onChange={this.handleChange}
              placeholder="Masukkan deskripsi sparepart motor"
              style={{ color: "var(--primary)" }}
            />
          </div>
        </div>
        <div className="field mb-3">
          <label className="label" style={{ color: "var(--primary)" }}>
            Kategori
          </label>
          <div className="control">
            <select
              className="input"
              name="category"
              value={category}
              onChange={this.handleChange}
              required
              style={{
                color: "var(--primary)",
                background: "#fff",
                border: "2px solid var(--blue)",
                fontWeight: 600,
              }}
            >
              <option value="sparepart">Sparepart</option>
              <option value="oli">Oli</option>
              <option value="aksesoris">Aksesoris Motor</option>
            </select>
          </div>
        </div>

        <div className="field mb-3">
          <label className="label" style={{ color: "var(--primary)" }}>
            Gambar Sparepart (jpg/jpeg)
          </label>
          <div className="control">
            <input
              type="file"
              name="image"
              accept="image/jpeg, image/jpg"
              onChange={this.handleFileChange}
              required
            />
          </div>
        </div>

        <div className="field mt-4">
          <button
            className={`button is-link is-fullwidth${
              loading ? " is-loading" : ""
            }`}
            disabled={loading}
            style={{
              background: "#1976d2",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            {loading ? "Memuat..." : "Tambah Sparepart Motor"}
          </button>
        </div>
      </form>
    );
  }
}

export default ProductForm;
