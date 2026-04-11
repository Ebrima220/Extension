// Entry point for client-side behavior.
// Keep this file as a module so you can use imports later if needed.

let currentFilter = "all";

function setTheme(theme) {
  const isLight = theme === "light";
  document.body.classList.toggle("theme-light", isLight);
  localStorage.setItem("theme", isLight ? "light" : "dark");

  const icon = document.getElementById("themeToggleIcon");
  if (icon instanceof HTMLImageElement) {
    const darkIcon = icon.dataset.iconDark;
    const lightIcon = icon.dataset.iconLight;
    // When current theme is light, show the "dark" icon (to switch to dark), and vice versa.
    icon.src = isLight ? lightIcon ?? icon.src : darkIcon ?? icon.src;
  }
}

function initThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") setTheme(saved);
  else setTheme("dark");

  btn.addEventListener("click", () => {
    const isLight = document.body.classList.contains("theme-light");
    setTheme(isLight ? "dark" : "light");
  });
}

function getIsActive(cardEl) {
  const toggle = cardEl.querySelector(".extension-toggle");
  return Boolean(toggle?.checked);
}

const FILTER_ACTIVE_CLASSES = {
  all: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
  active: "bg-green-600 hover:bg-green-700 text-white shadow-sm",
  inactive: "bg-red-600 hover:bg-red-700 text-white shadow-sm",
};

const FILTER_INACTIVE_CLASSES =
  "filter-muted bg-gray-700/70 text-gray-300 hover:bg-gray-600 border border-gray-600/60";

function updateFilterButtonStyles(activeFilter) {
  document.querySelectorAll("button[data-filter]").forEach((btn) => {
    const key = btn.dataset.filter ?? "all";
    const isOn = key === activeFilter;
    const active = FILTER_ACTIVE_CLASSES[key] ?? FILTER_ACTIVE_CLASSES.all;
    btn.dataset.selected = isOn ? "true" : "false";
    btn.className =
      "filter-btn w-full px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base rounded-full transition-colors " +
      (isOn ? active : FILTER_INACTIVE_CLASSES);
  });
}

function applyFilter(filter) {
  currentFilter = filter;
  updateFilterButtonStyles(filter);
  const cards = document.querySelectorAll(".extension-card");

  cards.forEach((card) => {
    const isActive = getIsActive(card);
    const shouldShow =
      filter === "all" || (filter === "active" ? isActive : !isActive);

    // Avoid relying on Tailwind's `hidden` class existing at runtime.
    card.style.display = shouldShow ? "" : "none";
  });
}

function initFilters() {
  const buttons = document.querySelectorAll("button[data-filter]");
  if (!buttons.length) return;

  applyFilter(currentFilter);

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter ?? "all";
      applyFilter(filter);
    });
  });

  // If a toggle changes while a filter is active,
  // keep the list consistent without requiring another click.
  document.addEventListener("change", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (!target.classList.contains("extension-toggle")) return;
    applyFilter(currentFilter);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFilters);
  document.addEventListener("DOMContentLoaded", initThemeToggle);
} else {
  initFilters();
  initThemeToggle();
}
 

// removing extensions from the list is purely a client-side action here, so we can just remove the card element from the DOM when the "Remove" button is clicked. This won't persist across page reloads, but it meets the requirement of removing it from the current view.

function initRemoveButtons() {
  const removeIds = [
    "remove-devlens", "remove-stylespy", "remove-speedboost", "remove-jsonwizard",
    "remove-tabmaster", "remove-viewportbuddy", "remove-markupnotes", "remove-gridguide",
    "remove-palettepicker", "remove-linkchecker", "remove-domsnapshot", "remove-consoleplus"
  ];

  removeIds.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => {
        btn.closest(".extension-card").remove();
      });
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFilters);
  document.addEventListener("DOMContentLoaded", initThemeToggle);
  document.addEventListener("DOMContentLoaded", initRemoveButtons);
} else {
  initFilters();
  initThemeToggle();
  initRemoveButtons();
}