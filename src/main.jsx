// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App.jsx";
import "./index.css";

import AppProviders from "./context/AppProviders.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Auth should be available to everything */}
      <AuthProvider>
        {/* Cart/provider state */}
        <AppProviders>
          <App />

          {/* Global toasts */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 2500,
              style: {
                background: "rgba(15, 18, 45, 0.95)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.08)",
              },
            }}
          />
        </AppProviders>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
