const DISMISS_DELAY = 5;

const messageEl = document.getElementById('message');
const sessionNameEl = document.getElementById('session-name');
const countdownEl = document.getElementById('countdown');
const btnDismiss = document.getElementById('btn-dismiss');

let remaining = DISMISS_DELAY;

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
      btnDismiss.classList.add('active');
    }
  }, 1000);

  countdownEl.textContent = `Dismiss available in ${remaining}s`;
});

btnDismiss.addEventListener('click', () => {
  window.overlay.dismiss();
});
