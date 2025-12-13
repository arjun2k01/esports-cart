// frontend/src/lib/apiGuards.js

let onUnauthorized = null;
let lastUnauthorizedAt = 0;

export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

/**
 * Call when API returns 401.
 * Includes a small cooldown to avoid firing multiple times in parallel requests.
 */
export function triggerUnauthorized(payload = {}) {
  const now = Date.now();
  if (now - lastUnauthorizedAt < 2000) return; // 2s cooldown
  lastUnauthorizedAt = now;

  if (typeof onUnauthorized === "function") {
    onUnauthorized(payload);
  }
}
