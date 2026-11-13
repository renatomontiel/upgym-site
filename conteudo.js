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

  // MENSAGEM DOS BOTÕES "AULA GRÁTIS" (já chega pronta para agendar)
  mensagemAula: "Olá! Vim pelo site e quero agendar minha aula experimental grátis na UP Gym. Qual o melhor horário?",

  // TELEFONE como aparece escrito no site
  telefoneTexto: "(67) 99917-5820",

  // INSTAGRAM — só o nome, sem @
  instagram: "upgym_academia",

  // ENDEREÇO
  endereco: "Rua 13 de Setembro, 2282",
  bairro: "Centro, Ponta Porã · MS",
  cep: "79904-704",   // Correios (ViaCEP) e Google: Rua 13 de Setembro. O 714 do Instagram é a Rua Paraguai.

  // LINK DO GOOGLE MAPS (botão "Como chegar")
  linkMaps: "https://www.google.com/maps/search/?api=1&query=Up+Gym+Rua+13+de+Setembro+2282+Ponta+Por%C3%A3",


  /* ---------- PRIMEIRA TELA (com o vídeo) ----------
     Fonte: bio do Instagram @upgym_academia ("A academia mais completa da fronteira!"
     e "Venha fazer uma aula experimental gratuita!"), conferida em 12/11/2026. */

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




  /* ---------- FRASE DE IMPACTO ---------- */
  manifesto: "Cansou do mesmo treino, dos mesmos aparelhos e do calor? Aqui a estrutura joga a seu favor: equipamento novo, ambiente climatizado e gente pronta pra te ver *subir*.",


  /* ---------- ESTRUTURA (cada bloco: foto, título e texto) ---------- */
  // Para trocar a foto, suba na pasta assets um arquivo com o MESMO nome.
  estrutura: [
    {
      foto: "assets/foto5.jpg",
      titulo: "Aparelhos Real Leader",
      texto: "Como a extensora unilateral."
    },
    {
      foto: "assets/foto3.jpg",
      titulo: "Esteiras conectadas",
      texto: "Tela touch, Bluetooth, carregador por indução e inclinação automática."
    },
    {
      foto: "assets/foto4.jpg",
      titulo: "Peso livre",
      texto: "Racks, barras e anilhas pra quem leva o treino de força a sério."
    },
    {
      foto: "assets/foto2.jpg",
      titulo: "Climatizado",
      texto: "Espaço amplo, limpo e fresco, do primeiro horário da manhã até a noite."
    },
    {
      foto: "assets/foto8.jpg",
      titulo: "Ginástica e dança",
      texto: "Aulas pra quem gosta de treinar em grupo."
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


  /* ---------- AVALIAÇÕES ----------
     As avaliações que correm no site ficam no arquivo avaliacoes.js
     (todas reais, copiadas do Google Maps). */


  /* ---------- PERSONAIS ----------
     Exemplo para o dono preencher. Para cada personal:
     nome, especialidade, contato (como aparece escrito),
     whatsapp (só números, com 55 + DDD) e foto (ex.: "assets/personal-joao.jpg").
     Foto do rosto olhando para a câmera vende mais.
     Só publique quem autorizou aparecer no site. */
  personais: [
    { nome: "Personal 1", especialidade: "Hipertrofia", contato: "(67) 9XXXX-XXXX", whatsapp: "", foto: "" },
    { nome: "Personal 2", especialidade: "Condicionamento", contato: "(67) 9XXXX-XXXX", whatsapp: "", foto: "" },
    { nome: "Personal 3", especialidade: "Treino feminino", contato: "(67) 9XXXX-XXXX", whatsapp: "", foto: "" },
    { nome: "Personal 4", especialidade: "Iniciantes", contato: "(67) 9XXXX-XXXX", whatsapp: "", foto: "" },
    { nome: "Personal 5", especialidade: "Força e performance", contato: "(67) 9XXXX-XXXX", whatsapp: "", foto: "" },
    { nome: "Personal 6", especialidade: "Terceira idade", contato: "(67) 9XXXX-XXXX", whatsapp: "", foto: "" }
  ],


  /* ---------- PRIMEIRA VEZ (acolhimento) ----------
     Os 3 passos da aula grátis. [CONFIRMAR com o dono como é de fato a aula.] */
  passos: [
    { titulo: "Chama no WhatsApp", texto: "Escolhe o dia e o horário que cabem na sua rotina." },
    { titulo: "Vem conhecer", texto: "A academia e os aparelhos, de perto." },
    { titulo: "Primeiro treino", texto: "Do seu jeito, no seu ritmo." }
  ],

  /* ---------- DÚVIDAS RÁPIDAS ----------
     Só respostas verdadeiras (estacionamento, ducha e café vêm das avaliações do Google). */
  duvidas: [
    { pergunta: "Nunca treinei. Posso?", resposta: "Pode. A aula grátis é pra isso." },
    { pergunta: "Tem estacionamento?", resposta: "Tem, e amplo." },
    { pergunta: "Tem ducha e café?", resposta: "Tem ducha e cafezinho quente." },
    { pergunta: "Qual o horário?", resposta: "Segunda a sexta, das 05h às 22h. Sábado, das 08h às 18h. Domingo, das 09h às 13h." },
    { pergunta: "Quanto custa?", resposta: "Os planos e a diária a gente passa no WhatsApp, na hora e sem compromisso." }
  ],


  /* ---------- HORÁRIOS ---------- */
  horarios: [
    { dia: "Segunda a sexta", hora: "05h às 22h" },
    { dia: "Sábado", hora: "08h às 18h" },
    { dia: "Domingo", hora: "09h às 13h" }
  ],


  /* ---------- MOVIMENTO (gráfico "Melhores horários") ----------
     Números do Google Maps: quanto a academia costuma encher em cada
     hora (100 = hora mais cheia da semana). null = Google sem dado.
     Lidos em 12/11/2026. Para atualizar, copie de novo do Google Maps. */
  movimentoFonte: "Média do Google Maps",
  movimento: {
    seg: { abre: 5, valores: [24, 32, 31, 28, 31, 34, 36, 41, 45, 56, 70, 83, 97, 100, 83, 59, 35] },
    ter: { abre: 5, valores: [25, 31, 29, 25, 29, 37, 43, 43, 49, 56, 71, 79, 93, 94, 83, 60, 33] },
    qua: { abre: 5, valores: [25, 36, 39, 35, 38, 44, 43, 40, 38, 45, 55, 72, 90, 98, 88, 64, 39] },
    qui: { abre: 5, valores: [20, 30, 33, 31, 33, 40, 43, 44, 44, 47, 54, 66, 81, 85, 76, 57, null] },
    sex: { abre: 5, valores: [16, 24, 28, 28, 30, 32, 33, 35, 36, 42, 53, 64, 75, 78, 74, 63, 44] },
    sab: { abre: 8, valores: [12, 19, 22, 24, 22, 27, 35, 42, 40, 32] },
    dom: { abre: 9, valores: [18, 23, 22, 16] }
  },


  /* ---------- CHAMADA FINAL ---------- */
  chamadaFinal: ["Sua primeira aula", "é por *nossa conta.*"],
  chamadaFinalTexto: "Chama no WhatsApp, escolhe o horário e vem sentir a UP Gym de perto."
};
