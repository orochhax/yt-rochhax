<?php
/* =========================================================================
   BACKEND PHP (para Hostinger) — recebe o formulário, grava em CSV e
   (opcional) te envia o lead por e-mail na hora.

   COMO USAR:
   1. Suba a pasta "php-backend" junto com a página no seu domínio Hostinger.
   2. (Opcional) preencha $NOTIFICAR_EMAIL com seu e-mail profissional.
   3. No config.js, coloque:  BACKEND_URL: "php-backend/salvar.php"
   Os leads ficam em php-backend/dados/leads.csv (abra com Excel/Sheets).
   ========================================================================= */

// ===== CONFIGURE (opcional) ================================================
$NOTIFICAR_EMAIL = "";  // ex.: "contato@seudominio.com.br" — recebe cada lead. Vazio = desliga.
$ARQUIVO         = __DIR__ . "/dados/leads.csv";
// ===========================================================================

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") { http_response_code(204); exit; }
if ($_SERVER["REQUEST_METHOD"] !== "POST") { echo json_encode(["result" => "online"]); exit; }

// A página envia JSON (text/plain). Lê o corpo cru e decodifica.
$raw = file_get_contents("php://input");
$d   = json_decode($raw, true);
if (!is_array($d)) { $d = $_POST; }

$nome     = trim($d["nome"] ?? "");
$email    = trim($d["email"] ?? "");
$whatsapp = preg_replace("/\D/", "", $d["whatsapp"] ?? "");
$produto  = trim($d["produto"] ?? "");
$origem   = trim($d["origem"] ?? "");
$consent  = trim($d["consentimento"] ?? "");
$data     = date("Y-m-d H:i:s");

if ($nome === "" || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($whatsapp) < 10) {
  http_response_code(400);
  echo json_encode(["result" => "erro", "message" => "dados invalidos"]);
  exit;
}

// Garante a pasta de dados.
$dir = dirname($ARQUIVO);
if (!is_dir($dir)) { @mkdir($dir, 0755, true); }

// Grava na planilha CSV (com cabeçalho na 1ª vez e trava contra concorrência).
$novo = !file_exists($ARQUIVO);
$fp = fopen($ARQUIVO, "a");
if ($fp) {
  if (flock($fp, LOCK_EX)) {
    if ($novo) {
      fputcsv($fp, ["Data", "Nome", "E-mail", "WhatsApp", "Produto", "Origem", "Consentimento"]);
    }
    fputcsv($fp, [$data, $nome, $email, $whatsapp, $produto, $origem, $consent]);
    flock($fp, LOCK_UN);
  }
  fclose($fp);
}

// (Opcional) te avisa por e-mail na hora — útil pra responder rápido no WhatsApp.
if ($NOTIFICAR_EMAIL !== "") {
  $assunto = "Novo lead: " . $produto;
  $corpo   = "Nome: $nome\nE-mail: $email\nWhatsApp: $whatsapp\nProduto: $produto\nOrigem: $origem\nData: $data";
  $de      = "no-reply@" . ($_SERVER["HTTP_HOST"] ?? "localhost");
  @mail($NOTIFICAR_EMAIL, $assunto, $corpo, "From: $de");
}

echo json_encode(["result" => "ok"]);
