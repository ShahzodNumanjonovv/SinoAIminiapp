// src/main.tsx
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { initTelegram } from "./lib/telegram";
import { I18nProvider } from "./i18n"; 
import React from "react";
import LangSwitch from "./components/LangSwitch";


function Boot() {
  useEffect(() => { initTelegram(); }, []);
  return (
    <>
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