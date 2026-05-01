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
const fieldMessage = $('#field-message');

let activeSessionId = null;

// ── Titlebar ──
$('#btn-minimize').addEventListener('click', () => window.nudger.minimize());
$('#btn-close').addEventListener('click', () => window.nudger.close());

// ── Navigation ──
function showView(view) {
  viewList.classList.toggle('hidden', view !== 'list');
  viewForm.classList.toggle('hidden', view !== 'form');
}

$('#btn-new-session').addEventListener('click', () => {
  fieldId.value = '';
  form.reset();
  formTitle.textContent = 'New Session';
  btnSave.textContent = 'Create Session';
  showView('form');
});

$('#btn-back').addEventListener('click', () => showView('list'));

// ── Render Sessions ──
async function renderSessions() {
  const sessions = await window.nudger.sessions.getAll();

  const cards = sessionList.querySelectorAll('.session-card');
  cards.forEach((c) => c.remove());

  emptyState.style.display = sessions.length === 0 ? 'flex' : 'none';

  sessions.forEach((session) => {
    const isActive = session.id === activeSessionId;
    const card = document.createElement('div');
    card.className = 'session-card' + (isActive ? ' session-card--active' : '');
    card.innerHTML = `
      <div class="session-card__top">
        <span class="session-card__name">${escapeHtml(session.name)}</span>
        <span class="session-card__interval">${session.interval}m</span>
      </div>
      <div class="session-card__message">${escapeHtml(session.message)}</div>
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
}

// ── Event Delegation ──
sessionList.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const startId = btn.dataset.start;
  const stopId = btn.dataset.stop;
  const editId = btn.dataset.edit;
  const deleteId = btn.dataset.delete;

  if (startId) {
    activeSessionId = startId;
    await renderSessions();
  }

  if (stopId) {
    activeSessionId = null;
    await renderSessions();
  }

  if (editId) {
    const session = await window.nudger.sessions.get(editId);
    if (!session) return;
    fieldId.value = session.id;
    fieldName.value = session.name;
    fieldInterval.value = session.interval;
    fieldMessage.value = session.message;
    formTitle.textContent = 'Edit Session';
    btnSave.textContent = 'Save Changes';
    showView('form');
  }

  if (deleteId) {
    if (activeSessionId === deleteId) activeSessionId = null;
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
    message: fieldMessage.value,
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

// ── Init ──
renderSessions();
