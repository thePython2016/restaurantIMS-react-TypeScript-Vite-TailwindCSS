import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import './i18n';

import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "378902318323-mts3fdjf8hpqbh15pme2ilat8438iq2r.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppWrapper>
            <GoogleOAuthProvider
              clientId={googleClientId}
              onScriptLoadError={() => {
                console.error('Google OAuth script failed to load');
              }}
            >
              <App />
            </GoogleOAuthProvider>
          </AppWrapper>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
