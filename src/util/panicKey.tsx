import { createSignal } from "solid-js";
export const [panicKey, setPanicKey] = createSignal(
  localStorage.getItem("panicKey") || "]"
);
