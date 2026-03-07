const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileDrawer = document.querySelector("[data-mobile-drawer]");
const revealNodes = document.querySelectorAll(".reveal");
const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");
const isFigmaCapture = window.location.hash.includes("figmacapture=");

if (isFigmaCapture) {
  document.body.classList.add("figma-capture");
}

const syncHeader = () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 12);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

if (menuToggle && mobileDrawer) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    mobileDrawer.classList.toggle("is-open", !expanded);
  });

  mobileDrawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      mobileDrawer.classList.remove("is-open");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -6% 0px",
  }
);

if (!isFigmaCapture) {
  revealNodes.forEach((node) => revealObserver.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

if (contactForm && formNote) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formNote.textContent = "Inquiry captured for demo purposes. Connect this form to your backend to go live.";
    formNote.classList.add("is-success");
    contactForm.reset();
  });
}
