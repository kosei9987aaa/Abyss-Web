import { tabData } from "../hooks/TabState";

export const setTabTitle = (id: number, newTitle: string) => {
  const title = document.getElementById(
    "tab-title-" + id
  ) as HTMLElement | null;
  if (title) {
    title.innerHTML = newTitle;

    const tab = tabData().find((tab) => tab.id === id);

    if (tab) {
      tab.title = newTitle;
    }
  }
};
