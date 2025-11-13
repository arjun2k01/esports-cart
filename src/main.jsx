// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";
import AppProviders from "./context/AppProviders.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppProviders>
          <App />
        </AppProviders>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
