const HOST_STYLE =
  "position:fixed;inset:auto 0 0 auto;width:0;height:0;z-index:2147483647";

export function mountPagi(): () => void {
  const host = document.createElement("div");
  host.style.cssText = HOST_STYLE;
  host.attachShadow({ mode: "open" });
  document.body.append(host);
  return () => host.remove();
}
