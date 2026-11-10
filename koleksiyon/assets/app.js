/* Sand.Code Koleksiyon: küçük etkileşimler. Sayfa JavaScript olmadan da okunur. */
(function () {
  document.documentElement.classList.add("js");
  var WA = "https://wa.me/905445452967";

  // Menü ve başlık
  var top = document.getElementById("top");
  function onScroll() { top.classList.toggle("scrolled", window.scrollY > 8); }
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  var btn = document.getElementById("menuBtn"), nav = document.getElementById("nav");
  btn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
  });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); } });

  // Alt bilgi yılı
  var y = document.getElementById("yil"); if (y) y.textContent = new Date().getFullYear();

  // Aşağıdaki bölümler görününce yumuşakça belirsin (ilk ekran etkilenmez)
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    var t = Array.prototype.filter.call(document.querySelectorAll(".sec-head,.promises article,.steps li,.faq details,.form,.cta-band,.tile"),
      function (el) { return el.getBoundingClientRect().top > window.innerHeight; });
    t.forEach(function (el) { el.classList.add("reveal"); });
    var ro = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    t.forEach(function (el) { ro.observe(el); });
  }

  // Koleksiyon: arama, bölge filtresi, sıralama
  var grid = document.getElementById("grid");
  if (grid) {
    var orig = Array.prototype.slice.call(grid.children);
    var q = document.getElementById("q"), sort = document.getElementById("sort");
    var count = document.getElementById("count"), empty = document.getElementById("empty");
    var chips = document.querySelectorAll(".chip"), reg = "";
    var tr = function (s) { return s.toLowerCase().replace(/[çğıöşü]/g, function (c) { return "cgiosu"["çğıöşü".indexOf(c)]; }); };
    var render = function () {
      var s = tr(q.value.trim()), list = orig.slice();
      if (sort.value === "name") list.sort(function (a, b) { return a.dataset.name.localeCompare(b.dataset.name); });
      if (sort.value === "year") list.sort(function (a, b) { return (parseInt(a.dataset.year) || 9999) - (parseInt(b.dataset.year) || 9999); });
      var n = 0;
      list.forEach(function (c) {
        var ok = (!reg || c.dataset.reg === reg) && (!s || c.dataset.search.indexOf(s) > -1);
        c.hidden = !ok; if (ok) n++; grid.appendChild(c);
      });
      count.textContent = n + " banknot gösteriliyor";
      empty.hidden = n > 0;
    };
    var setReg = function (r) {
      reg = r;
      chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset.r === r)); });
      render();
    };
    chips.forEach(function (c) { c.addEventListener("click", function () {
      setReg(c.dataset.r); history.replaceState(null, "", c.dataset.h ? "#" + c.dataset.h : location.pathname);
    }); });
    q.addEventListener("input", render); sort.addEventListener("change", render);
    var h = location.hash.slice(1), start = "";
    chips.forEach(function (c) { if (c.dataset.h === h) start = c.dataset.r; });
    setReg(start);
  }

  // Detay: fotoğrafı büyüt
  var lb = document.getElementById("lb");
  if (lb) {
    var big = lb.querySelector("img");
    document.querySelectorAll(".zoom").forEach(function (a) {
      a.addEventListener("click", function (ev) { ev.preventDefault(); big.src = a.href; big.alt = a.querySelector("img").alt; lb.hidden = false; });
    });
    lb.addEventListener("click", function () { lb.hidden = true; });
    document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") lb.hidden = true; });
  }

  // İletişim formu: mesaj WhatsApp'ta hazır açılır (sunucuya veri gönderilmez)
  var form = document.getElementById("mesaj-formu");
  if (form) {
    var err = document.getElementById("f-err"), ad = document.getElementById("f-ad");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!ad.value.trim()) { err.hidden = false; ad.focus(); return; }
      err.hidden = true;
      var konu = document.getElementById("f-konu").value, msg = document.getElementById("f-mesaj").value.trim();
      var text = "Merhaba, ben " + ad.value.trim() + ". Banknot koleksiyonu sitesi üzerinden yazıyorum. Konu: " + konu + "." + (msg ? "\n\n" + msg : "");
      window.open(WA + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    });
    ad.addEventListener("input", function () { err.hidden = true; });
  }
})();
