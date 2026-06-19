# Customer Info Collection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone `Customer Info.html` page that collects Name/Phone/Email and writes each submission as a row in a Google Sheet via a Google Apps Script Web App.

**Architecture:** Static HTML/CSS/JS page (no build step, matches the rest of the repo) posts form data with `fetch` to an Apps Script Web App URL; the script appends a row to a bound Google Sheet. No automated test runner exists in this repo, so verification is manual (browser + Apps Script execution log) instead of unit tests.

**Tech Stack:** Plain HTML/CSS/JS (no frameworks, consistent with `Links.html`), Google Apps Script, Google Sheets.

## Global Constraints
- Page must be fully standalone: no links added to/from `Links.html` or any other page in the repo (per spec).
- Fields are Name, Phone, Email — all required.
- Visual style must match existing pages: dark background (`#080808`), Inter font, gold accent (`#c8a84b`), same button/input visual language as `Links.html`.
- No backend server — Apps Script Web App is the only server-side piece, and it's deployed manually by the user, not by this plan's automation.
- Sheet columns, in order: `Timestamp`, `Name`, `Phone`, `Email`.

---

### Task 1: Google Apps Script code + deployment doc

**Files:**
- Create: `docs/apps-script/customer-info-collector.gs`
- Create: `docs/apps-script/DEPLOY.md`

**Interfaces:**
- Produces: a `doPost(e)` function that reads `e.parameter.name`, `e.parameter.phone`, `e.parameter.email` and appends `[new Date(), name, phone, email]` to the active sheet. Returns a JSON response `{"status":"ok"}` on success, `{"status":"error","message":"..."}` (HTTP-200 body, since Apps Script Web Apps can't set arbitrary error status codes for simple triggers) on failure. The HTML page (Task 2) parses `status` from the JSON body to decide success/error.

- [ ] **Step 1: Write the Apps Script file**

Create `docs/apps-script/customer-info-collector.gs`:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var name = (e.parameter.name || '').toString().trim();
    var phone = (e.parameter.phone || '').toString().trim();
    var email = (e.parameter.email || '').toString().trim();

    if (!name || !phone || !email) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: 'error', message: 'Missing required field' })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    sheet.appendRow([new Date(), name, phone, email]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: 'ok' })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

- [ ] **Step 2: Write the deployment doc**

Create `docs/apps-script/DEPLOY.md`:

```markdown
# Deploying the Customer Info Collector

1. Go to https://sheets.google.com and create a new blank spreadsheet.
2. Rename Sheet1's header row (row 1) to: `Timestamp | Name | Phone | Email`.
3. In the sheet, go to **Extensions > Apps Script**.
4. Delete any placeholder code in `Code.gs` and paste in the contents of
   `customer-info-collector.gs` from this folder.
5. Click **Deploy > New deployment**.
6. Click the gear icon next to "Select type" and choose **Web app**.
7. Set:
   - Description: `Customer info collector`
   - Execute as: **Me**
   - Who has access: **Anyone**
8. Click **Deploy**, authorize the script when prompted (click through the
   "unsafe" warning — it's your own script).
9. Copy the **Web app URL** shown after deployment — it looks like
   `https://script.google.com/macros/s/XXXXXXXX/exec`.
10. Paste that URL into `Customer Info.html` as the value of the
    `FORM_ENDPOINT` constant near the top of the `<script>` block.
11. Test by submitting the form once and confirming a new row appears in
    the sheet.

If you ever need to update the script, edit it in the Apps Script editor,
then **Deploy > Manage deployments > Edit (pencil icon) > New version >
Deploy** — editing the code alone does not update the live Web app URL.
```

- [ ] **Step 3: Commit**

```bash
git add "docs/apps-script/customer-info-collector.gs" "docs/apps-script/DEPLOY.md"
git commit -m "docs: add Apps Script source and deploy guide for customer info collector"
```

---

### Task 2: `Customer Info.html` page

**Files:**
- Create: `Customer Info.html`

**Interfaces:**
- Consumes: `FORM_ENDPOINT` constant (a placeholder string the user fills in per Task 1's `DEPLOY.md` step 10) and the JSON contract from Task 1 (`{status:"ok"}` or `{status:"error",message:string}`).
- Produces: nothing consumed elsewhere — this page is standalone per the Global Constraints.

- [ ] **Step 1: Create the page with form, styles, and submit logic**

Create `Customer Info.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Customer Info — Tedd Grooming</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    min-height: 100vh;
    background: #080808;
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 52px 20px 70px;
  }

  .brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 32px;
    text-align: center;
  }

  .brand-title {
    font-size: 20px;
    font-weight: 900;
    letter-spacing: 3px;
    text-transform: uppercase;
    background: linear-gradient(135deg, #fff 0%, #c8a84b 50%, #fff 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .brand-sub {
    font-size: 12px;
    font-weight: 600;
    color: #888;
    letter-spacing: 2px;
    margin-top: 8px;
    text-transform: uppercase;
  }

  form {
    width: 100%;
    max-width: 380px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #c8a84b;
    opacity: 0.8;
  }

  input {
    width: 100%;
    padding: 13px 14px;
    margin-top: 6px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.03);
    color: #eee;
    font-size: 14px;
    font-family: inherit;
  }

  input:focus {
    outline: none;
    border-color: rgba(200,168,75,0.5);
  }

  button {
    margin-top: 10px;
    padding: 14px;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg, #c8a84b, #e0c270);
    color: #1a1a1a;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
  }

  button:disabled { opacity: 0.6; cursor: not-allowed; }

  .message {
    margin-top: 16px;
    font-size: 13px;
    text-align: center;
    min-height: 18px;
  }

  .message.success { color: #4fd07a; }
  .message.error { color: #e06464; }
</style>
</head>
<body>

  <div class="brand">
    <div class="brand-title">Tedd Grooming</div>
    <div class="brand-sub">Customer Info</div>
  </div>

  <form id="customerForm">
    <div>
      <label for="name">Name</label>
      <input type="text" id="name" name="name" required>
    </div>
    <div>
      <label for="phone">Phone</label>
      <input type="tel" id="phone" name="phone" required>
    </div>
    <div>
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required>
    </div>
    <button type="submit" id="submitBtn">Submit</button>
    <div class="message" id="formMessage"></div>
  </form>

  <script>
    // Replace with the Apps Script Web App URL from docs/apps-script/DEPLOY.md
    const FORM_ENDPOINT = 'PASTE_APPS_SCRIPT_WEB_APP_URL_HERE';

    const form = document.getElementById('customerForm');
    const submitBtn = document.getElementById('submitBtn');
    const messageEl = document.getElementById('formMessage');

    function setMessage(text, type) {
      messageEl.textContent = text;
      messageEl.className = 'message' + (type ? ' ' + type : '');
    }

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function isValidPhone(value) {
      return /^[0-9+\-\s()]{6,}$/.test(value);
    }

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      setMessage('', null);

      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();

      if (!name) {
        setMessage('Please enter your name.', 'error');
        return;
      }
      if (!isValidPhone(phone)) {
        setMessage('Please enter a valid phone number.', 'error');
        return;
      }
      if (!isValidEmail(email)) {
        setMessage('Please enter a valid email address.', 'error');
        return;
      }

      submitBtn.disabled = true;
      setMessage('Submitting...', null);

      try {
        const body = new URLSearchParams({ name, phone, email });
        const response = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          body: body,
        });
        const data = await response.json();

        if (data.status === 'ok') {
          setMessage('Thanks! Your info has been received.', 'success');
          form.reset();
        } else {
          setMessage(data.message || 'Something went wrong. Please try again.', 'error');
        }
      } catch (err) {
        setMessage('Network error. Please check your connection and try again.', 'error');
      } finally {
        submitBtn.disabled = false;
      }
    });
  </script>

</body>
</html>
```

- [ ] **Step 2: Manually verify client-side validation (no Apps Script needed yet)**

Open `Customer Info.html` directly in a browser (double-click the file, or
`start "Customer Info.html"` on Windows). Confirm:
- Submitting with an empty Name field shows "Please enter your name." and does not call `fetch` (check the Network tab in devtools — no request fires).
- Submitting with phone `abc` shows "Please enter a valid phone number."
- Submitting with email `notanemail` shows "Please enter a valid email address."
- Submitting with valid values attempts a network request (visible in devtools Network tab) and, since `FORM_ENDPOINT` is still the placeholder string, shows a network/error message (because the placeholder URL is not a real endpoint) — this confirms the error path renders correctly. Expected message: "Network error. Please check your connection and try again."

- [ ] **Step 3: Commit**

```bash
git add "Customer Info.html"
git commit -m "feat: add standalone Customer Info collection page"
```

---

### Task 3: End-to-end verification against a live Apps Script deployment

**Files:**
- Modify: `Customer Info.html` (only the `FORM_ENDPOINT` constant value)

**Interfaces:**
- Consumes: the real Web App URL obtained by following `docs/apps-script/DEPLOY.md` (Task 1).

- [ ] **Step 1: Deploy the Apps Script and get the live URL**

Follow `docs/apps-script/DEPLOY.md` steps 1–9 in your own Google account to create the Sheet, paste in the script, and deploy it as a Web App. Copy the resulting `https://script.google.com/macros/s/.../exec` URL.

- [ ] **Step 2: Wire the real endpoint into the page**

In `Customer Info.html`, replace:
```javascript
const FORM_ENDPOINT = 'PASTE_APPS_SCRIPT_WEB_APP_URL_HERE';
```
with the real URL, e.g.:
```javascript
const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycb.../exec';
```

- [ ] **Step 3: Verify a real submission end-to-end**

Open `Customer Info.html` in a browser, submit valid Name/Phone/Email values.
Expected:
- The form shows "Thanks! Your info has been received." and clears.
- Within a few seconds, a new row appears in the Google Sheet with columns `Timestamp, Name, Phone, Email` matching what was submitted.

If the row doesn't appear, open the Apps Script editor's **Executions** log (left sidebar) to see the `doPost` invocation and any thrown error, then fix the script or deployment settings accordingly.

- [ ] **Step 4: Verify the error path against the live endpoint**

Temporarily change one Sheet header or break nothing — instead, test the
"missing field" branch directly: in the browser devtools console on the
page, run:
```javascript
fetch(FORM_ENDPOINT, { method: 'POST', body: new URLSearchParams({ name: '', phone: '', email: '' }) }).then(r => r.json()).then(console.log)
```
Expected output: `{status: "error", message: "Missing required field"}` — confirms the server-side validation branch works, independent of the client-side validation already covered in Task 2.

- [ ] **Step 5: Commit**

```bash
git add "Customer Info.html"
git commit -m "feat: wire Customer Info page to live Apps Script endpoint"
```
