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
