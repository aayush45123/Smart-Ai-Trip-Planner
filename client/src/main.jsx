import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <Router>
    <StrictMode>
      <App />
    </StrictMode>
  </Router>
);
