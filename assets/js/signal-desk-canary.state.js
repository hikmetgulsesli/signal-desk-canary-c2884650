(function (global) {
  "use strict";

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function createState(initialState) {
    var state = clone(initialState || {});
    var listeners = [];
    var isBatching = false;
    var pendingNotify = false;

    function notify() {
      var snapshot = clone(state);
      listeners.slice().forEach(function (cb) {
        try {
          cb(snapshot);
        } catch (err) {
          // eslint-disable-next-line no-console
          if (typeof console !== "undefined" && console.error) console.error(err);
        }
      });
    }

    return {
      getState: function () {
        return clone(state);
      },
      setState: function (updater) {
        var next = typeof updater === "function" ? updater(clone(state)) : Object.assign({}, state, updater);
        state = clone(next);
        if (isBatching) {
          pendingNotify = true;
        } else {
          notify();
        }
      },
      subscribe: function (callback) {
        listeners.push(callback);
        return function unsubscribe() {
          listeners = listeners.filter(function (l) { return l !== callback; });
        };
      },
      batch: function (fn) {
        isBatching = true;
        pendingNotify = false;
        try {
          fn();
        } finally {
          isBatching = false;
          if (pendingNotify) notify();
        }
      },
      dispatch: function (action) {
        if (!action || !action.type) return;
        var next = clone(state);
        switch (action.type) {
          case "SET_VIEW":
            next.view = action.view;
            break;
          case "SET_STATUS": {
            var record = (next.signals || []).find(function (s) { return s.id === action.id; });
            if (record) record.status = action.status;
            break;
          }
          case "UPDATE_RECORD": {
            var idx = (next.signals || []).findIndex(function (s) { return s.id === action.id; });
            if (idx >= 0) next.signals[idx] = Object.assign({}, next.signals[idx], action.updates);
            break;
          }
          case "SET_SEARCH":
            next.search = action.value;
            break;
          case "RESET":
            state = clone(action.seed || {});
            notify();
            return;
          default:
            break;
        }
        state = next;
        if (isBatching) {
          pendingNotify = true;
        } else {
          notify();
        }
      },
      reset: function (seed) {
        state = clone(seed || {});
        notify();
      }
    };
  }

  global.SignalDeskState = { createState: createState };
})(window);
