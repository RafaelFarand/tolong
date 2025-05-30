import React from "react";
import BasePage from "./BasePage";
import axios from "axios";
import { Navigate } from "react-router-dom";

class Login extends BasePage {
  state = {
    username: "",
    password: "",
    loading: false,
    error: null,
    success: null,
    redirect: false,
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, error: null, success: null });
    try {
      const res = await axios.post("/api/users/login", {
        username: this.state.username,
        password: this.state.password,
      });
      localStorage.setItem("token", res.data.token);
      // Ambil role dari token
      let role = null;
      try {
        // Ambil role dari response backend jika ada
        if (res.data.role) {
          role = res.data.role;
        } else {
          const payload = JSON.parse(atob(res.data.token.split(".")[1]));
          role = payload.role;
        }
      } catch {}
      this.setState({
        success: "Login berhasil!",
        loading: false,
        username: "",
        password: "",
        redirect: role === "admin" ? "/dashboard" : "/",
      });
    } catch (err) {
      this.setState({
        error: err.response?.data?.message || "Login gagal",
        loading: false,
      });
    }
  };

  render() {
    const { username, password, loading, error, success, redirect } =
      this.state;
    if (redirect) {
      return <Navigate to={redirect} replace />;
    }
    return this.renderContainer(
      <section className="section">
        <div className="box" style={{ maxWidth: 400, margin: "0 auto" }}>
          <h2 className="title has-text-centered has-text-link-dark mb-5">
            Login
          </h2>
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
          <form onSubmit={this.handleSubmit} autoComplete="off">
            <div className="field mb-4">
              <label
                className="label has-text-weight-semibold"
                style={{ color: "var(--primary)" }}
              >
                Username
              </label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="text"
                  name="username"
                  value={username}
                  onChange={this.handleChange}
                  placeholder="Username"
                  required
                  style={{
                    color: "var(--primary)",
                    borderColor: "var(--red)",
                    background: "var(--white)",
                  }}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-user"></i>
                </span>
              </div>
            </div>
            <div className="field mb-4">
              <label
                className="label has-text-weight-semibold"
                style={{ color: "var(--primary)" }}
              >
                Password
              </label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="password"
                  name="password"
                  value={password}
                  onChange={this.handleChange}
                  placeholder="Password"
                  required
                  style={{
                    color: "var(--primary)",
                    borderColor: "var(--red)",
                    background: "var(--white)",
                  }}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </div>
            </div>
            <div className="field is-grouped is-grouped-centered mt-5">
              <div className="control" style={{ width: "100%" }}>
                <button
                  className={`button is-link is-fullwidth${
                    loading ? " is-loading" : ""
                  }`}
                  disabled={loading}
                  style={{ minWidth: 120 }}
                >
                  Login
                </button>
              </div>
            </div>
          </form>
          <div className="has-text-centered mt-4">
            <span className="is-size-7 has-text-grey">
              Belum memiliki akun?{" "}
              <a
                href="/register"
                style={{
                  color: "var(--accent)",
                  fontWeight: 600,
                }}
              >
                Silakan register di sini
              </a>
            </span>
          </div>
        </div>
      </section>
    );
  }
}

export default Login;
