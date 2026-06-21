(function (global) {
  "use strict";

  var STORAGE_KEY = "signal-desk-canary:state";

  function save(state) {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch (err) {
      // Storage may be disabled or full; fail silently.
    }
  }

  function load() {
    try {
      if (typeof localStorage !== "undefined") {
        var raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      }
    } catch (err) {
      // Malformed or inaccessible storage.
    }
    return null;
  }

  function clear() {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      // Ignore.
    }
  }

  global.SignalDeskStorage = {
    KEY: STORAGE_KEY,
    save: save,
    load: load,
    clear: clear
  };
})(window);
