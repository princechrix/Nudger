const $ = (sel) => document.querySelector(sel);
const viewList = $('#view-list');
const viewForm = $('#view-form');
const sessionList = $('#session-list');
const emptyState = $('#empty-state');
const form = $('#session-form');
const formTitle = $('#form-title');
const btnSave = $('#btn-save');
const fieldId = $('#field-id');
const fieldName = $('#field-name');
const fieldInterval = $('#field-interval');
const fieldNudgeDuration = $('#field-nudge-duration');
const fieldMessage = $('#field-message');
const fieldRingtone = $('#field-ringtone');
const ringtoneName = $('#ringtone-name');
const btnPickRingtone = $('#btn-pick-ringtone');
const btnClearRingtone = $('#btn-clear-ringtone');

let activeSessionId = null;
let countdownInterval = null;

// ── Titlebar ──
$('#btn-minimize').addEventListener('click', () => window.nudger.minimize());
$('#btn-close').addEventListener('click', () => window.nudger.close());

// ── Navigation ──
function showView(view) {
  viewList.classList.toggle('hidden', view !== 'list');
  viewForm.classList.toggle('hidden', view !== 'form');
}

function setRingtoneDisplay(filePath) {
  fieldRingtone.value = filePath || '';
  if (filePath) {
    ringtoneName.textContent = filePath.split(/[\\/]/).pop();
    btnClearRingtone.classList.remove('hidden');
  } else {
    ringtoneName.textContent = 'None';
    btnClearRingtone.classList.add('hidden');
  }
}

btnPickRingtone.addEventListener('click', async () => {
  const filePath = await window.nudger.pickRingtone();
  if (filePath) setRingtoneDisplay(filePath);
});

btnClearRingtone.addEventListener('click', () => {
  setRingtoneDisplay(null);
});

$('#btn-new-session').addEventListener('click', () => {
  fieldId.value = '';
  form.reset();
  setRingtoneDisplay(null);
  formTitle.textContent = 'New Session';
  btnSave.textContent = 'Create Session';
  showView('form');
});

$('#btn-back').addEventListener('click', () => showView('list'));

// ── Render Sessions ──
function formatCountdown(ms) {
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function startCountdownTimer() {
  stopCountdownTimer();
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

function stopCountdownTimer() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

async function updateCountdown() {
  const el = document.getElementById('active-countdown');
  if (!el) return;
  const ms = await window.nudger.engine.timeRemaining();
  if (ms === null) {
    el.textContent = '';
    return;
  }
  el.textContent = `Next nudge in ${formatCountdown(ms)}`;
}

async function renderSessions() {
  const sessions = await window.nudger.sessions.getAll();

  const cards = sessionList.querySelectorAll('.session-card');
  cards.forEach((c) => c.remove());

  emptyState.style.display = sessions.length === 0 ? 'flex' : 'none';

  sessions.forEach((session) => {
    const isActive = session.id === activeSessionId;
    const isMuted = Boolean(session.muted);
    const hasRingtone = Boolean(session.ringtone);
    const card = document.createElement('div');
    card.className = 'session-card' + (isActive ? ' session-card--active' : '');

    const muteBtn = hasRingtone
      ? `<button class="btn btn--mute ${isMuted ? 'btn--muted' : ''}" data-mute="${session.id}" title="${isMuted ? 'Unmute' : 'Mute'}">${isMuted ? '&#128263;' : '&#128266;'}</button>`
      : '';

    const countdownRow = isActive
      ? '<div class="session-card__countdown" id="active-countdown"></div>'
      : '';

    card.innerHTML = `
      <div class="session-card__top">
        <span class="session-card__name">${escapeHtml(session.name)}</span>
        <div class="session-card__meta">
          ${muteBtn}
          <span class="session-card__interval">${session.interval}m / ${session.nudgeDuration || 5}s lock</span>
        </div>
      </div>
      <div class="session-card__message">${escapeHtml(session.message)}</div>
      ${countdownRow}
      <div class="session-card__actions">
        ${isActive
    ? '<span class="session-card__status">Running</span><button class="btn btn--stop" data-stop="' + session.id + '">Stop</button>'
    : '<button class="btn btn--start" data-start="' + session.id + '">Start</button>'}
        <button class="btn btn--ghost btn--small" data-edit="${session.id}">Edit</button>
        <button class="btn btn--danger" data-delete="${session.id}">Delete</button>
      </div>
    `;
    sessionList.appendChild(card);
  });

  if (activeSessionId) {
    startCountdownTimer();
  } else {
    stopCountdownTimer();
  }
}

// ── Event Delegation ──
sessionList.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const startId = btn.dataset.start;
  const stopId = btn.dataset.stop;
  const editId = btn.dataset.edit;
  const deleteId = btn.dataset.delete;
  const muteId = btn.dataset.mute;

  if (muteId) {
    await window.nudger.sessions.toggleMute(muteId);
    await renderSessions();
    return;
  }

  if (startId) {
    const result = await window.nudger.engine.start(startId);
    if (result.ok) activeSessionId = startId;
    await renderSessions();
  }

  if (stopId) {
    await window.nudger.engine.stop();
    activeSessionId = null;
    await renderSessions();
  }

  if (editId) {
    const session = await window.nudger.sessions.get(editId);
    if (!session) return;
    fieldId.value = session.id;
    fieldName.value = session.name;
    fieldInterval.value = session.interval;
    fieldNudgeDuration.value = session.nudgeDuration || 5;
    fieldMessage.value = session.message;
    setRingtoneDisplay(session.ringtone);
    formTitle.textContent = 'Edit Session';
    btnSave.textContent = 'Save Changes';
    showView('form');
  }

  if (deleteId) {
    if (activeSessionId === deleteId) {
      await window.nudger.engine.stop();
      activeSessionId = null;
    }
    await window.nudger.sessions.delete(deleteId);
    await renderSessions();
  }
});

// ── Form Submit ──
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: fieldName.value,
    interval: Number(fieldInterval.value),
    nudgeDuration: Number(fieldNudgeDuration.value),
    message: fieldMessage.value,
    ringtone: fieldRingtone.value || null,
  };

  if (fieldId.value) {
    await window.nudger.sessions.update(fieldId.value, data);
  } else {
    await window.nudger.sessions.create(data);
  }

  showView('list');
  await renderSessions();
});

// ── Helpers ──
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Nudge Listener ──
window.nudger.onNudge((session) => {
  // Overlay will be implemented in feature/fullscreen-overlay
  // For now, log to confirm the engine fires correctly
  console.log('NUDGE:', session.message);
});

// ── Init ──
async function init() {
  const status = await window.nudger.engine.status();
  if (status.running && status.session) {
    activeSessionId = status.session.id;
  }
  await renderSessions();
}

init();
