const DISMISS_DELAY = 5;
const CONFIRM_WORD = 'DONE';

const messageEl = document.getElementById('message');
const sessionNameEl = document.getElementById('session-name');
const countdownEl = document.getElementById('countdown');
const ackArea = document.getElementById('ack-area');
const typeInput = document.getElementById('type-input');
const btnDismiss = document.getElementById('btn-dismiss');

let remaining = DISMISS_DELAY;
let unlocked = false;

window.overlay.onData((data) => {
  messageEl.textContent = data.message;
  sessionNameEl.textContent = data.name;

  const tick = setInterval(() => {
    remaining--;
    if (remaining > 0) {
      countdownEl.textContent = `Dismiss available in ${remaining}s`;
    } else {
      clearInterval(tick);
      countdownEl.textContent = '';
      unlocked = true;
      ackArea.classList.add('active');
      typeInput.focus();
    }
  }, 1000);

  countdownEl.textContent = `Dismiss available in ${remaining}s`;
});

typeInput.addEventListener('input', () => {
  if (!unlocked) return;

  typeInput.classList.remove('error');

  if (typeInput.value.toUpperCase() === CONFIRM_WORD) {
    typeInput.classList.add('success');
    window.overlay.dismiss();
  }
});

typeInput.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    e.preventDefault();
  }
});

btnDismiss.addEventListener('click', () => {
  if (!unlocked) return;
  window.overlay.dismiss();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || (e.altKey && e.key === 'F4')) {
    e.preventDefault();
  }
  if (e.altKey && e.key === 'Tab') {
    e.preventDefault();
  }
});
