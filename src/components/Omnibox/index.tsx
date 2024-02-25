import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { setShowOmnibox } from "../../hooks/Omnibox";
import { activeId, setActiveId, setTabSrc } from "../../hooks/TabState";
import { createIframe } from "../../util/createIframe";
import { createTab } from "../../util/createTab";
import { currentId, setCurrentId } from "../../hooks/currentId";
import { tabIds, setTabIds } from "../../hooks/TabState";
import { searchUtil } from "../../util/searchUtil";

declare global {
  interface Window {
    __uv$config: any;
    __dynamic$config: any;
  }
}
const proxy = localStorage.getItem("selectedProxy") || "ultraviolet";
export const Omnibox: Component = () => {
  const [isFocused, setIsFocused] = createSignal(false);
  const [showSuggestions, setShowSuggestions] = createSignal(false);
  const [suggestions, setSuggestions] = createSignal([]);
  const [inputValue, setInputValue] = createSignal("");

  const handleSuggestion = (url: string) => {
    setCurrentId(currentId() + 1);
    setTabSrc(url);
    setTabIds([...tabIds(), currentId()]);

    if (url !== "abyss://settings") {
      if (proxy === "ultraviolet") {
        createIframe(
          currentId(),
          "/placeholder.png",
          "Loading...",
          window.__uv$config.prefix + window.__uv$config.encodeUrl(url)
        );
      } else {
        currentId(),
          "/placeholder.png",
          "Loading...",
          window.__dynamic$config.prefix +
            "route?url=" +
            encodeURIComponent(url);
      }
      createTab(currentId(), "/placeholder.png", "Loading...", url);
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
    setShowOmnibox(false);
    setActiveId(currentId());
  };

  const handleInputChange = async (e: any) => {
    const url = searchUtil(e.target.value, "https://www.google.com/search?q=%s");
    setInputValue((e.target as HTMLInputElement).value);
    try {
      const newQuery = e.target.value;
      setInputValue(newQuery);

      const response = await fetch(`/search=${newQuery}`).then((res) =>
        res.json()
      );

      const newSuggestions = response?.map((item: any) => item.phrase) || [];
      setSuggestions(newSuggestions);
      console.log(newSuggestions);
    } catch (e) {
      console.log();
    }
    if (e.key === "Enter") {
      setCurrentId(currentId() + 1);
      setTabSrc(url);
      setTabIds([...tabIds(), currentId()]);

      if (url !== "abyss://settings") {
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
      setShowOmnibox(false);
      setActiveId(currentId());
    }
  };

  return (
    <div
      class="absolute inset-0 z-50 flex items-center justify-center"
      onclick={() => setShowOmnibox(false)}
    >
      <div
        class="text-blue"
        onclick={(e) => {
          e.stopPropagation();
          console.log(true);
        }}
      >
        <input
          class="w-full bg-black px-4 py-2 text-lg text-white placeholder-gray-400"
          placeholder="Search freely..."
          id="omnibox"
          onFocus={() => {
            setShowSuggestions(true);
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setTimeout(() => {
              setShowSuggestions(false); // delay so the user has time to click suggestions
            }, 200);
          }}
          value={inputValue()}
          onKeyDown={handleInputChange}
        />
        {suggestions().map((suggestion, index) => (
          <div
            onclick={() =>
              handleSuggestion(
                searchUtil(suggestion, "https://www.google.com/search?q=%s")
              )
            }
          >
            <div
              class={`w-110 hover:bg-dropdown-option-hover-color flex h-10 flex-none shrink-0 items-center justify-center border border-primary bg-black p-2 text-xl text-primary ${
                index === suggestions.length - 1 ? "rounded-b-2xl" : ""
              }`}
            >
              {suggestion}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
