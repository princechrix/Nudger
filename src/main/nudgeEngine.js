let activeTimer = null;
let activeSession = null;
let onNudge = null;

function start(session, callback) {
  if (activeTimer) stop();

  activeSession = session;
  onNudge = callback;

  const intervalMs = session.interval * 60 * 1000;

  activeTimer = setInterval(() => {
    if (onNudge) onNudge(activeSession);
  }, intervalMs);
}

function stop() {
  if (activeTimer) {
    clearInterval(activeTimer);
    activeTimer = null;
  }
  activeSession = null;
  onNudge = null;
}

function getActive() {
  return activeSession;
}

function isRunning() {
  return activeTimer !== null;
}

module.exports = { start, stop, getActive, isRunning };
