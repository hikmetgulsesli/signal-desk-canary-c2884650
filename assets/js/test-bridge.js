window.__SETFARM_TEST_BRIDGE__ = {
  stack: "static-html",
  ready: true,
  app: function () { return window.app || null; },
  getState: function () { return window.app ? window.app.getState() : null; },
  reset: function () { if (window.app) window.app.reset(); },
  navigate: function (view) { if (window.app) window.app.navigate(view); },
  toggleStatus: function (id) { if (window.app) window.app.toggleStatus(id); }
};
