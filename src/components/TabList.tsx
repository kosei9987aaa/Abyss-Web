import { createSignal } from "solid-js";
import { IconPlus, IconDots } from "@tabler/icons-solidjs";
import { setShowOmnibox } from "../hooks/Omnibox";
import { dndzone } from "solid-dnd-directive";
import { TabTemplate } from "./TabTemplate";
import { createTab } from "../util/createTab";
import { createIframe } from "../util/createIframe";
import { setCurrentId, currentId } from "../hooks/currentId";
import {
  tabData,
  setTabData,
  setActiveId,
  activeId,
  tabIds
} from "../hooks/TabState";
const containerStyle = {
  border: "1px solid black",
  padding: "0.3em",
  "max-width": "200px"
};

const showOmnibox = () => {
  setShowOmnibox(true);
  (document.getElementById("omnibox") as HTMLInputElement).focus();
};

const dndzoneWrapper = dndzone;

export function TabList() {
  function handleDndEvent(e: any) {
    const { items: newTabData, dropTargetStyle: qiar } = e.detail;
    setTabData(newTabData);
  }

  return (
    <main class="align-center flex h-full w-full cursor-pointer items-center">
      <div class="flex w-24 flex-row content-center justify-center items-center rounded-md border border-white">
        <div class="p-2 text-white">
          <IconPlus onclick={() => showOmnibox()} />
        </div>
        <div class="p-2 text-white">
          <IconDots
            onclick={() => {
              setCurrentId(currentId() + 1);
              createIframe(
                currentId(),
                "/placeholder.png",
                "Settings",
                "abyss://settings"
              );
              createTab(
                currentId(),
                "/placeholder.png",
                "Settings",
                "abyss://settings"
              );
              setActiveId(currentId());
            }}
          />
        </div>
      </div>
      <section
        //@ts-ignore
        use:dndzoneWrapper={{
          items: tabData,
          dropTargetStyle: {}
        }}
        on:consider={handleDndEvent}
        on:finalize={handleDndEvent}
        class="flex h-full flex-row items-center"
      >
        {tabData().map((item) => (
          <TabTemplate
            id={item.id}
            title={item.title}
            favicon={item.favicon}
            url={item.url}
          />
        ))}
      </section>
    </main>
  );
}
