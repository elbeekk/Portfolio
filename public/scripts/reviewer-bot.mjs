import { clamp } from "./utils.mjs";

export const BOT_REVIEWER_ID = "bot-reviewer";
export const BOT_REVIEWER_LABEL = "bot-reviewer";

export function createBotReviewerVisitor(overrides = {}) {
  return {
    id: BOT_REVIEWER_ID,
    label: BOT_REVIEWER_LABEL,
    cursorVisible: true,
    idle: false,
    updatedAt: Date.now(),
    page: "portfolio sweep",
    isBotReviewer: true,
    ...overrides
  };
}

export function mergeVisitorsWithBot(visitors, { excludeId = "", cursorVisible = true } = {}) {
  const filteredVisitors = visitors.filter((visitor) => visitor.id !== excludeId);
  return [createBotReviewerVisitor({ cursorVisible }), ...filteredVisitors];
}

export function getBotReviewerDocumentTarget({
  timeMs = performance.now(),
  pageWidth = window.innerWidth,
  pageHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight)
} = {}) {
  const t = timeMs / 1000;
  const xRatio = clamp(0.64 + 0.12 * Math.sin(t / 6) + 0.04 * Math.sin(t / 3.1 + 1.4), 0.42, 0.82);
  const yRatio = clamp(0.15 + 0.66 * (0.5 + 0.5 * Math.sin(t / 13.5 + 0.8)) + 0.04 * Math.cos(t / 4.4), 0.1, 0.92);

  return {
    x: xRatio * pageWidth,
    y: yRatio * pageHeight
  };
}
