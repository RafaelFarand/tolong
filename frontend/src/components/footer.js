import React from "react";

function Footer() {
  return (
    <footer
      className="footer has-background-blue has-text-white-ter"
      style={{
        position: "sticky",
        left: 0,
        bottom: 0,
        width: "100%",
        zIndex: 10,
        marginTop: "auto",
        padding: "0.5rem 0", 
        fontSize: "0.95rem", 
        minHeight: "unset", 
      }}
    >
      <div className="content has-text-centered" style={{ padding: 0 }}>
        <p style={{ margin: 0 }}>
           &copy; {new Date().getFullYear()} | AllParts .
        </p>
      </div>
    </footer>
  );
}

export default Footer;
