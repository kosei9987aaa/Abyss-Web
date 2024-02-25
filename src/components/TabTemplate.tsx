import type { Component } from "solid-js";
import { activeId, setActiveId } from "../hooks/TabState";
import { setTabSrc } from "../hooks/TabState";
import { tabData, setTabData } from "../hooks/TabState";
import { tabIds, setTabIds } from "../hooks/TabState";
import { getSrcById } from "../util/srcById";
import { IconX } from "@tabler/icons-solidjs";
import { createSignal } from "solid-js";

interface TabProps {
  id: number;
  title: string;
  url: string;
  favicon: string;
}

declare global {
  interface Window {
    __uv$config: any;
    __dynamic$config: any;
  }
}
const proxy = localStorage.getItem("selectedProxy") || "ultraviolet";
const RemoveTab = (e: any, idToRemove: number) => {
  e.stopPropagation();
  const currentIds = tabIds();

  if (idToRemove === activeId()) {
    const targetIndex = currentIds.indexOf(idToRemove);

    const nextActiveTabId =
      targetIndex !== -1 && targetIndex > 0
        ? currentIds[targetIndex - 1]
        : targetIndex === 0 && currentIds.length > 1
          ? currentIds[1]
          : undefined;

    setActiveId(nextActiveTabId || 1);
    const iframeId = document.getElementById("sidetab" + idToRemove);
    iframeId?.remove();
    const newSrc = getSrcById(nextActiveTabId || 1);
    setTabSrc(newSrc);
  }

  const updatedTabIds = currentIds.filter((id) => id !== idToRemove);

  setTabIds(updatedTabIds);

  setTabData((prevTabData) =>
    prevTabData.filter((tab: { id: number }) => tab.id !== idToRemove)
  );
};

const setTab = (id: number) => {
  setActiveId(id);
  const tabElement = document.getElementById("sidetab" + id);
  if (tabElement) {
    if (tabElement.tagName.toLowerCase() === "div") {
      // internal tab
      const internalDiv = tabElement.querySelector("div");
      if (internalDiv) {
        setTabSrc(internalDiv.id);
      }
    } else {
      const encodedSrc = getSrcById(id);
      if (proxy === "ultraviolet") {
        let decodedSrc = window.__uv$config.decodeUrl(
          encodedSrc
            .replace(window.location.origin, "")
            .replace(window.__uv$config.prefix, "")
        );
        setTabSrc(window.__uv$config.decodeUrl(decodedSrc));
      } else {
        let decodedSrc = window.__uv$config.decodeUrl(
          encodedSrc
            .replace(window.location.origin, "")
            .replace(window.__dynamic$config.prefix, "")
        );
        // uv decoding function will work the same for dynamic.

        // never mind, double decode for some reason
        setTabSrc(
          window.__uv$config.decodeUrl(window.__uv$config.decodeUrl(decodedSrc))
        );
      }
    }
  }
};

export const TabTemplate: Component<TabProps> = (props) => {
  const [isDragging, setIsDragging] = createSignal(false);
  const [isHovered, setIsHovered] = createSignal(false);

  const handleDragStart = (e: any) => {
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", props.id.toString());
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setIsDragging(false);

    const draggedTabId = parseInt(e.dataTransfer.getData("text/plain"));
    const targetTabId = props.id;

    if (draggedTabId !== targetTabId) {
      const currentIds = tabIds();
      const updatedTabIds = [...currentIds];
      const draggedIndex = currentIds.indexOf(draggedTabId);
      const targetIndex = currentIds.indexOf(targetTabId);

      updatedTabIds.splice(draggedIndex, 1);
      updatedTabIds.splice(targetIndex, 0, draggedTabId);

      setTabIds(updatedTabIds);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      id={"tabs-" + props.id.toString()}
      class={`mx-2 my-3 flex cursor-pointer flex-row items-center rounded-xl bg-white`}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onclick={() => setTab(props.id)}
      style={{
        "background-color":
          isHovered() && activeId() !== props.id
            ? "rgba(255, 255, 255, 0.5)"
            : activeId() === props.id
              ? "rgba(255, 255, 255, 1)"
              : "rgba(255, 255, 255, 0)"
      }}
    >
      <div class="flex max-w-48 cursor-pointer flex-row items-center justify-between p-2">
        <div class="flex w-full flex-row items-center overflow-hidden">
          <img
            src={props.favicon}
            class="h-8 w-8 rounded-xl bg-primary p-1"
            id={"favicon-" + props.id}
          />
          <div
            class={
              "segoe-ui text-md truncate whitespace-nowrap pl-2 " +
              (activeId() === props.id ? "" : "text-primary")
            }
            id={"tab-title-" + props.id.toString()}
          >
            {props.title}
          </div>
        </div>
        <button
          class="ml-2 text-red-500"
          onclick={(e) => RemoveTab(e, props.id)}
        >
          <IconX />
        </button>
      </div>
    </div>
  );
};
