import { createSignal } from "solid-js";

interface Tab {
  id: number;
  title: string;
  favicon: string;
  url: string;
}

export const [activeId, setActiveId] = createSignal(1);

export const [tabIds, setTabIds] = createSignal<number[]>([]);

export const [tabSrc, setTabSrc] = createSignal("");

export const [tabData, setTabData] = createSignal<Tab[]>([]);
