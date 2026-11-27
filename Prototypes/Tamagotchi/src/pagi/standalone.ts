import { mountPagi } from "./mount";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => mountPagi());
} else {
  mountPagi();
}
