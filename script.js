document.addEventListener('DOMContentLoaded', () => {
  const partyBtn = document.getElementById('partyBtn');
  const okBtn = document.getElementById('okBtn');
  const modalOk = document.getElementById('modalOk');
  const modal = document.getElementById('modal');
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');

  let confettiActive = false;
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
    modal.style.display = 'block';
  }

  partyBtn.addEventListener('click', () => {
    startConfetti();
    openModal();
  });

  okBtn.addEventListener('click', () => {
    closeModal();
  });

  modalOk.addEventListener('click', () => {
    closeModal();
  });

  // Модальное окно скрыто по умолчанию через CSS
});
