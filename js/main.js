/* Sand.Code — small interactions; the page works fully without them. */
(function () {
  document.documentElement.classList.add("js");

  // Header border once scrolled
  const top = document.getElementById("top");
  const onScroll = () => top.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  const btn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
  });
  nav.addEventListener("click", e => {
    if (e.target.closest("a")) { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
  });

  // Count-up stats (numbers are already correct in the HTML)
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const counters = document.querySelectorAll(".count");
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target, to = +el.dataset.to, t0 = performance.now(), dur = 1200;
        const step = now => {
          const p = Math.min(1, (now - t0) / dur);
          el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(c => io.observe(c));
  }

  // Reveal sections (only below the first screen, so the first frame is complete)
  if (!reduce && "IntersectionObserver" in window) {
    const targets = [...document.querySelectorAll(".sec .sec-head, .card, .steps li, .proj, .study-copy, .shots, .faq details, .form")]
      .filter(el => el.getBoundingClientRect().top > window.innerHeight);
    targets.forEach(el => el.classList.add("reveal"));
    const ro = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach(el => ro.observe(el));
  }

  // Portfolio filter
  const filters = document.querySelectorAll(".filters button");
  const projects = document.querySelectorAll(".proj");
  filters.forEach(b => b.addEventListener("click", () => {
    filters.forEach(x => x.classList.toggle("on", x === b));
    const f = b.dataset.f;
    projects.forEach(p => { p.hidden = !(f === "all" || p.dataset.c === f); });
  }));

  // Quote form -> WhatsApp with the message prefilled
  const form = document.getElementById("teklif");
  const err = document.getElementById("f-err");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const ad = document.getElementById("f-ad").value.trim();
    if (!ad) { err.hidden = false; document.getElementById("f-ad").focus(); return; }
    err.hidden = true;
    const hizmet = document.getElementById("f-hizmet").value;
    const mesaj = document.getElementById("f-mesaj").value.trim();
    const text = `Merhaba, ben ${ad}. ${hizmet} için teklif almak istiyorum.${mesaj ? "\n\n" + mesaj : ""}`;
    window.open("https://wa.me/905445452967?text=" + encodeURIComponent(text), "_blank", "noopener");
  });
  document.getElementById("f-ad").addEventListener("input", () => { err.hidden = true; });

  const y = document.getElementById("yil");
  if (y) y.textContent = new Date().getFullYear();
})();
