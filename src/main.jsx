import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./cssfiles/font.css";
import { RegistrationProvider } from "./context/RegistrationContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <RegistrationProvider>
        <App />
      </RegistrationProvider>
    </BrowserRouter>
  </StrictMode>
);
