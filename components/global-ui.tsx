"use client";
import { SearchModal } from "./search-modal";
import { FloatingNav } from "./floating-nav";
import { BackToTop } from "./back-to-top";

export function GlobalUI() {
  return (
    <>
      <SearchModal />
      <FloatingNav />
      <BackToTop />
    </>
  );
}
