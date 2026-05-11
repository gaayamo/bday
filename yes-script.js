// ────────────────────────────────────────────────
//  yes-script.js  —  Birthday celebration page
// ────────────────────────────────────────────────

let musicPlaying = false;

// ── Music toggle ──
function toggleMusic() {
  const music = document.getElementById("bg-music");
  const btn   = document.getElementById("music-toggle");
  if (musicPlaying) {
    music.pause();
    musicPlaying = false;
    btn.textContent = "🔇";
  } else {
    music.muted = false;
    music.play().catch(() => {});
    musicPlaying = true;
    btn.textContent = "🔊";
  }
}

// ── Auto-play music on first interaction ──
document.addEventListener("click", () => {
  const music = document.getElementById("bg-music");
  if (!musicPlaying && music.paused) {
    music.muted = false;
    music.play().then(() => {
      musicPlaying = true;
      document.getElementById("music-toggle").textContent = "🔊";
    }).catch(() => {});
  }
}, { once: true });

// ── Confetti ──
(function initConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx    = canvas.getContext("2d");

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const colors = [
    "#ffd700", "#ff6b9d", "#c49bff", "#5ee7df",
    "#f7971e", "#fff", "#b8f0a0", "#ff9f7f",
  ];

  const pieces = Array.from({ length: 200 }, () => ({
    x:      Math.random() * canvas.width,
    y:      Math.random() * canvas.height - canvas.height,
    r:      Math.random() * 8 + 4,
    color:  colors[Math.floor(Math.random() * colors.length)],
    vx:     (Math.random() - 0.5) * 4,
    vy:     Math.random() * 4 + 2,
    angle:  Math.random() * Math.PI * 2,
    spin:   (Math.random() - 0.5) * 0.2,
    shape:  Math.random() < 0.5 ? "rect" : "circle",
  }));

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
      p.x     += p.vx;
      p.y     += p.vy;
      p.angle += p.spin;
      p.vy    += 0.05; // gravity

      if (p.y > canvas.height) {
        p.y  = -20;
        p.x  = Math.random() * canvas.width;
        p.vy = Math.random() * 4 + 2;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.85;

      if (p.shape === "rect") {
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.r / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    frame++;
    // Stop dense confetti after 5 seconds, keep a few floating
    if (frame < 300 || Math.random() < 0.3) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  draw();
})();

// ── Staggered reveal: header → gift card → coupons → PS note ──
window.addEventListener("DOMContentLoaded", () => {

  const header     = document.getElementById("celebrate-header");
  const cardWrapper = document.getElementById("gift-card-wrapper");
  const coupons    = document.querySelectorAll(".coupon");
  const psNote     = document.getElementById("ps-note");

  // 1. Header fades in immediately (CSS handles initial state)
  setTimeout(() => {
    header.classList.add("visible");
  }, 300);

  // 2. Gift card slides up
  setTimeout(() => {
    cardWrapper.classList.add("visible");
  }, 1400);

  // 3. Each coupon pops in with a stagger
  coupons.forEach((c, i) => {
    setTimeout(() => {
      c.classList.add("visible");
    }, 2200 + i * 200);
  });

  // 4. P.S. note fades in last
  setTimeout(() => {
    psNote.classList.add("visible");
  }, 2200 + coupons.length * 200 + 400);

});
