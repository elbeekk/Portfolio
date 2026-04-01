import { firebaseSettings } from "./firebase-config.mjs";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics, isSupported, logEvent } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
import {
  collection,
  doc,
  getFirestore,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import {
  getDatabase,
  onDisconnect,
  onValue,
  ref,
  remove,
  set,
  update
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const LIVE_PATH = "presence";
const VISITS_COLLECTION = "visits";
const SUMMARY_COLLECTION = "site_stats";
const SUMMARY_DOCUMENT_ID = "portfolio";
const SOURCES_COLLECTION = "source_stats";
const ACTIVE_THRESHOLD_MS = 20000;

export async function createFirebaseService() {
  const appConfig = firebaseSettings?.app ?? {};
  const baseAppReady = Boolean(
    firebaseSettings?.enabled &&
      appConfig.apiKey &&
      appConfig.projectId &&
      appConfig.appId &&
      appConfig.authDomain
  );

  if (!baseAppReady) {
    return disabledFirebaseService("Firebase config is missing or disabled.");
  }

  const app = initializeApp(appConfig);
  const firestore = getFirestore(app);
  const database = appConfig.databaseURL ? getDatabase(app) : null;
  let analytics = null;

  if (appConfig.measurementId) {
    try {
      if (await isSupported()) {
        analytics = getAnalytics(app);
      }
    } catch (error) {
      console.warn("Firebase Analytics is not available in this environment.", error);
    }
  }

  return {
    enabled: true,
    firestoreEnabled: Boolean(firestore),
    databaseEnabled: Boolean(database),
    analyticsEnabled: Boolean(analytics),
    statusMessage: "Firebase connected.",
    async trackVisit(session) {
      if (!firestore || !session?.id) {
        return false;
      }

      const visitRef = doc(firestore, VISITS_COLLECTION, session.id);
      const summaryRef = doc(firestore, SUMMARY_COLLECTION, SUMMARY_DOCUMENT_ID);
      const sourceRef = doc(firestore, SOURCES_COLLECTION, session.source || "direct");

      try {
        const created = await runTransaction(firestore, async (transaction) => {
          const existingVisit = await transaction.get(visitRef);
          if (existingVisit.exists()) {
            return false;
          }

          transaction.set(visitRef, {
            source: session.source || "direct",
            medium: session.medium || "",
            campaign: session.campaign || "",
            referrer: session.referrer || "",
            landingPath: session.landingPath || window.location.pathname,
            createdAt: serverTimestamp(),
            sessionStartedAt: session.startedAt,
            updatedAt: serverTimestamp()
          });

          transaction.set(
            summaryRef,
            {
              totalVisits: increment(1),
              uniqueSessions: increment(1),
              updatedAt: serverTimestamp()
            },
            { merge: true }
          );

          transaction.set(
            sourceRef,
            {
              source: session.source || "direct",
              count: increment(1),
              updatedAt: serverTimestamp()
            },
            { merge: true }
          );

          return true;
        });

        if (created && analytics) {
          logEvent(analytics, "portfolio_visit", {
            source: session.source || "direct",
            medium: session.medium || "none"
          });
        }

        return created;
      } catch (error) {
        console.error("Visit tracking failed.", error);
        return false;
      }
    },
    subscribeSummary(callback) {
      if (!firestore) {
        callback({ totalVisits: 0, uniqueSessions: 0 });
        return () => {};
      }

      return onSnapshot(doc(firestore, SUMMARY_COLLECTION, SUMMARY_DOCUMENT_ID), (snapshot) => {
        callback(snapshot.exists() ? snapshot.data() : { totalVisits: 0, uniqueSessions: 0 });
      });
    },
    subscribeSources(callback) {
      if (!firestore) {
        callback([]);
        return () => {};
      }

      const sourceQuery = query(collection(firestore, SOURCES_COLLECTION), orderBy("count", "desc"));
      return onSnapshot(sourceQuery, (snapshot) => {
        callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      });
    },
    subscribeLatestVisits(callback, maxResults = 12) {
      if (!firestore) {
        callback([]);
        return () => {};
      }

      const visitQuery = query(collection(firestore, VISITS_COLLECTION), orderBy("createdAt", "desc"), limit(maxResults));
      return onSnapshot(visitQuery, (snapshot) => {
        callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      });
    },
    subscribeLiveVisitors(callback) {
      if (!database) {
        callback([]);
        return () => {};
      }

      return onValue(ref(database, LIVE_PATH), (snapshot) => {
        const visitors = [];
        snapshot.forEach((childSnapshot) => {
          visitors.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        callback(visitors);
      });
    },
    joinPresence({ presenceId, label, cursorVisible = true }) {
      if (!database || !presenceId || !label) {
        return disabledPresenceChannel();
      }

      const presenceRef = ref(database, `${LIVE_PATH}/${presenceId}`);
      const connectionRef = ref(database, ".info/connected");
      let connected = false;
      let currentState = {
        label,
        cursorVisible,
        x: 0.5,
        y: 0.5,
        idle: true,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        page: window.location.pathname,
        updatedAt: Date.now()
      };

      const writeState = async (nextState) => {
        currentState = {
          ...currentState,
          ...nextState,
          updatedAt: Date.now(),
          page: window.location.pathname,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight
        };

        if (!connected) {
          return;
        }

        await update(presenceRef, currentState);
      };

      const unsubscribeConnection = onValue(connectionRef, async (snapshot) => {
        if (snapshot.val() !== true) {
          connected = false;
          return;
        }

        try {
          await onDisconnect(presenceRef).remove();
          await set(presenceRef, currentState);
          connected = true;
        } catch (error) {
          console.error("Presence setup failed.", error);
        }
      });

      return {
        id: presenceId,
        label,
        async updateCursor(nextPosition) {
          await writeState(nextPosition);
        },
        async dispose() {
          unsubscribeConnection();
          try {
            await remove(presenceRef);
          } catch (error) {
            console.warn("Presence cleanup skipped.", error);
          }
        }
      };
    },
    logCustomEvent(name, params = {}) {
      if (!analytics) {
        return;
      }

      try {
        logEvent(analytics, name, params);
      } catch (error) {
        console.warn(`Analytics event ${name} failed.`, error);
      }
    }
  };
}

export function filterActiveVisitors(visitors, includeAll = true) {
  const now = Date.now();
  return visitors.filter((visitor) => {
    const isActive = now - Number(visitor.updatedAt || 0) <= ACTIVE_THRESHOLD_MS;
    return includeAll ? isActive : isActive && visitor.cursorVisible;
  });
}

function disabledFirebaseService(statusMessage) {
  return {
    enabled: false,
    firestoreEnabled: false,
    databaseEnabled: false,
    analyticsEnabled: false,
    statusMessage,
    async trackVisit() {
      return false;
    },
    subscribeSummary(callback) {
      callback({ totalVisits: 0, uniqueSessions: 0 });
      return () => {};
    },
    subscribeSources(callback) {
      callback([]);
      return () => {};
    },
    subscribeLatestVisits(callback) {
      callback([]);
      return () => {};
    },
    subscribeLiveVisitors(callback) {
      callback([]);
      return () => {};
    },
    joinPresence() {
      return disabledPresenceChannel();
    },
    logCustomEvent() {}
  };
}

function disabledPresenceChannel() {
  return {
    id: "",
    label: "",
    async updateCursor() {},
    async dispose() {}
  };
}
