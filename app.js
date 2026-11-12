/* Monta o site a partir do conteudo.js. Para editar textos, use o conteudo.js. */
(function () {
  var C = window.CONTEUDO || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  // Deixa [EDITAR] amarelo para ser fácil de achar na revisão
  var marca = function (t) { return esc(t).replace(/\[EDITAR[^\]]*\]/g, '<span class="editar">$&</span>'); };

  var wa = "https://wa.me/" + String(C.whatsapp || "").replace(/\D/g, "") + "?text=" + encodeURIComponent(C.mensagemWhatsapp || "");
  $$("[data-wa]").forEach(function (a) { a.href = wa; a.target = "_blank"; a.rel = "noopener"; });

  $$("[data-c]").forEach(function (el) {
    var v = C[el.getAttribute("data-c")];
    if (v != null) el.innerHTML = marca(v);
  });

  // Título do topo sobe palavra por palavra
  var h1 = $(".hero-titulo");
  h1.innerHTML = esc(C.titulo || h1.textContent).split(" ").map(function (p, i) {
    return '<span class="p" style="animation-delay:' + (0.15 + i * 0.12) + 's">' + p + "</span>";
  }).join(" ");

  // Frase de impacto acende conforme a rolagem
  var man = $("[data-palavras]");
  var destaque = /^(estrutura|cima\.?|favor:?)$/i;
  man.innerHTML = esc(C.manifesto || "").split(" ").map(function (w) {
    return '<span class="w' + (destaque.test(w) ? " r" : "") + '">' + w + "</span>";
  }).join(" ");
  var palavras = $$(".w", man);

  $("#estrutura-lista").innerHTML = (C.estrutura || []).map(function (e) {
    return '<article class="item"><div class="item-foto"><img src="' + esc(e.foto) + '" alt="' + esc(e.titulo) + ' na UP Gym" loading="lazy"></div>' +
      '<div><svg class="item-seta" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16l8-8 8 8" fill="none" stroke="currentColor" stroke-width="2.6"/></svg>' +
      "<h3>" + marca(e.titulo) + "</h3><p>" + marca(e.texto) + "</p></div></article>";
  }).join("");

  $("#galeria").innerHTML = (C.galeria || []).map(function (f, i) {
    return '<figure><img src="' + esc(f) + '" alt="Foto ' + (i + 1) + ' da estrutura da UP Gym" loading="lazy"></figure>';
  }).join("");

  $("#avaliacoes-lista").innerHTML = (C.avaliacoes || []).map(function (a) {
    return '<figure class="avaliacao"><blockquote>“' + esc(a.texto) + '”</blockquote><figcaption>' + esc(a.nome) + " · avaliação no Google</figcaption></figure>";
  }).join("");

  $("#planos-lista").innerHTML = (C.planos || []).map(function (p) {
    var preco = /EDITAR/.test(p.preco) ? '<small>R$</small><span class="editar">' + esc(p.preco) + "</span>" : "<small>R$</small>" + esc(p.preco);
    return '<article class="plano' + (p.destaque ? " destaque" : "") + '">' + (p.destaque ? '<span class="selo">Mais completo</span>' : "") +
      "<h3>" + esc(p.nome) + '</h3><p class="plano-preco">' + preco + '</p><p class="plano-periodo">' + esc(p.periodo) + "</p>" +
      "<ul>" + (p.itens || []).map(function (i) { return "<li>" + marca(i) + "</li>"; }).join("") + "</ul>" +
      '<a class="botao" target="_blank" rel="noopener" href="https://wa.me/' + String(C.whatsapp).replace(/\D/g, "") + "?text=" +
      encodeURIComponent("Olá! Vim pelo site e quero saber mais sobre o plano " + p.nome + " da UP Gym.") + '">Quero este plano</a></article>';
  }).join("");

  $("#horarios").innerHTML = (C.horarios || []).map(function (h) { return "<dt>" + esc(h.dia) + "</dt><dd>" + marca(h.hora) + "</dd>"; }).join("");
  $("#como-chegar").href = C.linkMaps || "#";
  $("#link-avaliacoes").href = C.linkMaps || "#";
  $("#link-insta").href = "https://www.instagram.com/" + (C.instagram || "") + "/";

  // Dados para o Google (SEO local)
  var ld = {
    "@context": "https://schema.org", "@type": "ExerciseGym", name: "UP Gym",
    description: C.subtitulo, url: location.origin + location.pathname, telephone: "+" + C.whatsapp,
    image: new URL("assets/hero.jpg", location.href).href,
    address: { "@type": "PostalAddress", streetAddress: C.endereco, addressLocality: "Ponta Porã", addressRegion: "MS", postalCode: C.cep, addressCountry: "BR" },
    geo: { "@type": "GeoCoordinates", latitude: -22.5451001, longitude: -55.7270269 },
    sameAs: ["https://www.instagram.com/" + C.instagram + "/"],
    aggregateRating: { "@type": "AggregateRating", ratingValue: String(C.notaGoogle).replace(",", "."), reviewCount: C.totalAvaliacoes, bestRating: "5" }
  };
  var s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(ld); document.head.appendChild(s);

  // Topo muda ao rolar + frase acende
  var topo = $("#topo");
  var tick = false;
  function rolar() {
    topo.classList.toggle("rolou", window.scrollY > 40);
    var r = man.getBoundingClientRect(), vh = window.innerHeight;
    var prog = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
    var n = Math.round(prog * palavras.length);
    palavras.forEach(function (w, i) { w.classList.toggle("on", i < n); });
    tick = false;
  }
  window.addEventListener("scroll", function () { if (!tick) { tick = true; requestAnimationFrame(rolar); } }, { passive: true });
  rolar();

  // Fotos da estrutura se abrem ao aparecer
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("visto"); io.unobserve(e.target); } });
    }, { threshold: 0.25 });
    $$(".item").forEach(function (i) { io.observe(i); });
  } else { $$(".item").forEach(function (i) { i.classList.add("visto"); }); }
})();
