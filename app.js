/* UP GYM — monta o site a partir do conteudo.js e dá o movimento.
   Para editar textos, use só o conteudo.js. */
(function () {
  var C = window.CONTEUDO || {};
  var doc = document.documentElement;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  // *palavra* fica vermelha; [EDITAR] fica amarelo para achar fácil
  var fmt = function (t) { return esc(t).replace(/\*([^*]+)\*/g, "<em>$1</em>").replace(/\[EDITAR[^\]]*\]/g, '<span class="editar">$&</span>'); };
  var limpo = function (t) { return String(t || "").replace(/\*/g, ""); };
  var linhas = function (arr) { return [].concat(arr || []).map(function (l) { return '<span class="linha"><span class="in">' + fmt(l) + "</span></span>"; }).join(""); };

  doc.classList.add("js");

  /* ---------- conteúdo ---------- */
  var wa = "https://wa.me/" + String(C.whatsapp || "").replace(/\D/g, "") + "?text=" + encodeURIComponent(C.mensagemWhatsapp || "");
  $$("[data-wa]").forEach(function (a) { a.href = wa; a.target = "_blank"; a.rel = "noopener"; });
  $$("[data-c]").forEach(function (el) { var v = C[el.getAttribute("data-c")]; if (v != null) el.innerHTML = fmt(v); });

  $("#titulo").innerHTML = linhas(C.titulo);
  $("#chamada-final").innerHTML = linhas(C.chamadaFinal);
  $("#manifesto-texto").innerHTML = fmt(C.manifesto);
  if (C.horarios && C.horarios[0]) $("#hero-horario").textContent = C.horarios[0].dia + " · " + C.horarios[0].hora;


  $("#numeros").innerHTML = [
    [C.notaGoogle, "Nota no Google"], [C.totalAvaliacoes, "Avaliações"], [C.seguidores, "Seguidores no Instagram"], [C.abre, "Abre de segunda a sexta"]
  ].map(function (n) { return '<div class="numero"><strong data-num="' + esc(n[0]) + '">' + esc(n[0]) + '</strong><span class="mono">' + esc(n[1]) + "</span></div>"; }).join("");

  $("#trilho").insertAdjacentHTML("beforeend", (C.estrutura || []).map(function (e, i) {
    return '<article class="painel"><div class="painel-foto"><img src="' + esc(e.foto) + '" alt="' + esc(limpo(e.titulo)) + ' na UP Gym" loading="lazy"><span class="painel-num mono">' +
      String(i + 1).padStart(2, "0") + " / " + String(C.estrutura.length).padStart(2, "0") + "</span></div><h3>" + fmt(e.titulo) + "</h3><p>" + fmt(e.texto) + "</p></article>";
  }).join(""));

  $("#galeria").innerHTML = (C.galeria || []).map(function (f, i) {
    return '<figure><img src="' + esc(f) + '" alt="Foto ' + (i + 1) + ' da UP Gym por dentro" loading="lazy"></figure>';
  }).join("");

  $("#avaliacoes-lista").innerHTML = (C.avaliacoes || []).map(function (a) {
    return '<figure class="avaliacao"><span class="avaliacao-estrelas" aria-label="5 estrelas">★★★★★</span><blockquote>“' + esc(a.texto) + '”</blockquote><figcaption class="mono">' + esc(a.nome) + " · Google</figcaption></figure>";
  }).join("");

  $("#horarios").innerHTML = (C.horarios || []).map(function (h) { return "<dt>" + esc(h.dia) + "</dt><dd>" + fmt(h.hora) + "</dd>"; }).join("");
  $("#como-chegar").href = C.linkMaps || "#";
  $("#link-avaliacoes").href = C.linkMaps || "#";
  $("#link-insta").href = "https://www.instagram.com/" + (C.instagram || "") + "/";

  // vídeo certo para cada tela (vertical no celular, deitado no PC)
  var video = $("#hero-video");
  video.src = window.matchMedia("(max-width: 767px)").matches ? "assets/hero-celular.mp4" : "assets/hero.mp4";
  var tocar = video.play && video.play(); if (tocar && tocar.catch) tocar.catch(function () {});

  // SEO local
  var ld = {
    "@context": "https://schema.org", "@type": "ExerciseGym", name: "UP Gym",
    description: limpo(C.subtitulo), url: location.origin + location.pathname, telephone: "+" + C.whatsapp,
    image: new URL("assets/hero.jpg", location.href).href, logo: new URL("assets/logo-vermelha.svg", location.href).href,
    address: { "@type": "PostalAddress", streetAddress: C.endereco, addressLocality: "Ponta Porã", addressRegion: "MS", postalCode: C.cep, addressCountry: "BR" },
    geo: { "@type": "GeoCoordinates", latitude: -22.5451001, longitude: -55.7270269 },
    sameAs: ["https://www.instagram.com/" + C.instagram + "/"],
    aggregateRating: { "@type": "AggregateRating", ratingValue: String(C.notaGoogle).replace(",", "."), reviewCount: C.totalAvaliacoes, bestRating: "5" }
  };
  var s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(ld); document.head.appendChild(s);

  /* ---------- movimento ---------- */
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var g = window.gsap, ST = window.ScrollTrigger;
  var loader = $("#loader");
  if (reduz || !g || !ST) { loader && loader.remove(); doc.classList.remove("carregando"); return; }
  g.registerPlugin(ST); if (window.SplitText) g.registerPlugin(window.SplitText);

  // rolagem suave (Lenis), sincronizada com o GSAP
  var lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ST.update);
    g.ticker.add(function (t) { lenis.raf(t * 1000); });
    g.ticker.lagSmoothing(0);
    lenis.stop();
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) { var alvo = $(a.getAttribute("href")); if (alvo) { e.preventDefault(); lenis.scrollTo(alvo, { offset: 0, duration: 1.4 }); } });
    });
  }

  // 1) o neon da logo acende + contador
  var intro = g.timeline({ defaults: { ease: "expo.out" } });
  intro
    .to(".loader-logo", { duration: 0.05, opacity: 1 })
    .to(".loader-logo", { duration: 0.05, opacity: 0.2 }, "+=0.08")
    .to(".loader-logo", { duration: 0.05, opacity: 1 }, "+=0.06")
    .to(".loader-logo", { duration: 0.04, opacity: 0.4 }, "+=0.12")
    .to(".loader-logo", { duration: 0.6, opacity: 1, filter: "drop-shadow(0 0 18px rgba(255,13,37,.85)) drop-shadow(0 0 60px rgba(255,13,37,.45))" })
    .to(".loader-logo", { scale: 0.9, opacity: 0, duration: 0.5, ease: "power2.in" }, "+=0.15")
    .to(loader, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut" }, "-=0.2")
    .add(function () { loader.remove(); doc.classList.remove("carregando"); lenis && lenis.start(); })
    .from(video, { scale: 1.25, duration: 2.2, ease: "expo.out" }, "-=0.9")
    .from("#titulo .in", { yPercent: 110, duration: 1.3, stagger: 0.09 }, "-=1.9")
    .from(".hero-topo > *, .hero-sub, .hero .botao, .hero-base > *", { y: 24, opacity: 0, duration: 1, stagger: 0.06 }, "-=1.1");

  // 2) topo: some ao descer, volta ao subir
  var topo = $("#topo"), ultimo = 0;
  ST.create({
    start: 0, end: "max",
    onUpdate: function (self) {
      var y = self.scroll();
      topo.classList.toggle("solido", y > 60);
      topo.classList.toggle("some", y > window.innerHeight * 0.8 && self.direction === 1);
      ultimo = y;
    }
  });

  // 4) títulos entram linha por linha
  var dividir = function (el) {
    if (window.SplitText) return window.SplitText.create(el, { type: "lines", mask: "lines", linesClass: "l" }).lines;
    return [el];
  };
  $$(".titulo-secao, .final-titulo").forEach(function (el) {
    var alvo = el.classList.contains("final-titulo") ? $$(".in", el) : dividir(el);
    g.from(alvo, { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: el, start: "top 85%" } });
  });
  $$(".rotulo").forEach(function (el) {
    g.from(el, { opacity: 0, x: -16, duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } });
  });

  // 5) frase de impacto acende palavra por palavra
  if (window.SplitText) {
    var palavras = window.SplitText.create("#manifesto-texto", { type: "words" }).words;
    g.fromTo(palavras, { opacity: 0.12 }, { opacity: 1, stagger: 0.04, ease: "none", scrollTrigger: { trigger: "#manifesto-texto", start: "top 80%", end: "bottom 45%", scrub: true } });
  }

  // 6) números contam
  $$("[data-num]").forEach(function (el) {
    var orig = el.getAttribute("data-num"), m = orig.match(/[\d.,]+/);
    if (!m) return;
    var alvo = parseFloat(m[0].replace(/\./g, "").replace(",", ".")), casas = (m[0].split(",")[1] || "").length, o = { v: 0 };
    g.to(o, { v: alvo, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" },
      onUpdate: function () { var t = o.v.toFixed(casas).replace(".", ","); if (!casas && /^0/.test(m[0])) t = t.padStart(m[0].length, "0"); el.textContent = orig.replace(m[0], t); } });
  });

  // 7) estrutura: no PC a seção trava e as fotos passam para o lado
  var mm = g.matchMedia();
  mm.add("(min-width: 900px)", function () {
    var trilho = $("#trilho");
    var dist = function () { return trilho.scrollWidth - window.innerWidth; };
    var mov = g.to(trilho, { x: function () { return -dist(); }, ease: "none",
      scrollTrigger: { trigger: "#estrutura", start: "top top", end: function () { return "+=" + dist(); }, pin: true, scrub: 1, invalidateOnRefresh: true } });
    $$(".painel-foto img").forEach(function (img) {
      g.fromTo(img, { xPercent: -6, scale: 1.18 }, { xPercent: 6, scale: 1.18, ease: "none",
        scrollTrigger: { trigger: img.closest(".painel"), containerAnimation: mov, start: "left right", end: "right left", scrub: true } });
    });
  });
  mm.add("(max-width: 899px)", function () {
    $$(".painel").forEach(function (p) {
      var img = $("img", p);
      g.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: p, start: "top bottom", end: "bottom top", scrub: true } });
      g.from($(".painel-foto", p), { clipPath: "inset(18% 0 0 0)", duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 85%" } });
    });
  });

  // 8) galeria: cada foto se abre ao aparecer
  $$(".galeria-grade figure").forEach(function (f) {
    g.from(f, { clipPath: "inset(100% 0 0 0)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: f, start: "top 88%" } });
    g.from($("img", f), { scale: 1.3, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: f, start: "top 88%" } });
  });

  // 9) avaliações e chamada final
  $$(".avaliacao").forEach(function (a) {
    g.from(a.children, { y: 40, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: a, start: "top 85%" } });
  });
  g.fromTo(".final-foto", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".final", start: "top bottom", end: "bottom top", scrub: true } });

  window.addEventListener("load", function () { ST.refresh(); });
})();
