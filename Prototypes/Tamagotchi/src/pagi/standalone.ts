import { mountPagi } from "./mount";

// A script tag in <head> runs before <body> exists.
if (document.body) {
  mountPagi();
} else {
  document.addEventListener("DOMContentLoaded", () => mountPagi());
}
