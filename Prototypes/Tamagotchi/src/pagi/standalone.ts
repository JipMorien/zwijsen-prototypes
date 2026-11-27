import { mountPagi } from "./mount";

if (document.body) {
  mountPagi();
} else {
  document.addEventListener("DOMContentLoaded", () => mountPagi());
}
