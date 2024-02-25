import { Component, JSX } from "solid-js";
import { setCurrentId, currentId } from "../hooks/currentId";
import { tabIds, setTabIds, setTabSrc } from "../hooks/TabState";
import { createIframe } from "../util/createIframe";
import { createTab } from "../util/createTab";

interface ShortcutProps {
  icon: JSX.Element;
  url: string;
}
const proxy = localStorage.getItem("selectedProxy") || "ultraviolet";
const clickShortcut = (url: string) => {
  setCurrentId(currentId() + 1);
  setTabSrc(url);
  setTabIds([...tabIds(), currentId()]);

  if (proxy === "ultraviolet") {
    createIframe(
      currentId(),
      "/placeholder.png",
      "Loading...",
      window.__uv$config.prefix + window.__uv$config.encodeUrl(url)
    );
  } else {
    createIframe(
      currentId(),
      "/placeholder.png",
      "Loading...",
      window.__dynamic$config.prefix + "route?url=" + encodeURIComponent(url)
    );
  }
  createTab(currentId(), "/placeholder.png", "Loading...", url);
};

export const Shortcut: Component<ShortcutProps> = (props) => {
  return (
    <div
      class="mx-2 my-3 flex h-16 w-16 items-center justify-center rounded-xl border border-primary text-primary"
      onClick={() => {
        clickShortcut(props.url);
      }}
    >
      <div class="h-full w-full p-2">{props.icon}</div>
    </div>
  );
};
