const supportsObserver = "IntersectionObserver" in window;

// Header: show its bottom rule once the page leaves the very top
const header = document.querySelector(".site-header");
const topSentinel = document.querySelector(".top-sentinel");

// Progressive enhancement: navigation remains visible without JavaScript.
const navToggle = document.querySelector(".nav-toggle");
const navigation = document.querySelector("#main-navigation");
if (header && navToggle && navigation) {
    const closeNavigation = () => {
        header.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
    };
    navToggle.hidden = false;
    header.classList.add("nav-ready");
    navToggle.addEventListener("click", () => {
        const open = header.classList.toggle("nav-open");
        navToggle.setAttribute("aria-expanded", String(open));
    });
    navigation.addEventListener("click", (event) => {
        const link = event.target.closest("a[href^='#']");
        if (!link || !header.classList.contains("nav-open")) return;
        closeNavigation();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
            target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
        }
    });
    header.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && header.classList.contains("nav-open")) {
            closeNavigation();
            navToggle.focus();
        }
    });
    window.matchMedia("(max-width: 720px)").addEventListener("change", closeNavigation);
}

if (supportsObserver && header && topSentinel) {
    const topWatcher = new IntersectionObserver(([entry]) => {
        header.classList.toggle("scrolled", !entry.isIntersecting);
    });
    topWatcher.observe(topSentinel);
}

// Scrollspy: highlight the nav link for the section currently in view
const navLinks = document.querySelectorAll(".site-header nav a[href^='#']");
const spiedSections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

if (supportsObserver && spiedSections.length) {
    const spy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => {
                    const active = link.getAttribute("href") === "#" + entry.target.id;
                    link.classList.toggle("active", active);
                    if (active) link.setAttribute("aria-current", "location");
                    else link.removeAttribute("aria-current");
                });
            }
        });
    }, { rootMargin: "-25% 0px -65% 0px" });

    spiedSections.forEach((section) => spy.observe(section));
}
