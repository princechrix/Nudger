const CONFIRM_WORD = 'DONE';
const RING_RADIUS = 48;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const messageEl = document.getElementById('message');
const sessionNameEl = document.getElementById('session-name');
const ringWrap = document.getElementById('ring-wrap');
const ringFill = document.getElementById('ring-fill');
const ringText = document.getElementById('ring-text');
const ackArea = document.getElementById('ack-area');
const typeInput = document.getElementById('type-input');
const btnDismiss = document.getElementById('btn-dismiss');

let remaining = 5;
let totalDuration = 5;
let unlocked = false;
let audio = null;

ringFill.style.strokeDasharray = RING_CIRCUMFERENCE;
ringFill.style.strokeDashoffset = RING_CIRCUMFERENCE;

function startRingtone(url) {
  if (!url) return;
  audio = new Audio(url);
  audio.loop = true;
  audio.play().catch(() => {});
}

function stopRingtone() {
  if (!audio) return;
  audio.pause();
  audio.src = '';
  audio = null;
}

function updateRing() {
  const elapsed = totalDuration - remaining;
  const progress = elapsed / totalDuration;
  const offset = RING_CIRCUMFERENCE * (1 - progress);
  ringFill.style.strokeDashoffset = offset;
  ringText.textContent = remaining;
}

window.addEventListener('nudger:stop-audio', stopRingtone);

window.overlay.onData((data) => {
  messageEl.textContent = data.message;
  sessionNameEl.textContent = data.name;
  remaining = data.nudgeDuration || 5;
  totalDuration = remaining;

  startRingtone(data.ringtoneUrl);
  updateRing();

  const tick = setInterval(() => {
    remaining--;
    if (remaining > 0) {
      updateRing();
    } else {
      clearInterval(tick);
      ringFill.style.strokeDashoffset = 0;
      ringText.textContent = '';

      setTimeout(() => {
        ringWrap.classList.add('hidden');
        unlocked = true;
        ackArea.classList.add('active');
        typeInput.focus();
      }, 300);
    }
  }, 1000);
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
