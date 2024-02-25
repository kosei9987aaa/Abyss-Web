import { createSignal } from "solid-js";

interface BookmarkProps {
  id: number;
  icon: string;
  title: string;
  href: string;
}

export const [bookmarks, setBookmarks] = createSignal<BookmarkProps[]>([]);
