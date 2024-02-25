import { setTabSrc } from "../hooks/TabState";
import { setTabTitle } from "../util/setTabTitle";
import { setTabFavicon } from "../util/setTabFavicon";
import { createSignal } from "solid-js";

export const handleLoad = (targetIframe: any, tabId: any) => {
  const [iframeSrc] = createSignal(targetIframe.contentDocument?.URL);

  if (targetIframe) {
    const newSrc = targetIframe.contentDocument?.URL;
    const newTitle = targetIframe.contentDocument?.title;
    const newFavicon = targetIframe.contentDocument?.querySelector(
      "link[rel*='icon']"
    ) as HTMLLinkElement;

    if (newSrc && newSrc !== iframeSrc()) {
      setTabTitle(tabId, newTitle ?? "");
      // change input src
      setTabSrc(newSrc);
      if (newFavicon) {
        setTabFavicon(tabId, newFavicon.href);
      }
    }
  }
};
