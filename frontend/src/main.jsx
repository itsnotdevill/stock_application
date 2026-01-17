import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { TradeProvider } from "./context/TradeContext";
import "./index.css";

// Replace 'YOUR_GOOGLE_CLIENT_ID' with your actual client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = "578118654112-tq8hm4vqmmrkqnuhaebk6frlt24bcr6l.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <TradeProvider>
          <App />
        </TradeProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
