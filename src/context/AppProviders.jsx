import React from 'react';
import axios from 'axios';

/*
  Prefer VITE_API_URL when provided during the Vite build.
  Otherwise fall back to the Render backend URL so the
  deployed frontend can reach the API even if the env var
  wasn't set at build time.
*/
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://esports-cart.onrender.com/api';

// Configure axios default base URL for all requests
axios.defaults.baseURL = API_BASE_URL;
