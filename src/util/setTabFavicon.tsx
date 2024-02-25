import { tabData, setTabData } from "../hooks/TabState";

export const setTabFavicon = (id: number, newFavicon: string) => {
  const favicon = document.getElementById("favicon-" + id) as HTMLImageElement | null;
  if (favicon) {
    favicon.src = newFavicon;

    const tab = tabData().find((tab) => tab.id === id);

    if (tab) {
      tab.favicon = newFavicon;
      console.log(tabData());
    }
  }
};
