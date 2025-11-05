// src/main.tsx
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { initTelegram, persistTelegramUser } from "./lib/telegram";
import { I18nProvider } from "./i18n"; 
import React from "react";
import LangSwitch from "./components/LangSwitch";
import Splash from "./components/Splash";


function Boot() {
  useEffect(() => {
    initTelegram();
    // TG accountni lokalga bog'lab qo'yamiz
    persistTelegramUser();
  }, []);
  const [booting, setBooting] = React.useState(true);
  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 900);
    return () => clearTimeout(t);
  }, []);
  return (
    <>
      {booting && <Splash />}
      <RouterProvider router={router} />
      <LangSwitch /> {/* ← o‘ng yuqorida suzib turadi */}
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <Boot />
    </I18nProvider>
  </StrictMode>
);
