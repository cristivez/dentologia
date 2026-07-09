"use client";

import { useSyncExternalStore } from "react";

type ScrollState = {
  scrollDirection: "up" | "down";
  isAtTop: boolean;
};

let state: ScrollState = { scrollDirection: "up", isAtTop: true };
let lastScrollY = 0;
const threshold = 80;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function handleScroll() {
  const currentScrollY = window.scrollY;
  const newIsAtTop = currentScrollY < 10;
  let newDirection = state.scrollDirection;

  if (Math.abs(currentScrollY - lastScrollY) > threshold) {
    newDirection = currentScrollY > lastScrollY ? "down" : "up";
    lastScrollY = currentScrollY;
  }

  if (newDirection !== state.scrollDirection || newIsAtTop !== state.isAtTop) {
    state = { scrollDirection: newDirection, isAtTop: newIsAtTop };
    notify();
  }
}

let listening = false;

function subscribe(callback: () => void) {
  listeners.add(callback);
  if (!listening && typeof window !== "undefined") {
    window.addEventListener("scroll", handleScroll, { passive: true });
    listening = true;
  }
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0 && listening) {
      window.removeEventListener("scroll", handleScroll);
      listening = false;
    }
  };
}

function getSnapshot() {
  return state;
}

const serverSnapshot: ScrollState = { scrollDirection: "up", isAtTop: true };

function getServerSnapshot(): ScrollState {
  return serverSnapshot;
}

export function useScrollDirection() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
