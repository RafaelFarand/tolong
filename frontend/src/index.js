import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import { createRoot } from "react-dom/client";
import "bulma/css/bulma.css";
import "./custom.css";
import "./fade-page.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <Router>
    <App />
  </Router>
);
