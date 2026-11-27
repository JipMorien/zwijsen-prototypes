import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { emitPagiEvent } from "./bus";
import { Pagi } from "./components/Pagi";
import styles from "./components/pagi.css?inline";
import { localStorageAdapter, type PagiStorage } from "./storage";

const HOST_STYLE =
  "position:fixed;inset:auto 0 0 auto;width:0;height:0;z-index:2147483647";

export interface MountOptions {
  storage?: PagiStorage;
}

export function mountPagi({
  storage = localStorageAdapter,
}: MountOptions = {}): () => void {
  const host = document.createElement("div");
  host.style.cssText = HOST_STYLE;
  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = styles;
  const container = document.createElement("div");
  shadow.append(style, container);
  document.body.append(host);

  const root = createRoot(container);
  flushSync(() => root.render(<Pagi storage={storage} />));
  window.Pagi = { emit: emitPagiEvent };

  return () => {
    root.unmount();
    host.remove();
    delete window.Pagi;
  };
}
