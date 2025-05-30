import React, { Component } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CartIcon from "./cartIcon";
import { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";

// Komponen Link aktif Bulma
function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`navbar-item${isActive ? " has-text-link" : ""}`}
      style={{ fontWeight: 600 }}
    >
      {children}
    </Link>
  );
}

function NavbarContent() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let initialUsername = null,
    initialUserId = null,
    initialRole = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      initialUsername = payload.username;
      initialUserId = payload.id;
      initialRole = payload.role;
    } catch {}
  }
  // State untuk user info agar bisa diupdate setelah edit
  const [userInfo, setUserInfo] = useState({
    username: initialUsername,
    userId: initialUserId,
    role: initialRole,
  });

  // Sync username jika token berubah (misal setelah update user)
  useEffect(() => {
    const token = localStorage.getItem("token");
    let uname = null,
      uid = null,
      urole = null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        uname = payload.username;
        uid = payload.id;
        urole = payload.role;
      } catch {}
    }
    setUserInfo({ username: uname, userId: uid, role: urole });
  }, [token]);

  const isLoggedIn = Boolean(token);
  const role = userInfo.role;
  const username = userInfo.username;
  const userId = userInfo.userId;
  const isSeller = false;
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef();

  return (
    <nav
      className="navbar has-background-link-dark has-text-white is-fixed-top"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link
          to="/"
          className="navbar-item has-text-white"
          style={{ fontWeight: 700 }}
        >
          Allparts
        </Link>
        <button
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasic"
          onClick={() => {
            const menu = document.getElementById("navbarBasic");
            menu.classList.toggle("is-active");
          }}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>
      <div id="navbarBasic" className="navbar-menu">
        <div className="navbar-start">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Produk</NavLink>
          {!isLoggedIn && <NavLink to="/login">Login</NavLink>}
        </div>
        <div className="navbar-end">
          {isLoggedIn && role === "admin" && (
            <NavLink to="/dashboard">Dashboard</NavLink>
          )}
          {isLoggedIn && role === "customer" && (
            <div className="navbar-item">
              <button
                className="button is-link is-light is-small"
                onClick={() => navigate("/cart")}
              >
                <CartIcon />
              </button>
            </div>
          )}
          {isLoggedIn && (
            <div
              className="navbar-item"
              ref={dropdownRef}
              style={{ position: "relative" }}
            >
              <button
                className="button is-link is-light is-small"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
                onClick={() => setDropdown((d) => !d)}
                aria-haspopup="true"
                aria-expanded={dropdown}
              >
                <FaUserCircle size={22} style={{ marginRight: 4 }} />
                <span style={{ fontWeight: 600 }}>
                  {userInfo.username || "User"}
                </span>
                <span className="icon" style={{ marginLeft: 2 }}>
                  <i className={`fas fa-caret-${dropdown ? "up" : "down"}`}></i>
                </span>
              </button>
              {dropdown ? (
                <div
                  className="box"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 40,
                    minWidth: 200,
                    zIndex: 1000,
                    padding: 0,
                    borderRadius: 12,
                    boxShadow: "0 8px 32px 0 rgba(74,98,138,0.18)",
                    background: "var(--primary-bg)",
                    border: "1px solid #e3eaf2",
                    animation: "fadeInDropdown 0.18s cubic-bezier(.4,2,.6,1)",
                  }}
                >
                  <div
                    style={{
                      padding: 18,
                      borderBottom: "1px solid #e3eaf2",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <FaUserCircle
                      size={28}
                      style={{ color: "var(--primary)" }}
                    />
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          color: "var(--primary)",
                          fontSize: 15,
                        }}
                      >
                        {userInfo.username || "User"}
                      </div>
                      <div style={{ color: "#888", fontSize: 13 }}>{role}</div>
                    </div>
                  </div>
                  <button
                    className="dropdown-item button is-white is-fullwidth has-text-left"
                    style={{
                      border: "none",
                      borderRadius: 0,
                      padding: 14,
                      fontWeight: 600,
                      fontSize: 15,
                      color: "var(--primary)",
                    }}
                    onClick={() => {
                      setDropdown(false);
                      navigate(`/user/edit/${userId}`);
                    }}
                  >
                    <i
                      className="fas fa-user-edit mr-2"
                      style={{ marginRight: 8 }}
                    ></i>{" "}
                    Ubah Data User
                  </button>
                  <button
                    className="dropdown-item button is-white is-fullwidth has-text-left"
                    style={{
                      border: "none",
                      borderRadius: 0,
                      padding: 14,
                      fontWeight: 600,
                      fontSize: 15,
                      color: "var(--primary)",
                    }}
                    onClick={() => {
                      setDropdown(false);
                      navigate("/checkout-history");
                    }}
                  >
                    <i
                      className="fas fa-history mr-2"
                      style={{ marginRight: 8 }}
                    ></i>{" "}
                    Riwayat Checkout
                  </button>
                  <button
                    className="dropdown-item button is-white is-fullwidth has-text-left"
                    style={{
                      border: "none",
                      borderRadius: 0,
                      padding: 14,
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#e74c3c",
                    }}
                    onClick={async () => {
                      setDropdown(false);
                      // Hapus akun user
                      try {
                        const token = localStorage.getItem("token");
                        await fetch(`/api/users/${userId}`, {
                          method: "DELETE",
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        // Animasi fade out sebelum redirect
                        document.body.classList.add("fade-page-exit-active");
                        setTimeout(() => {
                          localStorage.removeItem("token");
                          window.location.href = "/";
                        }, 400);
                      } catch {
                        alert("Gagal menghapus akun");
                      }
                    }}
                  >
                    <i
                      className="fas fa-trash-alt mr-2"
                      style={{ marginRight: 8 }}
                    ></i>{" "}
                    Hapus Akun
                  </button>
                  <button
                    className="dropdown-item button is-white is-fullwidth has-text-left"
                    style={{
                      border: "none",
                      borderRadius: 0,
                      padding: 14,
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#555",
                    }}
                    onClick={() => {
                      localStorage.removeItem("token");
                      setDropdown(false);
                      navigate("/login");
                      window.location.reload();
                    }}
                  >
                    <i
                      className="fas fa-sign-out-alt mr-2"
                      style={{ marginRight: 8 }}
                    ></i>{" "}
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          )}
          {isSeller && (
            <div className="navbar-item">
              <button
                onClick={() => navigate("/seller")}
                className="button is-link is-light is-small"
              >
                Seller Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

class Navbar extends Component {
  render() {
    return (
      <>
        <header>
          <NavbarContent />
        </header>
        {/* Spacer agar konten tidak tenggelam di bawah navbar fixed-top */}
        <div style={{ marginTop: "3.5rem" }}></div>
      </>
    );
  }
}

export default Navbar;

/* Tambahkan animasi fadeInDropdown ke custom.css:
@keyframes fadeInDropdown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
*/
