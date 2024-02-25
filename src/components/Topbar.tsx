import type { Component } from "solid-js";
import {
  IconArrowRight,
  IconArrowLeft,
  IconReload,
  IconLogout,
  IconBookmarkPlus,
  IconAdjustmentsHorizontal,
  IconPlus
} from "@tabler/icons-solidjs";
import { TabTemplate } from "./TabTemplate";
import { setShowOmnibox } from "../hooks/Omnibox";
import { currentId, setCurrentId } from "../hooks/currentId";
import {
  activeId,
  tabSrc,
  setActiveId,
  setTabSrc,
  setTabIds,
  tabIds
} from "../hooks/TabState";
import { tabData, setTabData } from "../hooks/TabState";
import { dndzone } from "solid-dnd-directive";
import { TabList } from "./TabList";
import { searchUtil } from "../util/searchUtil";
import { createIframe } from "../util/createIframe";
import { createTab } from "../util/createTab";
import { createSignal } from "solid-js";
import { getSrcById } from "../util/srcById";
import { setTabTitle } from "../util/setTabTitle";
import { handleLoad } from "../util/updateTab";
import { Bookmarks } from "./Bookmarks";
import { setBookmarks, bookmarks } from "../hooks/BookmarkHooks";

interface BookmarkProps {
  id: number;
  icon: string;
  title: string;
  href: string;
}

const proxy = localStorage.getItem("selectedProxy") || "ultraviolet";
const realDndZone = dndzone;

declare global {
  interface Window {
    __uv$config: any;
    __dynamic$config: any;
  }
}

interface ProxyFrame extends HTMLElement {
  contentWindow: any;
  contentDocument: any;
}

const showOmnibox = () => {
  setShowOmnibox(true);
  (document.getElementById("omnibox") as HTMLInputElement).focus();
};

const submit = (e: any) => {
  const url = searchUtil(e.target.value, "https://bing.com/search?q=%s");
  if (e.key === "Enter") {
    if (url !== "abyss://settings") {
      const iframe = document.getElementById(
        "sidetab" + currentId()
      ) as HTMLIFrameElement;
      if (iframe) {
        if (iframe.tagName.toLowerCase() !== "div") {
          if (proxy === "ultraviolet") {
            iframe.src =
              window.__uv$config.prefix + window.__uv$config.encodeUrl(url);
          } else {
            iframe.src =
              window.__dynamic$config.prefix +
              "route?url=" +
              encodeURIComponent(url);
          }
        } else {
          iframe?.remove();
          console.log(currentId());
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
              window.__dynamic$config.prefix +
                "route?url=" +
                encodeURIComponent(url)
            );
          }
          const newSrc = getSrcById(currentId());
          console.log(newSrc);
          setTabSrc(newSrc);
          // destroy internal tab and make iframe
        }
      } else {
        setCurrentId(currentId() + 1);
        setTabSrc(url);
        setTabIds([...tabIds(), currentId()]);
        console.log(tabIds());

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
            window.__dynamic$config.prefix +
              "route?url=" +
              encodeURIComponent(url)
          );
        }
        createTab(currentId(), "/placeholder.png", "Loading...", url);

        setShowOmnibox(false);
        setActiveId(currentId());
      }
    } else {
      const iframe = document.getElementById(
        "sidetab" + currentId()
      ) as HTMLIFrameElement;
      if (iframe) {
        if (iframe.tagName.toLowerCase() === "div") {
          setCurrentId(currentId() + 1);
          setTabSrc(url);
          setTabIds([...tabIds(), currentId()]);
          console.log(tabIds());

          createIframe(
            currentId(),
            "/placeholder.png",
            "Settings",
            "abyss://settings"
          );
          createTab(currentId(), "/placeholder.png", "Settings", url);

          setShowOmnibox(false);
          setActiveId(currentId());
        } else {
          // Destory iframe and render settings in its place.
          const iframeParent = iframe?.parentElement;

          iframeParent?.remove();

          setTabTitle(activeId(), "Settings");

          createIframe(
            activeId(),
            "/placeholder.png",
            "Settings",
            "abyss://settings"
          );
        }
      } else {
        createIframe(
          currentId(),
          "/placeholder.png",
          "Settings",
          "abyss://settings"
        );
        createTab(currentId(), "/placeholder.png", "Settings", url);
        setActiveId(currentId());
      }
    }
  }
};

export const Topbar: Component = () => {
  const [isInputFocused, setInputFocused] = createSignal(false);
  const proxy = localStorage.getItem("selectedProxy") || "ultraviolet";

  const saveBookmarks = (updatedBookmarks: BookmarkProps[]) => {
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    setBookmarks(updatedBookmarks);
  };

  const addBookmark = () => {
    const targetIframe = document.getElementById(
      "sidetab" + activeId()
    ) as HTMLIFrameElement;
    const newSrc = targetIframe.contentDocument?.URL;
    const newTitle = targetIframe.contentDocument?.title as string;
    const newFavicon = targetIframe.contentDocument?.querySelector(
      "link[rel*='icon']"
    ) as HTMLLinkElement;
    var icon = "/placeholder.png";
    try {
      icon = newFavicon.href;
    } catch (e) {
      icon = "/placeholder.png";
    }
    if (newSrc?.startsWith("http")) {
      const newBookmark: BookmarkProps = {
        id: Date.now(),
        icon: icon,
        title: newTitle,
        href: newSrc
      };
      saveBookmarks([...bookmarks(), newBookmark]);
    }
  };
  return (
    <div class="float-left flex w-full flex-col pr-3">
      <div class="flex h-full flex-col">
        <div class="flex flex-col">
          <div class="modernScrollbar h-16  flex-grow flex-row overflow-x-auto overflow-y-hidden">
            <TabList />
          </div>
          <div class="flex flex-row content-center">
            <div class="flex w-24 flex-row content-center items-center">
              <IconArrowLeft
                class="h-8 w-8 p-1 text-primary"
                onClick={() => {
                  const proxyFrame: ProxyFrame | null = document.getElementById(
                    "sidetab" + activeId()
                  ) as ProxyFrame;
                  proxyFrame.contentWindow.history.back();
                  handleLoad(proxyFrame, activeId());
                }}
              />
              <IconArrowRight
                class="h-8 w-8 p-1 text-primary"
                onClick={() => {
                  const proxyFrame: ProxyFrame | null = document.getElementById(
                    "sidetab" + activeId()
                  ) as ProxyFrame;
                  proxyFrame.contentWindow.history.forward();
                  handleLoad(proxyFrame, activeId());
                }}
              />
              <IconReload
                class="h-8 w-8 p-1 text-primary"
                onClick={() => {
                  const proxyFrame: ProxyFrame | null = document.getElementById(
                    "sidetab" + activeId()
                  ) as ProxyFrame;
                  proxyFrame.contentWindow.location.reload();
                  handleLoad(proxyFrame, activeId());
                }}
              />
            </div>
            <div class="mx-auto flex w-full flex-row items-center justify-between rounded-2xl bg-black bg-opacity-20 p-1">
              <input
                class="segoe-ui text-md w-full bg-transparent px-2 py-1 font-semibold text-primary placeholder-gray-300 focus:border-transparent focus:outline-none"
                placeholder="Search the web..."
                value={tabSrc()}
                onKeyDown={submit}
                onfocus={() => setInputFocused(true)}
                onblur={() => setInputFocused(false)}
              />
            </div>
            <div class="flex flex-row content-center items-center justify-between">
              <IconBookmarkPlus
                class="h-8 w-8 cursor-pointer p-1 text-primary"
                onclick={addBookmark}
              />
              <IconLogout
                class="h-8 w-8 p-1 text-primary"
                onClick={() => {
                  const unproxiedSrc = getSrcById(activeId());
                  var newWindow = window.open("about:blank");
                  var iframe = document.createElement("iframe");
                  if (proxy === "ultraviolet") {
                    iframe.src =
                      window.location.origin +
                      window.__uv$config.prefix +
                      window.__uv$config.encodeUrl(unproxiedSrc);
                  } else {
                    iframe.src =
                      window.location.origin +
                      window.__dynamic$config.prefix +
                      "route?url=" +
                      encodeURIComponent(unproxiedSrc);
                  }
                  iframe.style.width = "100%";
                  iframe.style.height = "100%";
                  iframe.style.border = "none";
                  iframe.style.overflow = "hidden";
                  iframe.style.margin = "0";
                  iframe.style.padding = "0";
                  iframe.style.position = "fixed";
                  iframe.style.top = "0";
                  iframe.style.bottom = "0";
                  iframe.style.left = "0";
                  iframe.style.right = "0";
                  newWindow?.document.body.appendChild(iframe);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <Bookmarks />
      </div>
    </div>
  );
};
