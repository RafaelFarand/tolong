import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UserEdit() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    let currentUserId = null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        currentUserId = payload.id;
      } catch {}
    }
    if (!currentUserId || String(currentUserId) !== String(userId)) {
      setError("Anda tidak diizinkan mengedit data user lain.");
      setLoading(false);
      return;
    }
    axios
      .get(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setForm({ username: res.data.username, email: res.data.email });
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat data user");
        setLoading(false);
      });
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Setelah update user, update token di localStorage agar username baru langsung tampil di navbar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `/api/users/${userId}`,
        { username: form.username, email: form.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Ambil token lama, update username di payload, dan simpan ulang ke localStorage
      if (token) {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          payload.username = form.username;
          const newPayload = btoa(JSON.stringify(payload)).replace(/=+$/, "");
          const newToken = `${parts[0]}.${newPayload}.${parts[2]}`;
          localStorage.setItem("token", newToken);
        }
      }
      setSuccess("Data user berhasil diubah");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError("Gagal mengubah data user");
    }
  };

  if (loading) return <div className="section">Memuat data user...</div>;
  if (error)
    return (
      <section className="section">
        <div className="box" style={{ maxWidth: 400, margin: "0 auto" }}>
          <div className="notification is-danger is-light is-size-7 mb-2">
            {error}
          </div>
        </div>
      </section>
    );

  return (
    <section className="section">
      <div className="box" style={{ maxWidth: 400, margin: "0 auto" }}>
        <h2 className="title is-4 has-text-centered">Ubah Data User</h2>
        {error && (
          <div className="notification is-danger is-light is-size-7 mb-2">
            {error}
          </div>
        )}
        {success && (
          <div className="notification is-success is-light is-size-7 mb-2">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" style={{ color: "var(--primary)" }}>
              Username
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="username"
                value={form.username}
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
            <label className="label" style={{ color: "var(--primary)" }}>
              Email
            </label>
            <div className="control">
              <input
                className="input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                style={{
                  borderColor: "var(--red)",
                  background: "var(--white)",
                }}
              />
            </div>
          </div>
          <div className="field is-grouped is-grouped-right mt-4">
            <div className="control">
              <button type="submit" className="button is-link">
                Simpan
              </button>
            </div>
            <div className="control">
              <button
                type="button"
                className="button is-light"
                onClick={() => navigate(-1)}
              >
                Batal
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default UserEdit;
