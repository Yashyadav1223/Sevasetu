const CACHE_NAME = "sevasetu-v1";
const STATIC_ASSETS = ["/", "/field-report", "/manifest.json", "/icon.svg"];
const QUEUE_KEY = "sevasetu-offline-reports";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method === "POST" && new URL(request.url).pathname === "/api/field-report") {
    event.respondWith(
      fetch(request.clone()).catch(async () => {
        const body = await request.clone().text();
        const reports = JSON.parse((await idbGet(QUEUE_KEY)) || "[]");
        reports.push({ url: request.url, body, headers: [...request.headers], createdAt: Date.now() });
        await idbSet(QUEUE_KEY, JSON.stringify(reports));
        return new Response(JSON.stringify({ queued: true }), {
          status: 202,
          headers: { "Content-Type": "application/json" }
        });
      })
    );
    return;
  }

  if (request.method === "GET") {
    event.respondWith(fetch(request).catch(() => caches.match(request).then((res) => res || caches.match("/"))));
  }
});

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-field-reports") {
    event.waitUntil(flushReports());
  }
});

async function flushReports() {
  const reports = JSON.parse((await idbGet(QUEUE_KEY)) || "[]");
  const remaining = [];

  for (const report of reports) {
    try {
      await fetch(report.url, {
        method: "POST",
        headers: Object.fromEntries(report.headers),
        body: report.body
      });
    } catch {
      remaining.push(report);
    }
  }

  await idbSet(QUEUE_KEY, JSON.stringify(remaining));
}

function idbOpen() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("sevasetu-offline", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("kv");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbGet(key) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("kv", "readonly");
    const request = tx.objectStore("kv").get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbSet(key, value) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("kv", "readwrite");
    const request = tx.objectStore("kv").put(value, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
