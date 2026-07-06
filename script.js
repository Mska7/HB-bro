document.addEventListener('DOMContentLoaded', () => {
  const partyBtn = document.getElementById('partyBtn');
  const okBtn = document.getElementById('okBtn');
  const modalOk = document.getElementById('modalOk');
  const modal = document.getElementById('modal');
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  const desktopIcons = document.querySelectorAll('.desktop-icon');
  const mainWindow = document.querySelector('.main-window');
  const mainCloseBtn = document.getElementById('mainCloseBtn');
  const greetingIcon = document.getElementById('greetingIcon');

  // Модальные окна иконок рабочего стола
  const iconModals = {
    tv: document.getElementById('modal-tv'),
    makeup: document.getElementById('modal-makeup'),
    clapper: document.getElementById('modal-clapper')
  };

  let confettiActive = false;
  let festiveMode = false;
  let animationId = null;
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function randomColor() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff69b4', '#8a2be2'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: -20,
      size: Math.random() * 8 + 4,
      color: randomColor(),
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 4 - 2,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 8 - 4
    };
  }

  function initConfetti(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }
  }

  function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });
  }

  function updateConfetti() {
    particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }

      if (p.x > canvas.width + 20) {
        p.x = -20;
      } else if (p.x < -20) {
        p.x = canvas.width + 20;
      }
    });
  }

  function loop() {
    if (!confettiActive) return;
    drawConfetti();
    updateConfetti();
    animationId = requestAnimationFrame(loop);
  }

  function startConfetti() {
    if (confettiActive) return;
    confettiActive = true;
    initConfetti(150);
    loop();
  }

  function stopConfetti() {
    confettiActive = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = [];
  }

  function closeModal() {
    modal.style.display = 'none';
  }

  function openModal() {
    // При открытии праздничного окна закрываем окна иконок
    Object.values(iconModals).forEach((m) => {
      if (m) m.style.display = 'none';
    });
    modal.style.display = 'block';
  }

  function openIconModal(modalEl) {
    if (!modalEl) return;
    // Закрываем праздничное окно
    closeModal();
    // Закрываем все остальные окна иконок
    Object.values(iconModals).forEach((m) => {
      if (m && m !== modalEl) m.style.display = 'none';
    });
    modalEl.style.display = 'block';
  }

  function closeIconModal(modalEl) {
    if (modalEl) modalEl.style.display = 'none';
  }

  function toggleFestiveIcons() {
    festiveMode = !festiveMode;
    desktopIcons.forEach((icon) => {
      icon.classList.toggle('festive', festiveMode);
    });
    partyBtn.textContent = festiveMode
      ? 'Выключить праздничный режим'
      : 'Включить праздничный режим';
  }

  partyBtn.addEventListener('click', () => {
    toggleFestiveIcons();
    startConfetti();
    openModal();
  });

  okBtn.addEventListener('click', () => {
    if (mainWindow) mainWindow.style.display = 'none';
  });

  modalOk.addEventListener('click', () => {
    closeModal();
  });

  // Закрытие основного окна поздравления
  if (mainCloseBtn && mainWindow) {
    mainCloseBtn.addEventListener('click', () => {
      mainWindow.style.display = 'none';
    });
  }

  // Открытие основного окна поздравления с рабочего стола
  if (greetingIcon && mainWindow) {
    greetingIcon.addEventListener('click', () => {
      mainWindow.style.display = 'block';
    });
  }

  // Открытие окон по клику на иконки рабочего стола
  desktopIcons.forEach((icon) => {
    icon.addEventListener('click', () => {
      const key = icon.dataset.icon;
      if (iconModals[key]) {
        openIconModal(iconModals[key]);
      }
    });
  });

  // Закрытие окон иконок по кнопкам OK и ×
  Object.keys(iconModals).forEach((key) => {
    const modalEl = iconModals[key];
    if (!modalEl) return;

    const okBtn = document.getElementById(`modal-${key}-ok`);
    const closeBtn = document.getElementById(`modal-${key}-close`);

    if (okBtn) {
      okBtn.addEventListener('click', () => closeIconModal(modalEl));
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeIconModal(modalEl));
    }
  });

  // Модальное окно скрыто по умолчанию через CSS
});
