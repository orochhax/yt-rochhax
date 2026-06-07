/* =========================================================================
   BACKEND (Google Apps Script) — recebe o formulário e grava na planilha.
   Opcional: também adiciona o contato no Brevo (lista de e-mail/newsletter).

   COMO USAR (passo a passo no captacao/README.md):
   1. Crie uma Google Sheet. Copie o ID da URL:
      docs.google.com/spreadsheets/d/  ESTE_PEDACO_É_O_ID  /edit
   2. Cole o ID em SHEET_ID abaixo.
   3. (Opcional) Preencha BREVO_API_KEY e BREVO_LIST_ID p/ alimentar a lista.
   4. Implantar > Nova implantação > Tipo: App da Web
         - Executar como: Eu
         - Quem tem acesso: Qualquer pessoa
      Copie a URL gerada e cole em config.js (APPS_SCRIPT_URL).
   ========================================================================= */

// ----- CONFIGURE AQUI -----------------------------------------------------
const SHEET_ID   = "COLE_O_ID_DA_SUA_PLANILHA_AQUI";
const SHEET_NOME = "Leads";   // nome da aba (criada automaticamente se não existir)

// Brevo (opcional). Deixe "" para desligar. Pegue a chave em: Brevo > SMTP & API.
const BREVO_API_KEY = "";
const BREVO_LIST_ID = 0;      // ID numérico da lista no Brevo (0 = desligado)
// --------------------------------------------------------------------------

const CABECALHO = ["Data", "Nome", "E-mail", "WhatsApp", "Produto", "Origem", "Consentimento"];

function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);

    gravarNaPlanilha(dados);

    if (BREVO_API_KEY && BREVO_LIST_ID) {
      adicionarNoBrevo(dados);
    }

    return resposta({ result: "ok" });
  } catch (err) {
    return resposta({ result: "erro", message: String(err) });
  }
}

// Permite testar abrindo a URL no navegador (deve mostrar "online").
function doGet() {
  return resposta({ result: "online" });
}

function gravarNaPlanilha(d) {
  const planilha = SpreadsheetApp.openById(SHEET_ID);
  let aba = planilha.getSheetByName(SHEET_NOME);
  if (!aba) {
    aba = planilha.insertSheet(SHEET_NOME);
  }
  if (aba.getLastRow() === 0) {
    aba.appendRow(CABECALHO);
  }
  aba.appendRow([
    d.data || new Date().toISOString(),
    d.nome || "",
    d.email || "",
    d.whatsapp || "",
    d.produto || "",
    d.origem || "",
    d.consentimento || "",
  ]);
}

function adicionarNoBrevo(d) {
  const payload = {
    email: d.email,
    attributes: { NOME: d.nome, SMS: "+" + d.whatsapp, WHATSAPP: d.whatsapp, ORIGEM: d.origem },
    listIds: [BREVO_LIST_ID],
    updateEnabled: true,
  };
  UrlFetchApp.fetch("https://api.brevo.com/v3/contacts", {
    method: "post",
    contentType: "application/json",
    headers: { "api-key": BREVO_API_KEY, accept: "application/json" },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });
}

function resposta(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
