"use client";
import { SearchModal } from "./search-modal";
import { FloatingNav } from "./floating-nav";
import { BackToTop } from "./back-to-top";
import { NewsletterModal } from "./newsletter-modal";
import { NewsletterWidget } from "./newsletter-widget";

export function GlobalUI() {
  return (
    <>
      <SearchModal />
      <FloatingNav />
      <BackToTop />
      <NewsletterModal />
      <NewsletterWidget />
    </>
  );
}
