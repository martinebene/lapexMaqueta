import React from "react"
import { createRoot } from "react-dom/client"
import "./i18n"
import "./index.css"
import "./layout.css"
import App from "./App"
try{const preferences=JSON.parse(localStorage.getItem("lapex-preferences")||"{}");const theme=preferences.theme==="dark"?"dark":preferences.theme==="light"?"light":matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=theme;document.documentElement.classList.toggle("dark",theme==="dark");document.documentElement.dataset.contrast=preferences.contrast||"normal"}catch{/* preferencias locales opcionales */}
createRoot(document.getElementById("root")!).render(<React.StrictMode><App/></React.StrictMode>)
