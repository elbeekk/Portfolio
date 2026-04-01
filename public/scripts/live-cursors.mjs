import { filterActiveVisitors } from "./firebase-service.mjs";
import { BOT_REVIEWER_ID, getBotReviewerDocumentTarget, mergeVisitorsWithBot } from "./reviewer-bot.mjs";
import { clamp, generateId, isFinePointer, prefersReducedMotion, readStorageJSON, throttle, writeStorageJSON } from "./utils.mjs";

const LABEL_KEY = "portfolio.cursorLabel";
const LABEL_PREFIXES = ["swift", "quiet", "north", "ember", "tidy", "soft", "mono", "river", "signal", "pixel"];
const LABEL_SUFFIXES = ["fox", "otter", "pine", "orca", "kite", "glow", "atlas", "cedar", "tide", "lark"];

export function initializeLiveCursorLayer({ service, layerElement, countElements = [] }) {
  if (!layerElement) {
    updateLiveCount(countElements, 1);
    return { destroy() {} };
  }

  const pointerCapable = isFinePointer() && window.innerWidth > 920;
  const reducedMotion = prefersReducedMotion();
  const label = getOrCreateLabel();
  let remoteVisitors = [];
  let visitorsForUi = mergeVisitorsWithBot(remoteVisitors, { cursorVisible: pointerCapable });
  let lastPointerAt = Date.now();
  let rafId = 0;

  const markerMap = new Map();
  const presence = service.joinPresence({
    presenceId: generateId("presence"),
    label,
    cursorVisible: pointerCapable
  });

  updateLiveCount(countElements, visitorsForUi.length);
  syncVisitorMarkers(visitorsForUi.filter((visitor) => visitor.cursorVisible), markerMap, layerElement);

  const unsubscribeVisitors = service.subscribeLiveVisitors((visitors) => {
    remoteVisitors = filterActiveVisitors(visitors);
    visitorsForUi = mergeVisitorsWithBot(remoteVisitors, {
      excludeId: presence.id,
      cursorVisible: pointerCapable
    });
    updateLiveCount(countElements, visitorsForUi.length);
    syncVisitorMarkers(visitorsForUi.filter((visitor) => visitor.cursorVisible), markerMap, layerElement);
  });

  const sendPointerUpdate = throttle(async (event) => {
    if (!pointerCapable) {
      return;
    }

    lastPointerAt = Date.now();
    await presence.updateCursor({
      x: clamp(event.clientX / window.innerWidth, 0, 1),
      y: clamp(event.clientY / window.innerHeight, 0, 1),
      idle: false,
      cursorVisible: true
    });
  }, 90);

  const handlePointerMove = (event) => {
    sendPointerUpdate(event);
  };

  const handlePointerLeave = async () => {
    await presence.updateCursor({ idle: true });
  };

  if (pointerCapable) {
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
  }

  const idleInterval = window.setInterval(async () => {
    if (Date.now() - lastPointerAt > 3600) {
      await presence.updateCursor({ idle: true });
    }
  }, 1400);

  const renderFrame = () => {
    const visibleVisitors = visitorsForUi.filter((visitor) => visitor.cursorVisible);

    visibleVisitors.forEach((visitor) => {
      const marker = markerMap.get(visitor.id);
      if (!marker) {
        return;
      }

      const motionTarget =
        visitor.id === BOT_REVIEWER_ID
          ? getBotViewportTarget(performance.now())
          : { x: Number(visitor.x || 0.5), y: Number(visitor.y || 0.5) };
      const targetX = motionTarget.x * window.innerWidth;
      const targetY = visitor.id === BOT_REVIEWER_ID ? motionTarget.y : motionTarget.y * window.innerHeight;
      const easing = visitor.id === BOT_REVIEWER_ID ? 0.09 : 0.18;

      marker.x = reducedMotion ? targetX : marker.x + (targetX - marker.x) * easing;
      marker.y = reducedMotion ? targetY : marker.y + (targetY - marker.y) * easing;

      marker.element.style.transform = `translate3d(${marker.x}px, ${marker.y}px, 0)`;
      marker.element.style.opacity =
        visitor.id === BOT_REVIEWER_ID
          ? motionTarget.visible
            ? "0.7"
            : "0"
          : visitor.idle
            ? "0.34"
            : "0.9";
    });

    rafId = window.requestAnimationFrame(renderFrame);
  };

  rafId = window.requestAnimationFrame(renderFrame);

  const cleanup = async () => {
    window.clearInterval(idleInterval);
    window.cancelAnimationFrame(rafId);
    unsubscribeVisitors();
    if (pointerCapable) {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    }
    markerMap.forEach((marker) => marker.element.remove());
    markerMap.clear();
    await presence.dispose();
  };

  window.addEventListener("pagehide", cleanup, { once: true });

  return {
    destroy: cleanup
  };
}

function syncVisitorMarkers(visitors, markerMap, layerElement) {
  const visibleIds = new Set(visitors.map((visitor) => visitor.id));

  markerMap.forEach((marker, id) => {
    if (!visibleIds.has(id)) {
      marker.element.remove();
      markerMap.delete(id);
    }
  });

  visitors.forEach((visitor) => {
    if (!visitor.cursorVisible || markerMap.has(visitor.id)) {
      return;
    }

    const element = document.createElement("div");
    element.className = visitor.id === BOT_REVIEWER_ID ? "live-cursor live-cursor--bot" : "live-cursor";
    const dot = document.createElement("span");
    dot.className = "live-cursor__dot";

    const label = document.createElement("span");
    label.className = "live-cursor__label";
    label.textContent = visitor.label || "guest";

    element.append(dot, label);
    layerElement.append(element);
    const initialTarget =
      visitor.id === BOT_REVIEWER_ID
        ? getBotViewportTarget(performance.now())
        : { x: Number(visitor.x || 0.5), y: Number(visitor.y || 0.5) };

    markerMap.set(visitor.id, {
      element,
      x: initialTarget.x * window.innerWidth,
      y: visitor.id === BOT_REVIEWER_ID ? initialTarget.y : initialTarget.y * window.innerHeight
    });
  });
}

function updateLiveCount(elements, value) {
  elements.forEach((element) => {
    element.textContent = String(value);
  });
}

function getOrCreateLabel() {
  const storedLabel = readStorageJSON(LABEL_KEY, "");
  if (storedLabel) {
    return storedLabel;
  }

  const prefix = LABEL_PREFIXES[Math.floor(Math.random() * LABEL_PREFIXES.length)];
  const suffix = LABEL_SUFFIXES[Math.floor(Math.random() * LABEL_SUFFIXES.length)];
  const label = `${prefix}-${suffix}`;
  writeStorageJSON(LABEL_KEY, label);
  return label;
}

function getBotViewportTarget(timeMs) {
  const documentWidth = document.documentElement.clientWidth || window.innerWidth;
  const documentHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
  const documentTarget = getBotReviewerDocumentTarget({
    timeMs,
    pageWidth: documentWidth,
    pageHeight: documentHeight
  });
  const viewportY = documentTarget.y - window.scrollY;

  return {
    x: clamp(documentTarget.x / window.innerWidth, 0.18, 0.9),
    y: viewportY,
    visible: viewportY > -72 && viewportY < window.innerHeight + 72
  };
}
