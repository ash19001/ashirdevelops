"use client";

import type { ReactNode } from "react";
import { useCaseFile } from "@/components/case-file/context";

/** A link to another page of the file. Without script it is a plain #hash link. */
export function PageLink({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  const { goToId } = useCaseFile();
  return (
    <a
      href={`#${to}`}
      onClick={(e) => {
        e.preventDefault();
        goToId(to);
      }}
      className={className}
    >
      {children}
    </a>
  );
}
