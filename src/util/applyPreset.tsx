declare global {
  interface Window {
    __uv$config: any;
    __dynamic$config: any;
  }
}
export const applyPreset = (favicon: string, title: string) => {
  localStorage.setItem("title", title);
  localStorage.setItem("favicon", favicon);
  document
    .querySelector("link[rel='icon']")
    ?.setAttribute(
      "href",
      window.__uv$config.prefix + window.__uv$config.encodeUrl(favicon)
    );
  document.title = title;
};
