// Back to top button
const backToTopButton = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    backToTopButton.classList.toggle("visible", window.scrollY > 600);
}, { passive: true });

backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Subtle reveal-on-scroll (skipped if the user prefers reduced motion)
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const targets = document.querySelectorAll(
        ".skill-card, .edu-card, .timeline-item, .project-card, .cert-card, .contact-chip"
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px 0px 12% 0px", threshold: 0.05 });

    targets.forEach((el) => {
        el.classList.add("reveal");
        observer.observe(el);
    });
}

// Scrollspy: highlight the nav link for the section currently in view
const navLinks = document.querySelectorAll(".site-header nav a[href^='#']");
const spiedSections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

if ("IntersectionObserver" in window && spiedSections.length) {
    const spy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === "#" + entry.target.id
                    );
                });
            }
        });
    }, { rootMargin: "-25% 0px -65% 0px" });

    spiedSections.forEach((section) => spy.observe(section));
}
