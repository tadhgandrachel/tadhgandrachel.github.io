/**
 * Wedding guest list + RSVP
 *
 * Sheet tab "Guests" columns (first row = headers):
 *   Token | Name | Plus one allowed | Plus one name | Email | Link
 *   | Attending | Plus one attending | Plus one name (RSVP) | Dietary | Message | Responded at
 *   | Opened at | Last opened | Opens | Last page
 *
 * Setup
 * 1. Put guest names in the Name column. For a +1, set Plus one allowed to Yes.
 *    Optional: fill Plus one name if you already know who they may bring.
 * 2. Set SITE_URL below to your live site (no trailing path).
 * 3. In the Apps Script editor: Run → generateGuestLinks
 *    (or use the Wedding menu after you reload the sheet)
 *    That fills Token and Link for every named row.
 * 4. Deploy → New deployment → Web app
 *    Execute as: Me
 *    Who has access: Anyone
 * 5. Paste the Web App URL into js/config.js → rsvp.googleScriptUrl
 *
 * Send each guest their Link, e.g.
 *   https://tadhgandrachel.github.io/?g=ab3k9m2q
 * They land on the invitation; the token stays with them if they open RSVP.
 *
 * Opening a personal link (or any page after that, while the token is
 * still in the tab) writes Opened at / Last opened / Opens / Last page.
 * That is separate from submitting an RSVP.
 *
 * After the first RSVP the row is locked. Guests see a read-only summary
 * and must email you to change it. To unlock a row, clear Attending
 * and Responded at.
 */

var GUEST_SHEET = "Guests";
var SITE_URL = "https://tadhgandrachel.github.io/";
var NOTIFY_EMAIL = ""; // optional alerts, e.g. "rachel.and.tadhg@example.com"

var HEADERS = [
  "Token",
  "Name",
  "Plus one allowed",
  "Plus one name",
  "Email",
  "Link",
  "Attending",
  "Plus one attending",
  "Plus one name (RSVP)",
  "Dietary",
  "Message",
  "Responded at",
  "Opened at",
  "Last opened",
  "Opens",
  "Last page",
];

function doGet(e) {
  var params = (e && e.parameter) ? e.parameter : {};
  var token = String(params.g || params.token || "").trim();

  if (!token) {
    return respond_(params.callback, { result: "ok", message: "RSVP endpoint is live." });
  }

  var found = findGuest_(token);
  if (!found) {
    return respond_(params.callback, { result: "error", message: "We could not find that invitation." });
  }

  var row = found.row;
  recordOpen_(found, params.page);
  return respond_(params.callback, {
    result: "success",
    name: row.Name || "",
    email: row.Email || "",
    plusOneAllowed: isYes_(row["Plus one allowed"]),
    plusOneName: row["Plus one name"] || "",
    attending: row.Attending || "",
    plusOneAttending: row["Plus one attending"] || "",
    plusOneNameReply: row["Plus one name (RSVP)"] || "",
    diet: row.Dietary || "",
    message: row.Message || "",
    alreadyReplied: hasReplied_(row),
  });
}

function doPost(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var token = String(params.token || params.g || "").trim();
    if (!token) {
      return json_({ result: "error", message: "This RSVP link is missing. Please use the link we sent you." });
    }

    var found = findGuest_(token);
    if (!found) {
      return json_({ result: "error", message: "We could not find that invitation." });
    }

    if (hasReplied_(found.row)) {
      return json_({
        result: "error",
        alreadyReplied: true,
        message: "This RSVP is already in. Please email us if you need to change it.",
      });
    }

    var allowedPlusOne = isYes_(found.row["Plus one allowed"]);
    var plusOneAttending = allowedPlusOne ? (params.plus_one_attending || "") : "";
    var plusOneName = "";
    if (allowedPlusOne && isYes_(plusOneAttending)) {
      plusOneName = params.plus_one_name || found.row["Plus one name"] || "";
    }

    var sheet = found.sheet;
    var cols = found.cols;
    var r = found.rowIndex;

    setCell_(sheet, r, cols, "Attending", params.attending || "");
    setCell_(sheet, r, cols, "Plus one attending", plusOneAttending);
    setCell_(sheet, r, cols, "Plus one name (RSVP)", plusOneName);
    setCell_(sheet, r, cols, "Dietary", params.diet || "");
    setCell_(sheet, r, cols, "Message", params.message || "");
    setCell_(sheet, r, cols, "Responded at", new Date());
    if (params.email) {
      setCell_(sheet, r, cols, "Email", params.email);
    }

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: "Wedding RSVP: " + (found.row.Name || "Guest") + " — " + (params.attending || ""),
        body: [
          "Name: " + (found.row.Name || ""),
          "Attending: " + (params.attending || ""),
          "Plus one attending: " + plusOneAttending,
          "Plus one name: " + plusOneName,
          "Email: " + (params.email || found.row.Email || ""),
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

function generateGuestLinks() {
  var sheet = getGuestSheet_();
  var last = Math.max(sheet.getLastRow(), 1);
  var width = Math.max(sheet.getLastColumn(), HEADERS.length);
  var range = sheet.getRange(1, 1, last, width);
  var data = range.getValues();
  var cols = colMap_(data[0]);
  var used = {};

  for (var i = 1; i < data.length; i++) {
    var name = String(data[i][cols.Name] || "").trim();
    if (!name) continue;

    var token = String(data[i][cols.Token] || "").trim();
    if (!token || used[token]) {
      token = newToken_(used);
      data[i][cols.Token] = token;
    }
    used[token] = true;
    data[i][cols.Link] = SITE_URL.replace(/\/?$/, "/") + "?g=" + token;
  }

  range.setValues(data);
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Wedding")
    .addItem("Generate RSVP links", "generateGuestLinks")
    .addToUi();
}

function getGuestSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(GUEST_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(GUEST_SHEET);
  }

  var first = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  var empty = first.every(function (cell) { return String(cell).trim() === ""; });
  if (empty || String(first[0]).trim() !== "Token") {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
  ensureColumns_(sheet);
  return sheet;
}

function ensureColumns_(sheet) {
  var last = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, last).getValues()[0];
  var have = colMap_(headers);
  HEADERS.forEach(function (name) {
    if (have[name] == null) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(name);
    }
  });
}

function recordOpen_(found, page) {
  try {
    var sheet = found.sheet;
    var cols = colMap_(sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]);
    var r = found.rowIndex;
    var now = new Date();
    if (!found.row["Opened at"]) {
      setCell_(sheet, r, cols, "Opened at", now);
    }
    setCell_(sheet, r, cols, "Last opened", now);
    var opens = Number(found.row.Opens);
    if (isNaN(opens) || opens < 0) opens = 0;
    setCell_(sheet, r, cols, "Opens", opens + 1);
    var safePage = String(page || "").replace(/[^a-z0-9-]/gi, "").slice(0, 24);
    if (safePage) setCell_(sheet, r, cols, "Last page", safePage);
  } catch (err) {}
}

function findGuest_(token) {
  var sheet = getGuestSheet_();
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return null;
  var cols = colMap_(data[0]);
  if (cols.Token == null) return null;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][cols.Token] || "").trim() === token) {
      return {
        sheet: sheet,
        cols: cols,
        rowIndex: i + 1,
        row: rowObject_(data[0], data[i]),
      };
    }
  }
  return null;
}

function colMap_(headerRow) {
  var map = {};
  headerRow.forEach(function (name, i) {
    map[String(name).trim()] = i;
  });
  return map;
}

function rowObject_(headers, values) {
  var row = {};
  headers.forEach(function (name, i) {
    row[String(name).trim()] = values[i];
  });
  return row;
}

function setCell_(sheet, rowIndex, cols, header, value) {
  if (cols[header] == null) return;
  sheet.getRange(rowIndex, cols[header] + 1).setValue(value);
}

function hasReplied_(row) {
  if (row["Responded at"]) return true;
  return String(row.Attending || "").trim() !== "";
}

function isYes_(value) {
  var v = String(value == null ? "" : value).trim().toLowerCase();
  return v === "yes" || v === "y" || v === "true" || v === "1";
}

function newToken_(used) {
  var alphabet = "abcdefghijkmnopqrstuvwxyz23456789";
  var token = "";
  do {
    token = "";
    for (var i = 0; i < 10; i++) {
      token += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
  } while (used[token]);
  return token;
}

function respond_(callback, obj) {
  var body = JSON.stringify(obj);
  if (callback) {
    return ContentService
      .createTextOutput(callback + "(" + body + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return json_(obj);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
