import React from "react"
import { createRoot, type Root } from "react-dom/client"
import App from "./App"
import "./index.css"

type RootContainer = HTMLElement & {
  __shikiReactRoot?: Root
}

const container = document.getElementById("root") as RootContainer
const root = container.__shikiReactRoot ?? createRoot(container)

container.__shikiReactRoot = root

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
