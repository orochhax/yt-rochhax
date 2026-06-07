# 📥 Sistema de Captação de Leads (página → planilha → WhatsApp)

Página gratuita pra capturar **nome + e-mail + WhatsApp** e entregar seu material
(PDF, link, skill) pelo zap. Os dados caem **sozinhos numa planilha** e (opcional)
na sua **lista de e-mail/newsletter** (Brevo).

```
YouTube ──► Landing page ──► Google Sheet (CRM cru)
                │      └────► Brevo (newsletter, opcional)
                ▼
        abre o WhatsApp do lead já com a mensagem pedindo o produto
                ▼
        você manda o material (manual agora → automático depois)
```

## 📂 Arquivos
| Arquivo | O que é |
|---|---|
| `index.html` | A página (formulário) |
| `styles.css` | Visual (cores/marca isoladas no topo, fáceis de trocar) |
| `config.js` | **O único arquivo que você edita** (WhatsApp + URL do backend) |
| `script.js` | Lógica (não precisa mexer) |
| `politica-de-privacidade.html` | Política LGPD (preencha os `[colchetes]`) |
| `php-backend/salvar.php` | **Backend recomendado p/ Hostinger** — grava em CSV + te avisa por e-mail |
| `apps-script/Codigo.gs` | Backend alternativo (Google Sheets), caso não use a Hostinger |

---

## 🚀 Como colocar no ar na HOSTINGER (≈ 15 min)

### Passo 1 — Ativar o domínio grátis
No **hPanel** da Hostinger, resgate seu **domínio grátis** (`seunome.com.br`) e aponte-o
pro seu site. (Sites → criar site → usar o domínio grátis.)

### Passo 2 — Subir os arquivos
1. hPanel → **Gerenciador de Arquivos** → entre na pasta **`public_html`**.
2. Suba o **conteúdo da pasta `captacao`** ali dentro (index.html, styles.css,
   config.js, script.js, politica-de-privacidade.html e a pasta `php-backend`).
3. (Se subir como `.zip`, use "Extrair" no próprio gerenciador.)

### Passo 3 — Configurar (2 campos)
Abra `config.js` (botão direito → Editar, no gerenciador) e preencha:
- `WHATSAPP_NUMBER` → seu número, só dígitos, com 55 + DDD (ex: `5511912345678`)
- `BACKEND_URL` → **`php-backend/salvar.php`**

(Opcional) Em `php-backend/salvar.php`, ponha seu e-mail em `$NOTIFICAR_EMAIL` pra
receber cada lead na hora — ótimo pra responder rápido no WhatsApp.

### Passo 4 — Política de privacidade (LGPD)
Em `politica-de-privacidade.html`, troque os `[colchetes]` pelo seu nome e pelo seu
**e-mail profissional** (crie um `contato@seudominio` no hPanel → E-mails).

### ✅ Teste de ponta a ponta
Abra `https://seudominio/` → preencha o form → confirme que (1) abriu o WhatsApp com a
mensagem e (2) a linha apareceu em `php-backend/dados/leads.csv` (baixe pra conferir).

---

## 🔁 Alternativa: backend no Google Sheets (se um dia não usar a Hostinger)
1. Crie uma planilha em [sheets.new](https://sheets.new) e copie o **ID** da URL.
2. **Extensões → Apps Script**, cole o `apps-script/Codigo.gs`, ponha o ID em `SHEET_ID`.
3. **Implantar → App da Web** (*Executar como:* Eu · *Acesso:* Qualquer pessoa), copie a URL.
4. No `config.js`, ponha essa URL em `BACKEND_URL`.

---

## 🎬 Um link por vídeo (rastreamento)
Use a mesma página pra todos os vídeos, mudando só a URL na **descrição do vídeo**:

```
https://seu-site.netlify.app/?v=7-claude-skills&p=Pack%20de%207%20Claude%20Skills
```
- `v=` → slug do vídeo (vai pra coluna **Origem** da planilha → você sabe de onde veio o lead)
- `p=` → nome do produto (aparece no título da página e na mensagem do WhatsApp)

> `%20` é o espaço. Assim você mede, por vídeo, quantos viraram lead — e joga isso
> no [`resultados/metricas.md`](../resultados/metricas.md).

---

## 💬 Entrega no WhatsApp: manual agora, automático depois
**Agora (manual, leva segundos):**
- No **WhatsApp Business**, crie **Respostas rápidas** (atalhos) com o link de cada
  material. Quando o lead chega, você responde em 1 toque.
- Use **Etiquetas** ("recebeu pack skills") pra organizar quem já recebeu.

**Depois (automático), sem mexer na página:**
- Ligue a **API do WhatsApp + ManyChat** (ou as automações do Brevo) pra enviar o
  material sozinho quando a palavra-chave chegar. A página continua igual.

---

## ✉️ Newsletter — use o E-mail Marketing da Hostinger (já incluso 1 ano)
Você não precisa do Brevo: seu plano já tem **e-mail marketing grátis por 1 ano**.
Fluxo simples no começo:
1. Baixe o `php-backend/dados/leads.csv` (ou exporte da planilha).
2. No painel de **E-mail Marketing** da Hostinger, **importe os contatos** (CSV).
3. Mande sua newsletter de lá, usando o **e-mail profissional** (`contato@seudominio`).

> Faça essa importação uma vez por semana no início. Quando o volume crescer, dá pra
> automatizar (me chama que eu configuro o envio direto do `salvar.php`).
> **Alternativa Brevo:** se preferir, há suporte pronto no `apps-script/Codigo.gs`
> (campos `BREVO_API_KEY` e `BREVO_LIST_ID`).

---

## ✅ Checklist rápido
- [ ] Domínio grátis ativado na Hostinger
- [ ] Arquivos no `public_html` (incluindo a pasta `php-backend`)
- [ ] `WHATSAPP_NUMBER` e `BACKEND_URL` preenchidos no `config.js`
- [ ] (Opcional) `$NOTIFICAR_EMAIL` no `salvar.php` + e-mail `contato@seudominio` criado
- [ ] Política de privacidade preenchida
- [ ] Teste de ponta a ponta (form → `leads.csv` → abriu o zap)
- [ ] E-mail marketing da Hostinger: 1ª importação do CSV
