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
  var waAula = "https://wa.me/" + String(C.whatsapp || "").replace(/\D/g, "") + "?text=" + encodeURIComponent(C.mensagemAula || C.mensagemWhatsapp || "");
  $$("[data-wa]").forEach(function (a) { a.href = a.getAttribute("data-wa") === "aula" ? waAula : wa; a.target = "_blank"; a.rel = "noopener"; });
  $$("[data-c]").forEach(function (el) { var v = C[el.getAttribute("data-c")]; if (v != null) el.innerHTML = fmt(v); });

  $("#titulo").innerHTML = linhas(C.titulo);
  $("#chamada-final").innerHTML = linhas(C.chamadaFinal);
  $("#manifesto-texto").innerHTML = fmt(C.manifesto);
  // status em tempo real (hora de Ponta Porã): aberto agora / quando abre
  var statusAgora = function () {
    var M = C.movimento, el = $("#hero-horario"); if (!M || !el) return;
    var ch = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"], nomes = { dom: "domingo", seg: "segunda", ter: "terça", qua: "quarta", qui: "quinta", sex: "sexta", sab: "sábado" }, p = {};
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Campo_Grande", weekday: "short", hour: "numeric", hourCycle: "h23" }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    var dia = ch[["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday)], h = parseInt(p.hour, 10) % 24, d = M[dia], fecha = d.abre + d.valores.length;
    var hh = function (n) { return String(n).padStart(2, "0") + "h"; };
    if (h >= d.abre && h < fecha) { el.classList.remove("fechado"); el.textContent = "Aberto agora · fecha às " + hh(fecha); }
    else { var k = h >= fecha ? ch[(ch.indexOf(dia) + 1) % 7] : dia; el.classList.add("fechado"); el.textContent = "Fechado agora · abre " + (k === dia ? "hoje" : (k === ch[(ch.indexOf(dia) + 1) % 7] ? "amanhã" : nomes[k])) + " às " + hh(M[k].abre); }
  };
  statusAgora(); setInterval(statusAgora, 60000);

  // botão fixo "Aula grátis": aparece depois que o topo sai da tela (no topo já tem o botão principal)
  var waFixo = $(".wa-flutuante"), outrosVisiveis = 0;
  var olhaWa = function () {
    if (!waFixo) return;
    var mostra = window.scrollY > window.innerHeight * 0.85 && outrosVisiveis === 0;
    waFixo.classList.toggle("visivel", mostra);
    if (mostra) waFixo.removeAttribute("tabindex"); else waFixo.setAttribute("tabindex", "-1");
  };
  if ("IntersectionObserver" in window) {
    var vistos = new Set();
    var ioBot = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) vistos.add(e.target); else vistos.delete(e.target); }); outrosVisiveis = vistos.size; olhaWa(); });
    $$(".botao[data-wa]").forEach(function (b) { ioBot.observe(b); });
  }
  window.addEventListener("scroll", olhaWa, { passive: true }); olhaWa();

  // topo: vira vidro ao rolar, se adapta ao que passa por baixo e some ao descer (funciona sem GSAP)
  var topo = $("#topo"), ultimoY = 0, olhaTopo = function () {
    var y = window.scrollY;
    topo.classList.toggle("solido", y > 60);
    var baixo = document.elementsFromPoint(window.innerWidth / 2, 34).find(function (e) { return e.tagName === "SECTION" || e.tagName === "FOOTER"; });
    topo.classList.toggle("sobre-claro", !!(baixo && baixo.classList.contains("claro")));
    topo.classList.toggle("some", y > window.innerHeight * 0.8 && y > ultimoY);
    ultimoY = y;
  };
  window.addEventListener("scroll", olhaTopo, { passive: true }); olhaTopo();

  // primeira vez: passos e dúvidas
  if ($("#passos")) $("#passos").innerHTML = (C.passos || []).map(function (p) { return "<li><h3>" + fmt(p.titulo) + "</h3><p>" + fmt(p.texto) + "</p></li>"; }).join("");
  if ($("#duvidas")) $("#duvidas").innerHTML = (C.duvidas || []).map(function (d) { return "<details><summary>" + esc(d.pergunta) + "</summary><p>" + esc(d.resposta) + "</p></details>"; }).join("");


  $("#numeros").innerHTML = [
    [C.notaGoogle, "Nota no Google"], [C.totalAvaliacoes, "Avaliações"], [C.seguidores, "Seguidores no Instagram"], ["7", "Dias por semana"]
  ].map(function (n) {
    var v = String(n[0]), rot = n[1];
    if (/ mil$/i.test(v)) { v = v.replace(/ mil$/i, ""); rot = "Mil " + rot.toLowerCase(); } // "13,3 mil" fica 13,3 grande e "mil" na legenda
    return '<div class="numero"><strong data-num="' + esc(v) + '">' + esc(v) + '</strong><span class="mono">' + esc(rot) + "</span></div>"; }).join("");

  $("#trilho").insertAdjacentHTML("beforeend", (C.estrutura || []).map(function (e, i) {
    return '<article class="painel"><div class="painel-foto"><img src="' + esc(e.foto) + '" alt="' + esc(limpo(e.titulo)) + ' na UP Gym" loading="lazy"><span class="painel-num mono">' +
      String(i + 1).padStart(2, "0") + " / " + String(C.estrutura.length).padStart(2, "0") + "</span></div><h3>" + fmt(e.titulo) + "</h3><p>" + fmt(e.texto) + "</p></article>";
  }).join(""));

  $("#galeria").innerHTML = (C.galeria || []).map(function (f, i) {
    return '<figure><img src="' + esc(f) + '" alt="Foto ' + (i + 1) + ' da UP Gym por dentro" loading="lazy"></figure>';
  }).join("");

  // avaliações reais do Google em duas faixas que correm em sentidos opostos
  var AV = window.AVALIACOES || [];
  if (AV.length && $("#faixas")) {
    var cartao = function (a) {
      return '<figure class="cartao"><span class="cartao-estrelas" aria-label="' + a.estrelas + ' estrelas">' + "★★★★★".slice(0, a.estrelas) + '</span><blockquote>“' + esc(a.texto) + '”</blockquote><figcaption class="mono"><span>' + esc(a.nome) + "</span><span>" + a.ano + "</span></figcaption></figure>";
    };
    var linhasAv = [[], []];
    AV.forEach(function (a, i) { linhasAv[i % 2].push(a); });
    $("#faixas").innerHTML = linhasAv.map(function (l, i) {
      var html = l.map(cartao).join("");
      return '<div class="faixa' + (i ? " volta" : "") + '" style="--dur:' + Math.round(l.length * 7.5) + 's">' + html + '<div style="display:contents" aria-hidden="true">' + html + "</div></div>";
    }).join("");
  }

  // personais: fileira que corre da direita para a esquerda (sentido da leitura)
  var PS = C.personais || [];
  var personalReal = PS.some(function (p) { return p.whatsapp; });
  if (!personalReal && !/[?&]modelo\b/.test(location.search)) {
    // exemplo não vai ao público: aparece só no link da proposta (...?modelo) ou quando o dono cadastrar os dados
    var secP = $("#personais"); if (secP) secP.remove();
    $$('a[href="#personais"]').forEach(function (l) { l.remove(); });
    PS = [];
  }
  if (PS.length && $("#faixa-personais")) {
    var icoWa = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.23 8.23 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z"/></svg>';
    var silhueta = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.2-8 5v3h16v-3c0-2.8-3.6-5-8-5Z"/></svg>';
    var cartaoP = function (p) {
      var num = String(p.whatsapp || "").replace(/\D/g, "") || String(C.whatsapp || "").replace(/\D/g, "");
      var msg = p.whatsapp ? "Olá, " + p.nome + "! Vim pelo site da UP Gym e quero saber sobre treino com você." : "Olá! Vim pelo site e quero treinar com " + p.nome + " na UP Gym.";
      return '<figure class="personal"><div class="personal-foto">' + (p.foto ? '<img src="' + esc(p.foto) + '" alt="' + esc(p.nome) + ', personal da UP Gym" loading="lazy">' : silhueta) +
        '<span class="personal-tag mono">' + esc(p.especialidade) + '</span></div><figcaption class="personal-info"><h3>' + esc(p.nome) + '</h3><p class="mono">Contato ' + esc(p.contato) + '</p>' +
        '<a class="personal-wa" href="https://wa.me/' + num + "?text=" + encodeURIComponent(msg) + '" target="_blank" rel="noopener">Chamar no WhatsApp' + icoWa + "</a></figcaption></figure>";
    };
    var lista = PS.concat(PS.length < 6 ? PS : []), htmlP = lista.map(cartaoP).join("");
    $("#faixa-personais").innerHTML = '<div class="faixa personais-trilho" style="--dur:' + Math.round(lista.length * 7) + 's">' + htmlP + '<div style="display:contents" aria-hidden="true">' + htmlP.replace(/<a /g, '<a tabindex="-1" ') + "</div></div>";
  }

  // gráfico das notas: quantas pessoas deram 5, 4, 3, 2 e 1 estrela
  var EST = window.AVALIACOES_ESTRELAS;
  if (EST && $("#notas")) {
    var total = 0; [5, 4, 3, 2, 1].forEach(function (n) { total += EST[n] || 0; });
    $("#notas-barras").innerHTML = [5, 4, 3, 2, 1].map(function (n, i) {
      return '<div class="nota-linha" style="--i:' + i + ";--p:" + ((EST[n] || 0) / total).toFixed(3) + '"><span>' + n + ' ★</span><span class="nota-trilho"><i></i></span><span data-conta="' + (EST[n] || 0) + '">0</span></div>';
    }).join("");
    $("#notas-barras").setAttribute("aria-label", [5, 4, 3, 2, 1].map(function (n) { return (EST[n] || 0) + " pessoas deram " + n + " estrela" + (n > 1 ? "s" : ""); }).join(", "));
    var comTexto = window.AVALIACOES_COM_COMENTARIO || 0;
    $("#notas-resumo").innerHTML = '<div><strong>' + comTexto + '</strong><span class="mono">Com comentário</span></div><div><strong>' + (total - comTexto) + '</strong><span class="mono">Sem comentário</span></div>';
    var contar = function () {
      $("#notas").classList.add("visivel");
      $$("[data-conta]").forEach(function (el, i) {
        var alvo = +el.getAttribute("data-conta"), t0 = null, dur = 1400, atraso = i * 90;
        var passo = function (t) { if (t0 === null) t0 = t; var p = Math.min(Math.max((t - t0 - atraso) / dur, 0), 1); el.textContent = Math.round(alvo * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(passo); };
        requestAnimationFrame(passo);
      });
    };
    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var ion = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { contar(); ion.disconnect(); } }, { threshold: 0.4 });
      ion.observe($("#notas"));
    } else contar();
  }

  $("#horarios").innerHTML = (C.horarios || []).map(function (h) { return "<dt>" + esc(h.dia) + "</dt><dd>" + fmt(h.hora) + "</dd>"; }).join("");
  $("#como-chegar").href = C.linkMaps || "#";
  $("#link-avaliacoes").href = C.linkMaps || "#";
  $("#link-insta").href = "https://www.instagram.com/" + (C.instagram || "") + "/";

  /* ---------- melhores horários (média do Google, hora de Ponta Porã) ---------- */
  (function () {
    var M = C.movimento; if (!M || !$("#grafico")) return;
    var chaves = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
    var curto = { dom: "Dom", seg: "Seg", ter: "Ter", qua: "Qua", qui: "Qui", sex: "Sex", sab: "Sáb" };
    var longo = { dom: "domingo", seg: "segunda", ter: "terça", qua: "quarta", qui: "quinta", sex: "sexta", sab: "sábado" };
    var hh = function (h) { return String(h).padStart(2, "0") + "h"; };
    var nivel = function (v) { return v < 30 ? "tranquilo" : v < 55 ? "movimento moderado" : v < 80 ? "movimentado" : "cheio"; };
    var agoraPP = function () { // hora oficial de Ponta Porã (Campo Grande)
      var p = {};
      new Intl.DateTimeFormat("en-US", { timeZone: "America/Campo_Grande", weekday: "short", hour: "numeric", hourCycle: "h23" })
        .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      return { dia: chaves[["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday)], hora: parseInt(p.hour, 10) % 24 };
    };
    var janela = function (d, melhor) { // 3 horas seguidas mais vazias (ou mais cheias)
      var v = d.valores, alvo = null;
      for (var i = 0; i + 3 <= v.length; i++) {
        if (v[i] == null || v[i + 1] == null || v[i + 2] == null) continue;
        var soma = v[i] + v[i + 1] + v[i + 2];
        if (alvo === null || (melhor ? soma < alvo.soma : soma > alvo.soma)) alvo = { soma: soma, i: i };
      }
      return alvo ? hh(d.abre + alvo.i) + " às " + hh(d.abre + alvo.i + 3) : "sem dado";
    };
    var visto = false, sel = agoraPP().dia;
    $("#link-aovivo").href = C.linkMaps || "#";

    $("#dias").innerHTML = chaves.slice(1).concat("dom").map(function (k) {
      return '<button type="button" role="tab" data-dia="' + k + '" aria-label="' + longo[k] + '">' + curto[k] + "</button>";
    }).join("");
    $$("#dias button").forEach(function (b) { b.addEventListener("click", function () { sel = b.getAttribute("data-dia"); desenha(); }); });

    function desenha() {
      var d = M[sel], a = agoraPP();
      $$("#dias button").forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-dia") === sel ? "true" : "false"); });
      $("#grafico").innerHTML = d.valores.map(function (v, i) {
        var h = d.abre + i, agora = sel === a.dia && h === a.hora;
        var txt = agora ? "Agora" : hh(h) + " · " + (v == null ? "sem dado" : nivel(v));
        return '<div class="barra' + (v == null ? " vazia" : "") + (agora ? " agora" : "") + '" style="--h:0" data-h="' + (v || 0) / 100 + '"><i></i><b>' + txt + "</b></div>";
      }).join("");
      $("#grafico").setAttribute("aria-label", "Movimento de " + longo[sel] + ": mais tranquilo " + janela(d, true) + ", mais cheio " + janela(d, false) + ".");
      $("#grafico-horas").innerHTML = d.valores.map(function (v, i) { return "<span>" + (i % 3 === 0 ? hh(d.abre + i) : "") + "</span>"; }).join("");
      $("#movimento-resumo").innerHTML = '<div><strong>' + janela(d, true) + '</strong><span class="mono">Mais tranquilo</span></div><div><strong>' + janela(d, false) + '</strong><span class="mono">Mais cheio</span></div>';
      if (visto) requestAnimationFrame(function () { requestAnimationFrame(mostrar); });
    }

    function agoraTexto() {
      var a = agoraPP(), d = M[a.dia], el = $("#movimento-agora"), i = a.hora - d.abre;
      var aberto = i >= 0 && i < d.valores.length;
      el.classList.toggle("fechado", !aberto);
      if (aberto) {
        var v = d.valores[i];
        el.textContent = "Agora, " + longo[a.dia] + " " + hh(a.hora) + " · " + (v == null ? "aberto" : "normalmente " + nivel(v));
      } else {
        var k = a.hora >= d.abre ? chaves[(chaves.indexOf(a.dia) + 1) % 7] : a.dia; // fechado: próxima abertura
        el.textContent = "Fechado agora · abre " + (k === a.dia ? "hoje" : (k === chaves[(chaves.indexOf(a.dia) + 1) % 7] ? "amanhã" : longo[k])) + " às " + hh(M[k].abre);
      }
    }

    desenha(); agoraTexto();
    var horaVista = agoraPP().hora;
    setInterval(function () { agoraTexto(); var h = agoraPP().hora; if (h !== horaVista) { horaVista = h; desenha(); } }, 60000);
    function mostrar() { visto = true; $$("#grafico .barra").forEach(function (b) { b.style.setProperty("--h", b.getAttribute("data-h")); }); }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { mostrar(); io.disconnect(); } }, { threshold: 0.3 });
      io.observe($("#grafico"));
    } else mostrar();
  })();

  // vídeo certo para cada tela (vertical no celular, deitado no PC)
  var video = $("#hero-video");
  var semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!semMovimento) video.src = window.matchMedia("(max-width: 767px)").matches ? "assets/hero-celular.mp4" : "assets/hero.mp4";
  var tocar = video.play && video.play(); if (tocar && tocar.catch) tocar.catch(function () {});

  // SEO local
  var ld = {
    "@context": "https://schema.org", "@type": "ExerciseGym", name: "UP Gym",
    description: limpo(C.subtitulo), url: location.origin + location.pathname, telephone: "+" + C.whatsapp,
    image: new URL("assets/hero.jpg", location.href).href, logo: new URL("assets/logo-vermelha.svg", location.href).href,
    address: { "@type": "PostalAddress", streetAddress: C.endereco, addressLocality: "Ponta Porã", addressRegion: "MS", postalCode: C.cep, addressCountry: "BR" },
    geo: { "@type": "GeoCoordinates", latitude: -22.5451001, longitude: -55.7270269 },
    sameAs: ["https://www.instagram.com/" + C.instagram + "/"]
  };
  var s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(ld); document.head.appendChild(s);

  /* ---------- movimento ---------- */
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var g = window.gsap, ST = window.ScrollTrigger;
  var loader = $("#loader");
  if (reduz || !g || !ST || !loader) { loader && loader.remove(); doc.classList.remove("carregando"); return; }
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

  // 1) abertura (método motionmaxxing): a seta SOBE e o impacto dela traz o resto.
  //    Tudo chega freando (nada cresce do zero, quase nada em fade), mostra um brilho e sai acelerando para cima.
  var LG = "#loader-logo", ORIGEM = "342 338";
  g.set("#lg-seta", { y: 900, scaleY: 2.6, transformOrigin: "50% 100%", filter: "blur(6px)" });
  g.set("#lg-moldura", { scale: 1.9, svgOrigin: ORIGEM, opacity: 0, filter: "blur(12px)" });
  g.set("#lg-u", { x: -110, opacity: 0 });
  g.set("#lg-p", { x: 140, opacity: 0 });
  g.set("#lg-gym > path", { y: 110 });
  g.set("#lg-traco", { scaleX: 0, transformOrigin: "50% 50%", y: 0 });
  g.set("#lg-faixa path", { y: 70 });
  g.set(LG, { visibility: "visible" });
  var intro = g.timeline();
  intro
    // a seta dispara de baixo, esticada pela velocidade, e trava no lugar
    .to("#lg-seta", { y: 0, duration: 0.62, ease: "expo.out" }, 0.1)
    .to("#lg-seta", { scaleY: 1, filter: "blur(0px)", duration: 0.5, ease: "expo.out" }, 0.22)
    // o impacto traz o losango: chega grande e desfocado e assenta
    .set("#lg-moldura", { opacity: 1 }, 0.42)
    .to("#lg-moldura", { scale: 1, filter: "blur(0px)", duration: 0.85, ease: "expo.out" }, 0.42)
    // U e P encaixam dos lados
    .set(["#lg-u", "#lg-p"], { opacity: 1 }, 0.52)
    .to("#lg-u", { x: 0, duration: 0.55, ease: "expo.out" }, 0.52)
    .to("#lg-p", { x: 0, duration: 0.6, ease: "expo.out" }, 0.58)
    // GYM sobe de trás da máscara, o traço corre do centro
    .to("#lg-gym > path:not(#lg-traco)", { y: 0, duration: 0.6, ease: "expo.out", stagger: 0.1 }, 0.85)
    .to("#lg-traco", { scaleX: 1, duration: 0.5, ease: "expo.out" }, 1.1)
    // ESPAÇO FITNESS sobe letra por letra, do centro para fora
    .to("#lg-faixa path", { y: 0, duration: 0.5, ease: "expo.out", stagger: { each: 0.033, from: "center" } }, 1.15)
    // momento-assinatura: um brilho passa pela logo enquanto ela respira
    .to(LG, { scale: 0.965, duration: 1.4, ease: "none" }, 1.2)
    .set("#lg-brilho", { opacity: 0.95 }, 1.5)
    .fromTo("#lg-brilho", { x: 0 }, { x: 980, duration: 0.85, ease: "power2.inOut" }, 1.5)
    .to(LG, { attr: { fill: "#F5F3EF" }, duration: 0.6, ease: "power1.out" }, 1.75)
    // saída: a logo sobe acelerando junto com a cortina
    .to(LG, { y: -140, scale: 0.9, filter: "blur(3px)", duration: 0.55, ease: "power3.in" }, 2.5)
    .to(loader, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" }, 2.6)
    .add(function () { loader.remove(); doc.classList.remove("carregando"); lenis && lenis.start(); })
    .from(video, { scale: 1.25, duration: 2.2, ease: "expo.out" }, "-=0.9")
    .from("#titulo .in", { yPercent: 110, duration: 1.3, stagger: 0.09 }, "-=1.9")
    .from(".hero-topo > *, .hero-sub, .hero .botao, .hero-base > *", { y: 24, opacity: 0, duration: 1, stagger: 0.06 }, "-=1.1");

  // 4) títulos entram linha por linha (depois das fontes, para não cortar a linha errada)
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
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
  ST.refresh();
  });

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
  g.fromTo(".final-foto", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".final", start: "top bottom", end: "bottom top", scrub: true } });

  window.addEventListener("load", function () { ST.refresh(); });
})();
