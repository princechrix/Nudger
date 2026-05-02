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
let activeSessionInterval = null;
let countdownInterval = null;

const ICONS = {
  play: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11.04-6.86a1 1 0 0 0 0-1.72L9.5 4.28a1 1 0 0 0-1.5.86z"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>',
  volumeOn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
  volumeOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>',
};

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
    ringtoneName.classList.remove('ringtone-picker__name--empty');
    btnClearRingtone.classList.remove('hidden');
  } else {
    ringtoneName.textContent = 'None selected';
    ringtoneName.classList.add('ringtone-picker__name--empty');
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

// ── Countdown ──
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
  const textEl = document.getElementById('active-countdown');
  const fillEl = document.getElementById('active-countdown-fill');
  if (!textEl || !fillEl) return;

  const ms = await window.nudger.engine.timeRemaining();
  if (ms === null || !activeSessionInterval) {
    textEl.textContent = '';
    fillEl.style.width = '0%';
    return;
  }

  const totalMs = activeSessionInterval * 60 * 1000;
  const elapsed = totalMs - ms;
  const pct = Math.min(100, (elapsed / totalMs) * 100);

  textEl.textContent = formatCountdown(ms);
  fillEl.style.width = `${pct}%`;
}

// ── Render Sessions ──
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
      ? `<button class="icon-btn icon-btn--mute ${isMuted ? 'icon-btn--muted' : ''}" data-mute="${session.id}" title="${isMuted ? 'Unmute' : 'Mute'}">${isMuted ? ICONS.volumeOff : ICONS.volumeOn}</button>`
      : '';

    const timerBlock = isActive
      ? `<div class="session-card__timer">
          <div class="session-card__timer-track"><div class="session-card__timer-fill" id="active-countdown-fill"></div></div>
          <span class="session-card__timer-text" id="active-countdown"></span>
        </div>`
      : '';

    const statusBlock = isActive
      ? '<div class="session-card__status"><span class="session-card__status-dot"></span>Running</div>'
      : '';

    const primaryBtn = isActive
      ? `<button class="icon-btn icon-btn--stop" data-stop="${session.id}" title="Stop">${ICONS.stop}</button>`
      : `<button class="icon-btn icon-btn--start" data-start="${session.id}" title="Start">${ICONS.play}</button>`;

    card.innerHTML = `
      <div class="session-card__top">
        <span class="session-card__name">${escapeHtml(session.name)}</span>
        <div class="session-card__meta">
          ${muteBtn}
          <span class="session-card__tag">${session.interval}m / ${session.nudgeDuration || 5}s</span>
        </div>
      </div>
      <div class="session-card__message">${escapeHtml(session.message)}</div>
      ${timerBlock}
      <div class="session-card__footer">
        ${statusBlock}
        <div class="session-card__actions">
          ${primaryBtn}
          <button class="icon-btn" data-edit="${session.id}" title="Edit">${ICONS.edit}</button>
          <button class="icon-btn icon-btn--danger" data-delete="${session.id}" title="Delete">${ICONS.trash}</button>
        </div>
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
    if (result.ok) {
      activeSessionId = startId;
      activeSessionInterval = result.session.interval;
    }
    await renderSessions();
  }

  if (stopId) {
    await window.nudger.engine.stop();
    activeSessionId = null;
    activeSessionInterval = null;
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
      activeSessionInterval = null;
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
window.nudger.onNudge(() => {});

// ── Init ──
async function init() {
  const status = await window.nudger.engine.status();
  if (status.running && status.session) {
    activeSessionId = status.session.id;
    activeSessionInterval = status.session.interval;
  }
  await renderSessions();
}

init();
