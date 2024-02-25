import { Component, onMount } from "solid-js";
import { setCurrentId, currentId } from "../hooks/currentId";
import { createIframe } from "../util/createIframe";
import { createTab } from "../util/createTab";
import { setActiveId, setTabIds, tabIds } from "../hooks/TabState";
import { setTabSrc } from "../hooks/TabState";
import { IconBookmarkMinus } from "@tabler/icons-solidjs";
import { bookmarks, setBookmarks } from "../hooks/BookmarkHooks";

interface BookmarkProps {
  id: number;
  icon: string;
  title: string;
  href: string;
}

const proxy = localStorage.getItem("selectedProxy") || "ultraviolet";

const handleBookmarkClick = (href: string) => {
  setCurrentId(currentId() + 1);
  setTabSrc(href);
  setTabIds([...tabIds(), currentId()]);
  if (proxy === "ultraviolet") {
    setTabSrc(href);
    createIframe(
      currentId(),
      "/placeholder.png",
      "Loading...",
      window.__uv$config.prefix + window.__uv$config.encodeUrl(href)
    );
  } else {
    setTabSrc(
      window.__uv$config.decodeUrl(
        href
          .replace(window.location.origin, "")
          .replace(window.__dynamic$config.prefix, "")
      )
    );
    createIframe(
      currentId(),
      "/placeholder.png",
      "Loading...",
      window.__dynamic$config.prefix + "route?url=" + encodeURIComponent(href)
    );
  }
  createTab(currentId(), "/placeholder.png", "Loading...", href);
  setActiveId(currentId());
};

export const Bookmarks: Component = () => {
  const saveBookmarks = (updatedBookmarks: BookmarkProps[]) => {
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    setBookmarks(updatedBookmarks);
  };

  const removeBookmark = (id: number) => {
    const updatedBookmarks = bookmarks().filter(
      (bookmark) => bookmark.id !== id
    );
    saveBookmarks(updatedBookmarks);
  };

  onMount(() => {
    const storedBookmarks = localStorage.getItem("bookmarks");
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }
  });

  return (
    <div class="modernScrollbar flex flex-col items-start overflow-x-auto">
      <div class="flex flex-row">
        {bookmarks().map((bookmark) => (
          <div class="mx-4 flex w-max items-center">
            <img src={bookmark.icon} class="h-5 w-5" />
            <div
              class="mx-2 text-lg text-primary"
              onClick={() => handleBookmarkClick(bookmark.href)}
            >
              {bookmark.title}
            </div>
            <button onClick={() => removeBookmark(bookmark.id)}>
              <IconBookmarkMinus class="h-5 w-5 text-primary" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
