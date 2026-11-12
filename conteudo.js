/* =====================================================================
   CONTEÚDO DO SITE DA UP GYM
   ---------------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa mexer para trocar textos,
   horários e contatos.

   Regras simples:
   - Troque só o que está ENTRE ASPAS "assim".
   - Não apague as vírgulas do fim das linhas nem as chaves { } [ ].
   - Onde estiver escrito [EDITAR], é informação que ainda falta.
   - Palavra entre *asteriscos* ganha o detalhe vermelho no site.
   - Depois de salvar no GitHub, o site atualiza sozinho em 1 ou 2 minutos.
   ===================================================================== */

window.CONTEUDO = {

  /* ---------- CONTATOS ---------- */

  // WHATSAPP — só números, com 55 + DDD (ex.: 5567999175820)
  whatsapp: "5567999175820",

  // MENSAGEM QUE JÁ VEM ESCRITA quando a pessoa clica no WhatsApp
  mensagemWhatsapp: "Olá! Vim pelo site e quero saber mais sobre a UP Gym.",

  // TELEFONE como aparece escrito no site
  telefoneTexto: "(67) 99917-5820",

  // INSTAGRAM — só o nome, sem @
  instagram: "upgym_academia",

  // ENDEREÇO
  endereco: "Rua 13 de Setembro, 2282",
  bairro: "Centro, Ponta Porã · MS",
  cep: "79904-714",

  // LINK DO GOOGLE MAPS (botão "Como chegar")
  linkMaps: "https://www.google.com/maps/search/?api=1&query=Up+Gym+Rua+13+de+Setembro+2282+Ponta+Por%C3%A3",


  /* ---------- PRIMEIRA TELA (com o vídeo) ---------- */

  // TÍTULO GRANDE — cada linha entre aspas é uma linha no site
  titulo: ["Suba de", "*nível.*"],

  // FRASE EMBAIXO DO TÍTULO
  subtitulo: "A academia mais completa da fronteira. Musculação, ginástica e dança no Centro de Ponta Porã.",

  // TEXTO DO BOTÃO PRINCIPAL
  botaoPrincipal: "Agendar aula grátis",


  /* ---------- NÚMEROS (troque quando mudarem) ---------- */
  notaGoogle: "4,8",
  totalAvaliacoes: "200",
  seguidores: "13,3 mil",
  abre: "05h",




  /* ---------- FRASE DE IMPACTO ---------- */
  manifesto: "Cansou do mesmo treino, dos mesmos aparelhos e do calor? Aqui a estrutura joga a seu favor: equipamento novo, ambiente climatizado e gente pronta pra te puxar pra *cima*.",


  /* ---------- ESTRUTURA (cada bloco: foto, título e texto) ---------- */
  // Para trocar a foto, suba na pasta assets um arquivo com o MESMO nome.
  estrutura: [
    {
      foto: "assets/foto5.jpg",
      titulo: "Real Leader",
      texto: "Extensora unilateral, remada, leg press e simulador de escada. Aparelho novo, que encaixa no seu corpo e no seu nível."
    },
    {
      foto: "assets/foto3.jpg",
      titulo: "Esteiras conectadas",
      texto: "Tela touch com YouTube, Bluetooth, carregador por indução, inclinação automática e programas de treino prontos."
    },
    {
      foto: "assets/foto4.jpg",
      titulo: "Peso livre",
      texto: "Racks, barras e anilhas para quem leva o treino de força a sério."
    },
    {
      foto: "assets/foto2.jpg",
      titulo: "Climatizado",
      texto: "Espaço amplo, limpo e fresco, do primeiro horário da manhã até a noite."
    },
    {
      foto: "assets/foto8.jpg",
      titulo: "Ginástica e dança",
      texto: "Aulas para quem gosta de treinar em grupo, com instrutor por perto o tempo todo."
    }
  ],


  /* ---------- GALERIA DE FOTOS ---------- */
  galeria: [
    "assets/foto6.jpg",
    "assets/foto11.jpg",
    "assets/foto7.jpg",
    "assets/foto9.jpg",
    "assets/foto12.jpg",
    "assets/foto10.jpg"
  ],


  /* ---------- AVALIAÇÕES (só avaliações REAIS do Google) ---------- */
  avaliacoes: [
    {
      nome: "evelizevaliente valiente",
      texto: "Está entre as top 5 do MS, tudo é excelente, aparelhagem, atendimento, limpeza, bom demais."
    },
    {
      nome: "Leandro Nunes",
      texto: "Bons equipamentos, modernos, boa estrutura, valor da diária para não alunos ok."
    },
    {
      nome: "Ozymandias",
      texto: "Treino todos os dias, local limpo e sempre com novidades."
    }
  ],


  /* ---------- HORÁRIOS ---------- */
  horarios: [
    { dia: "Segunda a sexta", hora: "05h às 22h" },
    { dia: "Sábado", hora: "[EDITAR]" },
    { dia: "Domingo e feriados", hora: "[EDITAR]" }
  ],


  /* ---------- CHAMADA FINAL ---------- */
  chamadaFinal: ["Sua primeira aula", "é por *nossa conta.*"],
  chamadaFinalTexto: "Chama no WhatsApp, escolhe o horário e vem sentir a UP Gym de perto."
};
