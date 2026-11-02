"use client";

import { createContext, useContext } from "react";

export type PageMeta = { id: string; tab: string; title: string };

type CaseFileValue = {
  pages: PageMeta[];
  index: number;
  goTo: (index: number) => void;
  goToId: (id: string) => void;
};

export const CaseFileContext = createContext<CaseFileValue | null>(null);

export function useCaseFile() {
  const value = useContext(CaseFileContext);
  if (!value) throw new Error("useCaseFile must be used inside <CaseFile>");
  return value;
}

type SheetValue = {
  id: string;
  /** The sheet is the one on top: its stamps land and its reel plays. */
  active: boolean;
  /** The sheet is near enough to the top that its pictures should load. */
  primed: boolean;
};

export const SheetContext = createContext<SheetValue>({ id: "", active: false, primed: false });

export const useSheet = () => useContext(SheetContext);
