import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { mountPagi } from "../pagi";
import { App } from "./App";
import "./demo.css";

const container = document.getElementById("root");
if (container) {
  mountPagi();
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
