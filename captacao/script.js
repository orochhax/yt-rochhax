/* =========================================================================
   LÓGICA DA PÁGINA — não precisa editar (tudo configurável em config.js)
   ========================================================================= */

(function () {
  "use strict";

  // ---- Lê parâmetros da URL: ?v=slug-do-video&p=Nome%20do%20Produto -------
  const params  = new URLSearchParams(window.location.search);
  const origem  = (params.get("v") || CONFIG.ORIGEM_PADRAO).trim();
  const produto = (params.get("p") || CONFIG.PRODUTO_PADRAO).trim();

  // ---- Atualiza textos da página com o produto certo ----------------------
  document.getElementById("nome-produto").textContent = produto;
  document.title = `Receba: ${produto}`;

  const form    = document.getElementById("lead-form");
  const erroBox = document.getElementById("erro");
  const botao   = document.getElementById("btn-enviar");

  // ---- Helpers ------------------------------------------------------------
  const soDigitos = (s) => (s || "").replace(/\D/g, "");
  const emailOk   = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

  function montarLinkZap(nome) {
    const numero = soDigitos(CONFIG.WHATSAPP_NUMBER);
    const texto  = encodeURIComponent(CONFIG.MENSAGEM_WHATS(nome, produto));
    return `https://wa.me/${numero}?text=${texto}`;
  }

  function mostrarSucesso(linkZap) {
    document.getElementById("form-view").style.display = "none";
    const sucesso = document.getElementById("sucesso-view");
    sucesso.classList.add("ativo");
    document.getElementById("btn-zap").setAttribute("href", linkZap);
    // tenta abrir o WhatsApp automaticamente
    window.location.href = linkZap;
  }

  // ---- Envio --------------------------------------------------------------
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    erroBox.textContent = "";

    const nome     = document.getElementById("nome").value.trim();
    const email    = document.getElementById("email").value.trim();
    const whatsapp = soDigitos(document.getElementById("whatsapp").value);
    const aceitou  = document.getElementById("consentimento").checked;

    // Validações
    if (nome.length < 2)       return (erroBox.textContent = "Digite seu nome.");
    if (!emailOk(email))       return (erroBox.textContent = "Digite um e-mail válido.");
    if (whatsapp.length < 10)  return (erroBox.textContent = "Digite um WhatsApp válido com DDD.");
    if (!aceitou)              return (erroBox.textContent = "É preciso aceitar para receber o material.");

    botao.disabled = true;
    botao.textContent = "Enviando...";

    const linkZap = montarLinkZap(nome);

    const payload = {
      data: new Date().toISOString(),
      nome: nome,
      email: email,
      whatsapp: whatsapp,
      produto: produto,
      origem: origem,
      consentimento: "sim",
    };

    // Se o backend ainda não foi configurado, pula a gravação e vai pro zap.
    const semBackend =
      !CONFIG.BACKEND_URL || CONFIG.BACKEND_URL.indexOf("COLE_AQUI") !== -1;

    if (semBackend) {
      mostrarSucesso(linkZap);
      return;
    }

    // Grava na planilha (e na lista, se configurado) e segue pro WhatsApp.
    // mode:'no-cors' evita dor de cabeça com CORS do Apps Script.
    fetch(CONFIG.BACKEND_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    })
      .then(function () { mostrarSucesso(linkZap); })
      .catch(function () { mostrarSucesso(linkZap); }); // mesmo se falhar, leva pro zap
  });

})();
