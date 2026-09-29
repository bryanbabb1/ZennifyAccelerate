/**
 * DEPLOYED COPY (reference) — the live script is bound to the CMS Sheet
 * (Extensions ▸ Apps Script). Web app deployment ID:
 * AKfycbx94-duJ4Vs5ml28lqGz4dzqKPSczA6VLo79EqqwIHEC0PmRlSQyJOPmB84pGaWHLUU
 * Deployed 2026-09-29. To change it: edit in the Apps Script editor, then
 * Deploy ▸ Manage deployments ▸ Edit (pencil) ▸ Version: New version ▸ Deploy
 * (never "New deployment" — that changes the URL the site is built against).
 * Keep this file in sync with what is deployed.
 */

/**
 * Zennify Accelerate — AI Ecosystem CMS
 * Read-only JSON web app. Deploy: Execute as ME (owner), Who has access: ANYONE.
 * Returns ONLY rows where "Visible Externally" != "No", so the Sheet stays private.
 *
 * Performance: the JSON payload is cached in CacheService for 5 minutes. The site also
 * hydrates from the visitor's last-known copy, so a cache miss is never felt on load.
 * The short TTL means edits made through the Sheets API (which do NOT fire onEdit)
 * go live within 5 minutes; hand edits in the Sheet clear the cache immediately via
 * the onEdit trigger (see installEditTrigger).
 *
 * Bump CACHE_KEY whenever you need to discard a cached payload immediately.
 */
var CACHE_KEY = 'ecosystem_json_v3';
var CACHE_SECONDS = 300; // 5 minutes

function doGet() {
  var cache = CacheService.getScriptCache();
  var hit = cache.get(CACHE_KEY);
  if (hit) {
    return ContentService.createTextOutput(hit).setMimeType(ContentService.MimeType.JSON);
  }
  var payload = buildJson_();
  try { cache.put(CACHE_KEY, payload, CACHE_SECONDS); } catch (e) { /* >100KB: skip cache */ }
  return ContentService.createTextOutput(payload).setMimeType(ContentService.MimeType.JSON);
}

function buildJson_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return '[]';

  var header = values[0].map(function (h) { return String(h).trim(); });
  var col = {};
  header.forEach(function (h, i) { col[h] = i; });

  function get(row, name) {
    return col.hasOwnProperty(name) ? String(row[col[name]] == null ? '' : row[col[name]]).trim() : '';
  }
  function splitList(s) {
    return String(s || '').split(/\r?\n|\|/).map(function (x) { return x.trim(); }).filter(function (x) { return x.length; });
  }
  function splitStages(s) {
    return String(s || '').split(',').map(function (x) { return x.trim().toLowerCase(); }).filter(function (x) { return x.length; });
  }

  var out = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    if (!get(row, 'Name')) continue;
    if (get(row, 'Visible Externally').toLowerCase() === 'no') continue;
    out.push({
      name:     get(row, 'Name'),
      kind:     get(row, 'Type'),
      maturity: get(row, 'Maturity'),
      stages:   splitStages(get(row, 'Lifecycle Stages')),
      desc:     get(row, 'External Description'),
      value:    get(row, 'Value Statement'),
      useCases: splitList(get(row, 'Use Cases')),
      benefit:  get(row, 'Primary Benefit'),
      built:    get(row, 'Platform'),
      metric:   get(row, 'Metric'),
      before:   get(row, 'Before'),
      after:    get(row, 'After'),
      headline: get(row, 'Headline'),
      basis:    get(row, 'Basis'),
      link:     get(row, 'Link')
    });
  }
  return JSON.stringify(out);
}

/** Clears the cache whenever the sheet is edited, so changes appear on the next load. */
function onEditClearCache_() {
  CacheService.getScriptCache().remove(CACHE_KEY);
}

/**
 * Run this ONCE from the Apps Script editor (Run ▸ installEditTrigger) to wire up
 * the onEdit trigger. After that, sheet edits invalidate the cache automatically.
 */
function installEditTrigger() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'onEditClearCache_') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('onEditClearCache_').forSpreadsheet(ss).onEdit().create();
}
