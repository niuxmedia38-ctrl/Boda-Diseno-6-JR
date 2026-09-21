const entry = document.querySelector('#entry');
const openButton = document.querySelector('#openInvitation');
const toast = document.querySelector('#toast');

function openInvitation() {
  entry.classList.add('opening');
  window.setTimeout(() => {
    entry.classList.add('is-open');
    document.body.classList.remove('locked');
    document.querySelector('#invitacion').focus({ preventScroll: true });
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 20 : 1050);
}

openButton.addEventListener('click', openInvitation);

// Permite generar capturas de control sin alterar la experiencia normal.
if (new URLSearchParams(window.location.search).get('preview') === 'content') {
  entry.classList.add('is-open');
  document.body.classList.remove('locked');
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((item) => {
    if (item.isIntersecting) {
      item.target.classList.add('visible');
      observer.unobserve(item.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const weddingDate = new Date('2025-09-13T19:00:00-06:00').getTime();
const units = {
  days: document.querySelector('[data-unit="days"]'),
  hours: document.querySelector('[data-unit="hours"]'),
  minutes: document.querySelector('[data-unit="minutes"]'),
  seconds: document.querySelector('[data-unit="seconds"]')
};

function updateCountdown() {
  const distance = weddingDate - Date.now();
  if (distance <= 0) {
    Object.values(units).forEach((unit) => { unit.textContent = '00'; });
    document.querySelector('#countdown').hidden = false;
    document.querySelector('#countdownDone').hidden = false;
    document.querySelector('.countdown').classList.add('is-finished');
    return;
  }
  document.querySelector('.countdown').classList.remove('is-finished');
  units.days.textContent = String(Math.floor(distance / 86400000)).padStart(2, '0');
  units.hours.textContent = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, '0');
  units.minutes.textContent = String(Math.floor((distance % 3600000) / 60000)).padStart(2, '0');
  units.seconds.textContent = String(Math.floor((distance % 60000) / 1000)).padStart(2, '0');
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

let toastTimer;
document.querySelectorAll('.pending-action').forEach((button) => {
  button.addEventListener('click', () => {
    toast.textContent = 'Este dato está marcado para configurarse con la información real.';
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3200);
  });
});

