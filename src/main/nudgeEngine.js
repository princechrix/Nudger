let activeTimer = null;
let activeSession = null;
let onNudge = null;
let nextNudgeAt = null;

function start(session, callback) {
  if (activeTimer) stop();

  activeSession = session;
  onNudge = callback;

  const intervalMs = session.interval * 60 * 1000;
  nextNudgeAt = Date.now() + intervalMs;

  activeTimer = setInterval(() => {
    if (onNudge) onNudge(activeSession);
    nextNudgeAt = Date.now() + intervalMs;
  }, intervalMs);
}

function stop() {
  if (activeTimer) {
    clearInterval(activeTimer);
    activeTimer = null;
  }
  activeSession = null;
  onNudge = null;
  nextNudgeAt = null;
}

function getActive() {
  return activeSession;
}

function isRunning() {
  return activeTimer !== null;
}

function getTimeRemaining() {
  if (!nextNudgeAt) return null;
  return Math.max(0, nextNudgeAt - Date.now());
}

module.exports = { start, stop, getActive, isRunning, getTimeRemaining };
