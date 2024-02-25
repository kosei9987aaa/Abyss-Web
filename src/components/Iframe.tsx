import { onCleanup, createSignal, createEffect } from "solid-js";
import { Component } from "solid-js";
import { activeId } from "../hooks/TabState";
import { setTabSrc } from "../hooks/TabState";
import { setTabTitle } from "../util/setTabTitle";
import { setTabFavicon } from "../util/setTabFavicon";

interface IframeProps {
  tabId: number;
  title: string;
  favicon: string;
  src: string;
}
declare global {
  interface Window {
    __uv$config: any;
    __dynamic$config: any;
  }
}
const proxy = localStorage.getItem("selectedProxy") || "ultraviolet";

export const Iframe: Component<IframeProps> = (props) => {
  const [iframeSrc] = createSignal(props.src);

  const handleLoad = () => {
    const targetIframe = document.getElementById(
      "sidetab" + props.tabId
    ) as HTMLIFrameElement;

    if (targetIframe) {
      const newSrc = targetIframe.contentDocument?.URL;
      const newTitle = targetIframe.contentDocument?.title;
      const newFavicon = targetIframe.contentDocument?.querySelector(
        "link[rel*='icon']"
      ) as HTMLLinkElement;

      if (newSrc && newSrc !== iframeSrc()) {
        setTabTitle(props.tabId, newTitle ?? "");
        // change input src
        if (proxy === "ultraviolet") {
          setTabSrc(newSrc);
        } else {
          setTabSrc(
            window.__uv$config.decodeUrl(
              newSrc
                .replace(window.location.origin, "")
                .replace(window.__dynamic$config.prefix, "")
            )
          );
        }
        if (newFavicon) {
          setTabFavicon(props.tabId, newFavicon.href);
        }
      }
    }
  };

  createEffect(() => {
    const targetIframe = document.getElementById(
      "sidetab" + props.tabId
    ) as HTMLIFrameElement;

    if (targetIframe) {
      targetIframe.addEventListener("load", handleLoad);

      onCleanup(() => {
        targetIframe.removeEventListener("load", handleLoad);
      });
    }
  });

  return (
    <div
      class={"h-full w-full" + (activeId() !== props.tabId ? " hidden" : "")}
    >
      <iframe
        src={iframeSrc()}
        id={"sidetab" + props.tabId}
        class="h-full w-full rounded-lg bg-white dark:bg-slate-950"
      />
    </div>
  );
};
