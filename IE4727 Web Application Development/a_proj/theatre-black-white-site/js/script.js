const menuButton = document.querySelector('[data-menu]');
const menu = document.querySelector('#navMenu');

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
}

const carousel = document.querySelector('[data-carousel]');

if (carousel) {
  const slides = [...carousel.querySelectorAll('.hero-slide')];
  let activeSlide = 0;

  function showSlide(index) {
    slides[activeSlide].classList.remove('active');
    activeSlide = (index + slides.length) % slides.length;
    slides[activeSlide].classList.add('active');
  }

  carousel.querySelectorAll('[data-slide]').forEach(button => {
    button.addEventListener('click', () => {
      showSlide(activeSlide + (button.dataset.slide === 'next' ? 1 : -1));
    });
  });

  if (slides.length > 1) {
    window.setInterval(() => showSlide(activeSlide + 1), 6000);
  }
}

document.querySelectorAll('[data-open]').forEach(button => {
  button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.open);
    if (dialog) dialog.showModal();
  });
});

document.querySelectorAll('dialog[data-auto-open="true"]').forEach(dialog => {
  dialog.showModal();
});

document.querySelectorAll('[data-expand]').forEach(button => {
  button.addEventListener('click', () => {
    const dialog = button.closest('dialog');
    const extra = dialog.querySelector('.details-extra');
    const open = extra.hidden;
    extra.hidden = !open;
    dialog.classList.toggle('large', open);
    button.textContent = open ? 'Show less' : 'More details';
  });
});

const visitLinks = [...document.querySelectorAll('.nav-link[href*="#getting-here"], .nav-link[href*="#contact"]')];

function highlightVisitLink() {
  if (!visitLinks.length) return;
  const contact = window.location.hash === '#contact' || window.location.search.includes('section=contact');
  visitLinks.forEach(link => link.classList.remove('active'));
  const active = visitLinks.find(link => contact ? link.href.includes('#contact') : link.href.includes('#getting-here'));
  if (active) active.classList.add('active');
}

const isVisitPage = window.location.pathname.toLowerCase().endsWith('/visit.php');

if (visitLinks.length && isVisitPage) {
  highlightVisitLink();
  window.addEventListener('hashchange', highlightVisitLink);
}

const curtainPage = document.querySelector('.curtain-page');

if (curtainPage) {
  const screen = curtainPage.querySelector('.curtain-screen');
  const left = screen.querySelector('.curtain-left');
  const right = screen.querySelector('.curtain-right');

  function openCurtain() {
    if (left.animate && right.animate) {
      const movement = {
        duration: 1800,
        easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
        fill: 'forwards'
      };
      const leftMove = left.animate(
        [{ transform: 'translateX(0)' }, { transform: 'translateX(-102%)' }],
        movement
      );
      const rightMove = right.animate(
        [{ transform: 'translateX(0)' }, { transform: 'translateX(102%)' }],
        movement
      );
      Promise.all([leftMove.finished, rightMove.finished]).then(() => screen.remove());
      window.setTimeout(() => screen.remove(), 2400);
    } else {
      curtainPage.classList.add('curtain-open');
      window.setTimeout(() => screen.remove(), 2400);
    }
  }

  window.requestAnimationFrame(() => window.requestAnimationFrame(openCurtain));
}