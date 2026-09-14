/**
 * Keep the personal ?g= token across pages.
 * This file is loaded in <head> so the token is saved before anyone can click nav.
 */
(function () {
  var KEY = "weddingGuestToken";

  function readStore(store) {
    try {
      return (store.getItem(KEY) || "").trim();
    } catch (e) {
      return "";
    }
  }

  function writeStore(store, token) {
    try {
      store.setItem(KEY, token);
    } catch (e) {}
  }

  function tokenFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return (params.get("g") || params.get("token") || "").trim();
  }

  function getToken() {
    var fromUrl = tokenFromUrl();
    if (fromUrl) {
      writeStore(window.sessionStorage, fromUrl);
      writeStore(window.localStorage, fromUrl);
      return fromUrl;
    }
    return readStore(window.sessionStorage) || readStore(window.localStorage);
  }

  function isSitePage(href) {
    if (!href) return false;
    var value = href.trim();
    if (value.charAt(0) === "#") return false;
    if (/^(mailto:|tel:|javascript:)/i.test(value)) return false;
    try {
      var url = new URL(value, window.location.href);
      if (url.origin !== window.location.origin) return false;
      var file = url.pathname.split("/").pop() || "";
      if (!file) return true;
      return /^(index|the-day|getting-there|photos|rsvp)\.html$/i.test(file);
    } catch (e) {
      return false;
    }
  }

  function withToken(href, token) {
    var hashAt = href.indexOf("#");
    var hash = hashAt >= 0 ? href.slice(hashAt) : "";
    var base = hashAt >= 0 ? href.slice(0, hashAt) : href;
    var queryAt = base.indexOf("?");
    var path = queryAt >= 0 ? base.slice(0, queryAt) : base;
    var params = new URLSearchParams(queryAt >= 0 ? base.slice(queryAt + 1) : "");
    if (params.get("g") || params.get("token")) return href;
    params.set("g", token);
    return path + "?" + params.toString() + hash;
  }

  function putTokenInUrl(token) {
    var params = new URLSearchParams(window.location.search);
    if (params.get("g") || params.get("token")) return;
    params.set("g", token);
    history.replaceState(null, "", window.location.pathname + "?" + params.toString() + window.location.hash);
  }

  function stampLinks(token) {
    document.querySelectorAll("a[href]").forEach(function (link) {
      var href = link.getAttribute("href");
      if (!isSitePage(href)) return;
      link.setAttribute("href", withToken(href, token));
    });
  }

  var token = getToken();
  if (token) putTokenInUrl(token);

  document.addEventListener(
    "click",
    function (e) {
      var link = e.target.closest ? e.target.closest("a[href]") : null;
      if (!link) return;
      var current = getToken();
      if (!current) return;
      var href = link.getAttribute("href");
      if (!isSitePage(href)) return;
      var next = withToken(href, current);
      if (next !== href) link.setAttribute("href", next);
    },
    true
  );

  function ready() {
    var current = getToken();
    if (current) stampLinks(current);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }

  window.WEDDING_GUEST = {
    token: getToken,
    stamp: function () {
      var current = getToken();
      if (current) stampLinks(current);
    },
  };
})();
