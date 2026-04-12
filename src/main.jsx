import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@flaticon/flaticon-uicons/css/all/all.css";
import CustomQueryClientProvider from "./context/QueryClientProvider.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CustomQueryClientProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </CustomQueryClientProvider>
  </StrictMode>
);
