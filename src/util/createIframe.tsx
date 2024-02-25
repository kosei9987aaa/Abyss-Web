import { render } from "solid-js/web";
import { Iframe } from "../components/Iframe";
import { activeId } from "../hooks/TabState";
import { Settings } from "../pages/Settings";

export const createIframe = (
  tabId: number,
  favicon: string,
  title: string,
  src: string
) => {
  const containerDiv = document.getElementById("viewports");

  if (containerDiv) {
    if (src === "abyss://settings") {
      render(
        () => (
          <div
            id={"sidetab" + tabId}
            class={activeId() !== tabId ? " hidden" : ""}
          >
            <div id="abyss://settings" class="text-white">
              <Settings />
            </div>
          </div>
        ),
        containerDiv
      );
    } else {
      render(
        () => (
          <Iframe tabId={tabId} title={title} favicon={favicon} src={src} />
        ),
        containerDiv
      );
    }
  }
};
