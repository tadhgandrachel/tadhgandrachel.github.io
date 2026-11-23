const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const template = fs.readFileSync(path.join(__dirname, "Invitation.html"), "utf8");
assert.equal(template, fs.readFileSync(path.join(__dirname, "../email/invitation.html"), "utf8"));
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, "Code.gs"), "utf8"), context);
const headers = Array.from(context.HEADERS);
let rows;
let writes;
let released;
let selectedRow = 2;
let selectedSheetId = 2043717927;
let previewShown = false;
const sheet = {
  getSheetId: () => 2043717927,
  getLastColumn: () => rows[0].length,
  getDataRange: () => ({ getValues: () => rows.map(row => row.slice()) }),
  getRange(row, column, height = 1, width = 1) {
    return {
      getValues: () => Array.from({ length: height }, (_, y) =>
        Array.from({ length: width }, (_, x) => rows[row - 1 + y]?.[column - 1 + x] ?? "")),
      setValue(value) {
        writes.push([row, column, value]);
        rows[row - 1][column - 1] = value;
      },
      setWrapStrategy() {},
    };
  },
};
context.SpreadsheetApp = {
  WrapStrategy: { CLIP: "CLIP" },
  flush() {},
  getActiveSpreadsheet: () => ({
    getSheetById: id => id === 2043717927 ? sheet : null,
    getActiveRange: () => ({
      getRow: () => selectedRow,
      getNumRows: () => 1,
      getSheet: () => ({ getSheetId: () => selectedSheetId }),
    }),
  }),
  getUi: () => ({ showModalDialog: () => { previewShown = true; } }),
};
context.LockService = {
  getScriptLock: () => ({ waitLock() {}, releaseLock() { released = true; } }),
};
context.HtmlService = {
  createHtmlOutputFromFile: () => ({ getContent: () => template }),
  createTemplateFromFile: () => ({
    evaluate() {
      assert.ok(this.emailBody.includes(rows[selectedRow - 1][headers.indexOf("Link")]));
      return { setWidth() { return this; }, setHeight() { return this; } };
    },
  }),
};
function reset() {
  writes = [];
  released = false;
  const makeRow = (name, token) => {
    const row = headers.map(() => "");
    row[headers.indexOf("Name")] = name;
    row[headers.indexOf("Token")] = token;
    row[headers.indexOf("Attending")] = "Yes";
    row[headers.indexOf("Responded at")] = "2026-11-01";
    return row;
  };
  rows = [
    headers.slice(),
    makeRow("Existing household", "existing-token"),
    makeRow("New household", ""),
    makeRow("", "reserved-token"),
  ];
  rows[0].push("Custom formula");
  rows.slice(1).forEach(row => row.push("=1+1"));
}
reset();
const original = structuredClone(rows);
context.generateGuestLinks();
assert.equal(rows[1][0], "existing-token");
assert.ok(rows[2][0]);
assert.notEqual(rows[2][0], "reserved-token");
assert.deepEqual(rows[3], original[3]);
for (let row = 1; row <= 2; row++) {
  assert.equal(rows[row][headers.indexOf("Attending")], "Yes");
  assert.equal(rows[row][headers.indexOf("Responded at")], "2026-11-01");
  assert.equal(rows[row].at(-1), "=1+1");
  const link = rows[row][headers.indexOf("Link")];
  const html = rows[row][headers.indexOf("Email HTML")];
  assert.ok(html.includes('href="' + link + '"'));
  assert.ok(!html.includes("{{INVITATION_URL}}"));
  assert.ok(!html.includes("THEIR_TOKEN"));
  assert.ok(html.length < 50000);
}
assert.ok(writes.every(([, column]) =>
  ["Token", "Link", "Email subject", "Email HTML"].includes(rows[0][column - 1])));
const firstPass = structuredClone(rows);
context.generateGuestLinks();
assert.deepEqual(rows, firstPass);
assert.ok(released);
context.previewGuestEmail();
assert.ok(previewShown);
selectedSheetId = 123;
assert.throws(() => context.previewGuestEmail(), /Select one guest row/);
selectedSheetId = 2043717927;
selectedRow = 4;
assert.throws(() => context.previewGuestEmail(), /named guest/);
reset();
rows[2][0] = rows[1][0];
assert.throws(() => context.generateGuestLinks(), /Duplicate invitation token/);
assert.equal(writes.length, 0);
assert.ok(released);
reset();
rows[0][1] = "Wrong header";
assert.throws(() => context.generateGuestLinks(), /Name header/);
assert.equal(writes.length, 0);
reset();
rows = rows.map(row => row.filter((_, i) => i < 16 || i >= 18));
context.generateGuestLinks();
assert.ok(rows[0].includes("Email HTML"));
assert.equal(rows[1][16], "=1+1");
assert.match(context.invitationLink_('a"&b'), /a%22%26b$/);
assert.equal(context.invitationHtml_('{{INVITATION_URL}}', 'https://example.com/?a=1&b="x"'),
  "https://example.com/?a=1&amp;b=&quot;x&quot;");
console.log("Invitation tests passed: stable tokens, private links, HTML, safe writes, reruns, duplicates, appended columns and preview selection.");
