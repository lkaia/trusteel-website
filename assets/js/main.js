document.documentElement.classList.add("js");

/* sticky header shadow */
const header = document.querySelector(".site-header");
const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 12);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* mobile nav */
const toggle = document.querySelector(".nav-toggle");
if (toggle) {
  toggle.addEventListener("click", () => document.body.classList.toggle("nav-open"));
  document.querySelectorAll(".main-nav a").forEach((a) =>
    a.addEventListener("click", () => document.body.classList.remove("nav-open"))
  );
}

/* reveal on scroll — content is visible without JS (progressive enhancement) */
const io = "IntersectionObserver" in window
  ? new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    )
  : null;
document.querySelectorAll(".reveal").forEach((el) => io ? io.observe(el) : el.classList.add("in"));

/* quote / distributor forms — compose a WhatsApp message with the entered details */
document.querySelectorAll("form[data-whatsapp]").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const lines = [];
    new FormData(form).forEach((v, k) => {
      if (String(v).trim()) lines.push(`${k}: ${v}`);
    });
    const msg = encodeURIComponent(
      `Hello Trusteel — ${form.dataset.whatsapp}\n\n${lines.join("\n")}`
    );
    window.open(`https://wa.me/35797643064?text=${msg}`, "_blank", "noopener");
  });
});