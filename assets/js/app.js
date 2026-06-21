(function () {
  "use strict";

  var seedEl = document.getElementById("seed-data");
  var seed = seedEl ? JSON.parse(seedEl.textContent) : { signals: [], activities: [], preferences: {} };

  var saved = window.SignalDeskStorage.load();
  var initial = saved && saved.signals ? saved : Object.assign({}, seed, { view: "dashboard", search: "" });
  if (!initial.view) initial.view = "dashboard";
  if (typeof initial.search !== "string") initial.search = "";

  var store = window.SignalDeskState.createState(initial);

  function persist(state) {
    window.SignalDeskStorage.save(state);
  }

  store.subscribe(function (state) {
    persist(state);
    render(state);
  });

  var STATUS_LABELS = { ok: "OK", warn: "Warning", down: "Down" };
  var STATUS_NEXT = { ok: "warn", warn: "down", down: "ok" };

  function statusLabel(status) {
    return STATUS_LABELS[status] || status;
  }

  function nextStatus(status) {
    return STATUS_NEXT[status] || "ok";
  }

  function statusClass(status) {
    return "status-" + (status || "ok");
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[c];
    });
  }

  function filteredSignals(signals, search) {
    var q = (search || "").toLowerCase();
    if (!q) return signals || [];
    return (signals || []).filter(function (s) {
      return (s.name || "").toLowerCase().indexOf(q) !== -1 ||
             (s.description || "").toLowerCase().indexOf(q) !== -1;
    });
  }

  function render(state) {
    var content = document.getElementById("app-content");
    if (!content) return;

    document.querySelectorAll("[data-nav]").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.nav === state.view);
    });

    switch (state.view) {
      case "operations":
        renderOperations(content, state);
        break;
      case "editor":
        renderEditor(content, state);
        break;
      case "insights":
        renderInsights(content, state);
        break;
      default:
        renderDashboard(content, state);
        break;
    }
  }

  function renderDashboard(el, state) {
    var counts = (state.signals || []).reduce(function (acc, s) {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    }, {});

    el.innerHTML =
      '<h2>Dashboard</h2>' +
      '<div class="metric-grid">' +
        '<div class="metric"><span class="metric-value">' + (counts.ok || 0) + '</span><span class="metric-label">OK</span></div>' +
        '<div class="metric"><span class="metric-value">' + (counts.warn || 0) + '</span><span class="metric-label">Warning</span></div>' +
        '<div class="metric"><span class="metric-value">' + (counts.down || 0) + '</span><span class="metric-label">Down</span></div>' +
        '<div class="metric"><span class="metric-value">' + (state.signals || []).length + '</span><span class="metric-label">Total</span></div>' +
      '</div>' +
      '<h3>Recent Activity</h3>' +
      '<ul class="activity-list">' + (state.activities || []).map(function (a) {
        return '<li><code>' + escapeHtml(a.timestamp) + '</code> ' + escapeHtml(a.message) + '</li>';
      }).join("") + '</ul>';
  }

  function renderOperations(el, state) {
    var signals = filteredSignals(state.signals || [], state.search);
    el.innerHTML =
      '<h2>Record Operations</h2>' +
      '<div class="toolbar">' +
        '<input type="text" class="search-input" placeholder="Search records..." aria-label="Search records" value="' + escapeHtml(state.search || "") + '" oninput="app.handleSearch(this.value)" />' +
        '<button type="button" data-action-id="create-record" onclick="app.createRecord()">Create Record</button>' +
        '<button type="button" data-action-id="retry-load" onclick="app.retryLoad()">Retry Load</button>' +
      '</div>' +
      '<table class="data-table">' +
        '<thead><tr><th>ID</th><th>Name</th><th>Status</th><th>Description</th><th>Actions</th></tr></thead>' +
        '<tbody>' + signals.map(function (s) {
          return '<tr>' +
            '<td><code>' + escapeHtml(s.id) + '</code></td>' +
            '<td>' + escapeHtml(s.name) + '</td>' +
            '<td><span class="status-chip ' + statusClass(s.status) + '">' + statusLabel(s.status) + '</span></td>' +
            '<td>' + escapeHtml(s.description || "") + '</td>' +
            '<td>' +
              '<button type="button" data-toggle-status="' + escapeHtml(s.id) + '" onclick="app.toggleStatus(\'' + escapeHtml(s.id) + '\')">Toggle</button>' +
              '<button type="button" data-action-id="select-record" data-record-id="' + escapeHtml(s.id) + '" onclick="app.selectRecord(\'' + escapeHtml(s.id) + '\')">Edit</button>' +
            '</td>' +
          '</tr>';
        }).join("") + '</tbody>' +
      '</table>';
  }

  function renderEditor(el, state) {
    var id = state.editingId || (state.signals[0] && state.signals[0].id);
    var rec = (state.signals || []).find(function (s) { return s.id === id; }) || state.signals[0] || { id: "", name: "", status: "ok", description: "" };
    el.innerHTML =
      '<h2>Record Editor</h2>' +
      '<form onsubmit="app.saveRecord(event)">' +
        '<label>ID <input type="text" value="' + escapeHtml(rec.id) + '" disabled /></label>' +
        '<label>Name <input type="text" name="name" value="' + escapeHtml(rec.name) + '" required /></label>' +
        '<label>Status ' +
          '<select name="status">' +
            '<option value="ok" ' + (rec.status === "ok" ? "selected" : "") + '>OK</option>' +
            '<option value="warn" ' + (rec.status === "warn" ? "selected" : "") + '>Warning</option>' +
            '<option value="down" ' + (rec.status === "down" ? "selected" : "") + '>Down</option>' +
          '</select>' +
        '</label>' +
        '<label>Description <textarea name="description">' + escapeHtml(rec.description || "") + '</textarea></label>' +
        '<div class="form-actions">' +
          '<button type="submit" data-action-id="save-record">Save Record</button>' +
          '<button type="button" data-action-id="cancel-edit" onclick="app.cancelEdit()">Cancel</button>' +
        '</div>' +
      '</form>';
  }

  function renderInsights(el, state) {
    var counts = (state.signals || []).reduce(function (acc, s) {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    }, {});
    var latest = (state.activities || []).slice(0, 5);
    el.innerHTML =
      '<h2>Insights</h2>' +
      '<div class="metric-grid">' +
        '<div class="metric"><span class="metric-value">' + (counts.ok || 0) + '</span><span class="metric-label">OK</span></div>' +
        '<div class="metric"><span class="metric-value">' + (counts.warn || 0) + '</span><span class="metric-label">Warning</span></div>' +
        '<div class="metric"><span class="metric-value">' + (counts.down || 0) + '</span><span class="metric-label">Down</span></div>' +
      '</div>' +
      '<h3>Status Distribution</h3>' +
      '<div class="distribution">' +
        '<div class="dist-bar status-ok" style="flex:' + (counts.ok || 0) + '"></div>' +
        '<div class="dist-bar status-warn" style="flex:' + (counts.warn || 0) + '"></div>' +
        '<div class="dist-bar status-down" style="flex:' + (counts.down || 0) + '"></div>' +
      '</div>' +
      '<h3>Recent Activity</h3>' +
      '<ul class="activity-list">' + latest.map(function (a) {
        return '<li><code>' + escapeHtml(a.timestamp) + '</code> ' + escapeHtml(a.message) + '</li>';
      }).join("") + '</ul>' +
      '<div class="toolbar">' +
        '<button type="button" data-action-id="filter-insights" onclick="app.filterInsights()">Filter</button>' +
        '<button type="button" data-action-id="export-summary" onclick="app.exportData()">Export Summary</button>' +
      '</div>';
  }

  var app = {
    getState: store.getState,
    reset: function () {
      store.reset(Object.assign({}, seed, { view: "dashboard", search: "" }));
    },
    navigate: function (view) {
      store.dispatch({ type: "SET_VIEW", view: view });
    },
    toggleStatus: function (id) {
      var st = store.getState();
      var rec = (st.signals || []).find(function (s) { return s.id === id; });
      if (rec) {
        store.dispatch({ type: "SET_STATUS", id: id, status: nextStatus(rec.status) });
      }
    },
    selectRecord: function (id) {
      store.dispatch({ type: "SET_VIEW", view: "editor" });
      store.setState(function (s) { return Object.assign({}, s, { editingId: id }); });
    },
    createRecord: function () {
      var id = "sig-" + String(Date.now()).slice(-3);
      var rec = { id: id, name: "New Signal " + id, status: "ok", description: "" };
      store.setState(function (s) {
        return Object.assign({}, s, { signals: s.signals.concat(rec), view: "editor", editingId: id });
      });
    },
    saveRecord: function (e) {
      e.preventDefault();
      var form = e.target;
      var updates = {
        name: form.elements.name.value,
        status: form.elements.status.value,
        description: form.elements.description.value
      };
      var st = store.getState();
      var id = st.editingId || (st.signals[0] && st.signals[0].id);
      if (id) {
        store.dispatch({ type: "UPDATE_RECORD", id: id, updates: updates });
      }
      store.dispatch({ type: "SET_VIEW", view: "operations" });
    },
    cancelEdit: function () {
      store.dispatch({ type: "SET_VIEW", view: "operations" });
      store.setState(function (s) { return Object.assign({}, s, { editingId: null }); });
    },
    handleSearch: function (value) {
      store.dispatch({ type: "SET_SEARCH", value: value });
    },
    retryLoad: function () {
      render(store.getState());
    },
    filterInsights: function () {
      window.alert("Filter dialog placeholder");
    },
    exportData: function () {
      var blob = new Blob([JSON.stringify(store.getState(), null, 2)], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "signal-desk-canary-export.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    showHelp: function () {
      window.alert("Signal Desk Canary Help\n\nUse Operations to toggle signal status. Use Reset to restore seed data.");
    }
  };

  window.app = app;

  document.addEventListener("DOMContentLoaded", function () {
    render(store.getState());
  });
})();
