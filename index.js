// index.js — bootloader, DO NOT RENAME
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app.js";   // loads your existing app.js (keeps extension unchanged)
import "./app.css";          // only if you have this file; otherwise remove

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("No root element found in index.html");
}

createRoot(rootEl).render(
  React.createElement(React.StrictMode, null, React.createElement(App))
);
