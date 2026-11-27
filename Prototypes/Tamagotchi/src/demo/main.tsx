import "@fontsource/atkinson-hyperlegible/400.css";
import "@fontsource/atkinson-hyperlegible/700.css";
import "@fontsource/baloo-2/700.css";
import "@fontsource/baloo-2/800.css";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";
import "@fontsource/nunito/800.css";
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
