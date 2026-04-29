"use client";

export function NavSearchTrigger() {
  return (
    <button
      className="search-trigger"
      onClick={() => window.dispatchEvent(new CustomEvent("open-search"))}
      aria-label="Rechercher (⌘K)"
    >
      <span>Rechercher</span>
      <kbd>⌘K</kbd>
    </button>
  );
}
