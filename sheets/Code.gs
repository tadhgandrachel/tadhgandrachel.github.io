/**
 * Wedding RSVP → Google Sheet
 *
 * 1. Open the Google Sheet that should collect RSVPs
 * 2. Extensions → Apps Script
 * 3. Delete any placeholder code and paste this file
 * 4. Optional: put your email in NOTIFY_EMAIL to get a message on each RSVP
 * 5. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web App URL into js/config.js → rsvp.googleScriptUrl
 *
 * Column headers are created automatically the first time someone RSVPs.
 */

var SHEET_NAME = "RSVPs";
var NOTIFY_EMAIL = ""; // e.g. "rachel.and.tadhg@example.com"

function doPost(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var sheet = getSheet_();

    sheet.appendRow([
      new Date(),
      params.name || "",
      params.email || "",
      params.attending || "",
      params.guests || "",
      params.diet || "",
      params.message || "",
    ]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: "Wedding RSVP: " + (params.name || "Guest") + " — " + (params.attending || ""),
        body: [
          "Name: " + (params.name || ""),
          "Email: " + (params.email || ""),
          "Attending: " + (params.attending || ""),
          "Guests: " + (params.guests || ""),
          "Dietary: " + (params.diet || ""),
          "Message: " + (params.message || ""),
        ].join("\n"),
      });
    }

    return json_({ result: "success" });
  } catch (err) {
    return json_({ result: "error", message: String(err) });
  }
}

function doGet() {
  return ContentService.createTextOutput("RSVP endpoint is live.");
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Name",
      "Email",
      "Attending",
      "Guests",
      "Dietary",
      "Message",
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
