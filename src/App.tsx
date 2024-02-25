import type { Component } from "solid-js";
import { Topbar } from "./components/Topbar";
import { showOmnibox } from "./hooks/Omnibox";
import { Omnibox } from "./components/Omnibox";
import { activeId, tabData } from "./hooks/TabState";
import { LandingPage } from "./pages/LandingPage";
import { panicKey, setPanicKey } from "./util/panicKey";
import { onCleanup } from "solid-js";
import { applyPreset } from "./util/applyPreset";

const App: Component = () => {
  const favicon = localStorage.getItem("favicon") || "/logo.png";
  const title = localStorage.getItem("title") || "Abyss";
  applyPreset(favicon, title);

  const backgroundColor = localStorage.getItem("theme") || "navy";
  const handlePanicKey = (e: KeyboardEvent) => {
    if (e.key === panicKey()) {
      window.location.href = "https://www.google.com";
    }
  };

  window.addEventListener("keypress", handlePanicKey);

  onCleanup(() => {
    window.removeEventListener("keypress", handlePanicKey);
  });
  console.log(activeId());
  return (
    <div>
      <div
        class={
          /*"gradientAnimate bg-gradient-to-br from-red-300 to-red-400" */ "flex h-screen flex-col items-start justify-center p-3"
        }
        style={{
          background: `radial-gradient(circle at bottom, ${backgroundColor} 0, black 100%)`,
          animation: "9s ease 0s infinite normal none running AnimationName"
        }}
      >
        <Topbar />
        <div class="relative h-full w-full rounded-lg bg-black bg-opacity-40">
          {showOmnibox() && <Omnibox />}
          <div
            id="viewports"
            class={"h-full w-full " + (tabData().length === 0 ? "hidden" : "")}
          ></div>
          <div
            class={"h-full w-full" + (tabData().length !== 0 ? "hidden" : "")}
          >
            <LandingPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
