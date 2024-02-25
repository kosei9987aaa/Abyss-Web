import { activeId } from "../hooks/TabState";
import { TabTemplate } from "../components/TabTemplate";
import { render } from "solid-js/web";
import { setTabData } from "../hooks/TabState";

export const createTab = (
  tabId: number,
  favicon: string,
  title: string,
  src: string
) => {
  const newTab = { id: tabId, title: title, favicon: favicon, url: src };
  setTabData((prevTabData) => [...prevTabData, newTab]);
};
