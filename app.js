/* Monta o site a partir do conteudo.js. Para editar textos, use o conteudo.js. */
(function () {
  var C = window.CONTEUDO || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  // *palavra* vira itálico; [EDITAR] fica amarelo para achar fácil
  var fmt = function (t) {
    return esc(t).replace(/\*([^*]+)\*/g, "<em>$1</em>").replace(/\[EDITAR[^\]]*\]/g, '<span class="editar">$&</span>');
  };
  var limpo = function (t) { return String(t || "").replace(/\*/g, ""); };
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var wa = "https://wa.me/" + String(C.whatsapp || "").replace(/\D/g, "") + "?text=" + encodeURIComponent(C.mensagemWhatsapp || "");
  $$("[data-wa]").forEach(function (a) { a.href = wa; a.target = "_blank"; a.rel = "noopener"; });

  $$("[data-c]").forEach(function (el) {
    var v = C[el.getAttribute("data-c")];
    if (v != null) el.innerHTML = fmt(v);
  });

  // Título: cada palavra surge em sequência
  var h1 = $("#titulo");
  h1.innerHTML = fmt(C.titulo || h1.textContent).split(/ (?![^<]*<\/em>)/).map(function (p, i) {
    return '<span class="p" style="animation-delay:' + (0.75 + i * 0.14) + 's">' + p + "</span>";
  }).join(" ");
  $("#chamada-final").innerHTML = fmt(C.chamadaFinal);
  if (C.horarios && C.horarios[0]) $("#hero-horario").textContent = C.horarios[0].dia + " · " + C.horarios[0].hora;

  // Frase de impacto: acende palavra por palavra ao rolar
  var man = $("[data-palavras]");
  man.innerHTML = String(C.manifesto || "").split(" ").map(function (w) {
    var it = /^\*.*\*[.,:!?]*$/.test(w);
    return '<span class="w' + (it ? " i" : "") + '">' + esc(w.replace(/\*/g, "")) + "</span>";
  }).join(" ");
  var palavras = $$(".w", man);

  $("#estrutura-lista").innerHTML = (C.estrutura || []).map(function (e) {
    return '<article class="item"><div class="item-foto"><img class="foto-pb" src="' + esc(e.foto) + '" alt="' + esc(limpo(e.titulo)) + ' na UP Gym" loading="lazy"></div>' +
      '<div class="item-texto">' + (e.legenda ? '<p class="item-legenda">' + esc(e.legenda) + "</p>" : "") +
      "<h3>" + fmt(e.titulo) + "</h3><p>" + fmt(e.texto) + "</p></div></article>";
  }).join("");

  $("#galeria").innerHTML = (C.galeria || []).map(function (f, i) {
    return '<figure><img class="foto-pb" src="' + esc(f) + '" alt="Foto ' + (i + 1) + ' da estrutura da UP Gym" loading="lazy"></figure>';
  }).join("");

  $("#avaliacoes-lista").innerHTML = (C.avaliacoes || []).map(function (a) {
    return '<figure class="avaliacao"><blockquote>“' + esc(a.texto) + '”</blockquote><figcaption>' + esc(a.nome) + " · Google</figcaption></figure>";
  }).join("");

  $("#horarios").innerHTML = (C.horarios || []).map(function (h) { return "<dt>" + esc(h.dia) + "</dt><dd>" + fmt(h.hora) + "</dd>"; }).join("");
  $("#como-chegar").href = C.linkMaps || "#";
  $("#link-avaliacoes").href = C.linkMaps || "#";
  $("#link-insta").href = "https://www.instagram.com/" + (C.instagram || "") + "/";

  // Dados para o Google (SEO local)
  var ld = {
    "@context": "https://schema.org", "@type": "ExerciseGym", name: "UP Gym",
    description: limpo(C.subtitulo), url: location.origin + location.pathname, telephone: "+" + C.whatsapp,
    image: new URL("assets/hero.jpg", location.href).href, logo: new URL("assets/logo.svg", location.href).href,
    address: { "@type": "PostalAddress", streetAddress: C.endereco, addressLocality: "Ponta Porã", addressRegion: "MS", postalCode: C.cep, addressCountry: "BR" },
    geo: { "@type": "GeoCoordinates", latitude: -22.5451001, longitude: -55.7270269 },
    sameAs: ["https://www.instagram.com/" + C.instagram + "/"],
    aggregateRating: { "@type": "AggregateRating", ratingValue: String(C.notaGoogle).replace(",", "."), reviewCount: C.totalAvaliacoes, bestRating: "5" }
  };
  var s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(ld); document.head.appendChild(s);

  // Rolagem: topo, frase de impacto e o losango que se abre
  var topo = $("#topo"), hero = $("#inicio");
  var ab = $("#abertura"), foto = $(".abertura-foto"), moldura = $(".abertura-moldura");
  var ultimoY = 0, tick = false;
  var lim = function (v) { return Math.min(1, Math.max(0, v)); };
  var suave = function (t) { return 1 - Math.pow(1 - t, 3); };

  function rolar() {
    var y = window.scrollY, vh = window.innerHeight;
    topo.classList.toggle("rolou", y > 40);
    topo.classList.toggle("escondido", y > hero.offsetHeight && y > ultimoY + 4);
    if (y < ultimoY - 4 || y < hero.offsetHeight) topo.classList.remove("escondido");
    ultimoY = y;

    var r = man.getBoundingClientRect();
    var n = Math.round(lim((vh * 0.85 - r.top) / (r.height + vh * 0.3)) * palavras.length);
    palavras.forEach(function (w, i) { w.classList.toggle("on", i < n); });

    if (!reduz) {
      var a = ab.getBoundingClientRect();
      var p = suave(lim(-a.top / (a.height - vh)));
      // losango cresce do centro até cobrir a tela inteira
      var w = foto.clientWidth, h = foto.clientHeight, cx = w / 2, cy = h / 2;
      var r0 = Math.min(w, h) * 0.16, r1 = (w + h) / 2 + 2; // r1 cobre os cantos
      var rr = r0 + (r1 - r0) * p;
      foto.style.clipPath = "polygon(" + cx + "px " + (cy - rr) + "px," + (cx + rr) + "px " + cy + "px," + cx + "px " + (cy + rr) + "px," + (cx - rr) + "px " + cy + "px)";
      moldura.style.setProperty("--d", (rr + 18) * Math.SQRT2 + "px");
      moldura.style.setProperty("--m", String(1 - lim(p * 2.5)));
      ab.classList.toggle("aberta", p > 0.82);
    }
    tick = false;
  }
  window.addEventListener("scroll", function () { if (!tick) { tick = true; requestAnimationFrame(rolar); } }, { passive: true });
  window.addEventListener("resize", rolar);
  rolar();

  // Fotos da estrutura se revelam ao aparecer
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("visto"); io.unobserve(e.target); } });
    }, { threshold: 0.2 });
    $$(".item").forEach(function (i) { io.observe(i); });
  } else { $$(".item").forEach(function (i) { i.classList.add("visto"); }); }
})();
