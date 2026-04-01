import { createFirebaseService, filterActiveVisitors } from "./firebase-service.mjs";
import { mergeVisitorsWithBot } from "./reviewer-bot.mjs";
import { sourceLabelFor } from "./source-tracking.mjs";
import { escapeHtml, formatDateTime, formatRelativeTime, qs } from "./utils.mjs";

bootstrapAdmin();

async function bootstrapAdmin() {
  const service = await createFirebaseService();
  qs("[data-firebase-status]").textContent = service.statusMessage;

  const unsubscribeSummary = service.subscribeSummary((summary) => {
    qs("[data-stat-total]").textContent = String(summary.totalVisits || 0);
    qs("[data-stat-sessions]").textContent = String(summary.uniqueSessions || 0);
  });

  const unsubscribeSources = service.subscribeSources((sources) => {
    renderSourceBreakdown(sources);
  });

  const unsubscribeVisits = service.subscribeLatestVisits((visits) => {
    renderVisitTable(visits);
  });

  const unsubscribeLive = service.subscribeLiveVisitors((visitors) => {
    const activeVisitors = mergeVisitorsWithBot(filterActiveVisitors(visitors));
    qs("[data-stat-live]").textContent = String(activeVisitors.length);
    renderLiveVisitors(activeVisitors);
  });

  window.addEventListener(
    "pagehide",
    () => {
      unsubscribeSummary();
      unsubscribeSources();
      unsubscribeVisits();
      unsubscribeLive();
    },
    { once: true }
  );
}

function renderSourceBreakdown(sources) {
  const container = qs("[data-source-list]");
  if (!sources.length) {
    container.innerHTML = `<p class="empty-state">No tracked visits yet.</p>`;
    return;
  }

  const highestCount = Math.max(...sources.map((source) => Number(source.count || 0)), 1);

  container.innerHTML = sources
    .map((source) => {
      const width = `${Math.max((Number(source.count || 0) / highestCount) * 100, 8)}%`;
      return `
        <div class="source-row">
          <div class="source-row__meta">
            <span class="source-row__label">${escapeHtml(sourceLabelFor(source.source || source.id))}</span>
            <span class="source-row__subtle">${escapeHtml(source.source || source.id)}</span>
          </div>
          <div class="source-row__bar" style="--source-width: ${width}">
            <span aria-hidden="true"></span>
          </div>
          <strong>${Number(source.count || 0)}</strong>
        </div>
      `;
    })
    .join("");
}

function renderLiveVisitors(visitors) {
  const container = qs("[data-live-list]");
  if (!visitors.length) {
    container.innerHTML = `<p class="empty-state">No active visitors right now.</p>`;
    return;
  }

  container.innerHTML = visitors
    .map(
      (visitor) => `
        <div class="live-row">
          <div>
            <span class="live-row__label">${escapeHtml(visitor.label || "guest")}</span>
            <span class="live-row__subtle">${visitor.isBotReviewer ? "Demo reviewer" : visitor.cursorVisible ? "Visible cursor" : "Presence only"}</span>
          </div>
          <span class="live-row__subtle">${escapeHtml(visitor.page || "/")}</span>
        </div>
      `
    )
    .join("");
}

function renderVisitTable(visits) {
  const tableBody = qs("[data-visits-table]");
  if (!visits.length) {
    tableBody.innerHTML = `<tr><td colspan="4" class="empty-state">No visit records yet.</td></tr>`;
    return;
  }

  tableBody.innerHTML = visits
    .map((visit) => {
      const utmSummary = [visit.medium, visit.campaign].filter(Boolean).join(" / ") || "—";
      return `
        <tr>
          <td>
            <div>${escapeHtml(formatDateTime(visit.createdAt))}</div>
            <div class="source-row__subtle">${escapeHtml(formatRelativeTime(visit.createdAt))}</div>
          </td>
          <td>${escapeHtml(sourceLabelFor(visit.source || "direct"))}</td>
          <td>${escapeHtml(utmSummary)}</td>
          <td>${escapeHtml(visit.landingPath || "/")}</td>
        </tr>
      `;
    })
    .join("");
}
