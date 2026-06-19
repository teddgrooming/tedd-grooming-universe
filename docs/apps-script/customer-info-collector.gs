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
