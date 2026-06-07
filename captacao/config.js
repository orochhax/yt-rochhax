/* =========================================================================
   CONFIG — O ÚNICO ARQUIVO QUE VOCÊ PRECISA EDITAR
   -------------------------------------------------------------------------
   Preencha os 2 campos abaixo e a página já funciona.
   (O resto do projeto não precisa ser tocado.)
   ========================================================================= */

const CONFIG = {

  // 1) SEU WHATSAPP — só números, com 55 (Brasil) + DDD. Sem espaços/traços.
  //    Ex.: (11) 91234-5678  ->  "5511912345678"
  WHATSAPP_NUMBER: "5573999024324",   // 73 99902-4324 (com 55 do Brasil)

  // 2) BACKEND que grava os leads. Duas opções (detalhes no README):
  //    • Hostinger/PHP (recomendado p/ você):  "php-backend/salvar.php"
  //    • Google Sheets:  cole a URL do Apps Script
  //    Enquanto estiver "COLE_AQUI...", a página ainda funciona e leva pro
  //    WhatsApp — só não grava o lead.
  BACKEND_URL: "COLE_AQUI_A_URL_DO_BACKEND",

  // ---- Padrões (usados quando o link do vídeo não especifica) -------------
  // Cada vídeo pode sobrescrever isso pela URL:  ?v=slug-do-video&p=Nome%20do%20Produto
  PRODUTO_PADRAO: "Pack de 7 Claude Skills",
  ORIGEM_PADRAO:  "geral",

  // ---- Mensagem que abre pronta no WhatsApp do lead -----------------------
  // (ele só aperta enviar; o nome ajuda você a saber quem é e qual produto mandar)
  MENSAGEM_WHATS: (nome, produto) =>
    `Olá! Quero receber o *${produto}* que vi no YouTube. ✋\nMeu nome é ${nome}.`,

};
