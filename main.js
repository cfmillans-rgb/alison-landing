// 1. Hero Title Blur Reveal
const heroTitle = document.getElementById('hero-title');
if (heroTitle) {
  const text = heroTitle.innerText;
  heroTitle.innerHTML = '';
  // Split into characters, keeping spaces intact
  text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.innerText = char === ' ' ? '\u00A0' : char;
    // Staggered animation delay
    span.style.animationDelay = `${0.3 + (i * 0.05)}s`;
    heroTitle.appendChild(span);
  });
}

// 2. Gold Particles System (Canvas)
const canvas = document.getElementById('gold-particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 200;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedY = Math.random() * -0.5 - 0.2;
      this.speedX = (Math.random() - 0.5) * 0.5;
      // Old gold RGB: 201, 169, 110
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      if (this.y < -10) {
        this.y = canvas.height + 10;
        this.x = Math.random() * canvas.width;
      }
    }
    draw() {
      ctx.fillStyle = `rgba(201, 169, 110, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Create limited amount of particles for performance
  for (let i = 0; i < 40; i++) {
    particles.push(new Particle());
  }

  const animateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  };
  animateParticles();
}

// 3. Custom Cursor Tracking (Difference Mode)
const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', (e) => {
  if(cursor) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  }
});

const hoverElements = document.querySelectorAll('a, button, .hover-levitate, .ba-handle-diamond, .custom-checkbox-container');
hoverElements.forEach(el => {
  el.addEventListener('mouseenter', () => cursor && cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hover'));
});

// 4. Scalpel Lines & Fade-in Animations (Intersection Observer)
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // If it's a scalpel line container, find the line inside and draw it
      if (entry.target.classList.contains('scalpel-line-container')) {
        const line = entry.target.querySelector('.scalpel-line');
        if (line) line.classList.add('drawn');
      }
    }
  });
}, observerOptions);

const animatedElements = document.querySelectorAll('.fade-in-up, .scalpel-line-container');
animatedElements.forEach(el => observer.observe(el));

// 5. Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
});

// 6. Animated Statistics (Counters) & Underlines
const counterElements = document.querySelectorAll('.counter');
let hasCounted = false;

const counterObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !hasCounted) {
    hasCounted = true;
    
    // Animate numbers
    counterElements.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const increment = target / 100; // Fixed steps
      let current = 0;
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.innerText = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.innerText = target;
        }
      };
      updateCounter();
    });

    // Animate stat underlines
    document.querySelectorAll('.stat-underline').forEach(line => {
      line.classList.add('drawn');
    });
  }
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if(statsSection) counterObserver.observe(statsSection);

// 7. Before/After Slider Logic
const slider = document.querySelector('.ba-slider');
const overlay = document.querySelector('.ba-overlay');
const handle = document.querySelector('.ba-handle');

if (slider && overlay && handle) {
  let isDragging = false;
  const moveSlider = (clientX) => {
    const rect = slider.getBoundingClientRect();
    let x = clientX - rect.left;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;
    const percentage = (x / rect.width) * 100;
    overlay.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  };

  handle.addEventListener('mousedown', () => isDragging = true);
  window.addEventListener('mouseup', () => isDragging = false);
  window.addEventListener('mousemove', (e) => { if (isDragging) moveSlider(e.clientX); });

  handle.addEventListener('touchstart', () => isDragging = true);
  window.addEventListener('touchend', () => isDragging = false);
  window.addEventListener('touchmove', (e) => {
    if (isDragging) { moveSlider(e.touches[0].clientX); e.preventDefault(); }
  }, { passive: false });
}

// 8. Masonry Gallery Filters
const filterBtns = document.querySelectorAll('.filter-btn');
const masonryItems = document.querySelectorAll('.masonry-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filterValue = btn.getAttribute('data-filter');

    masonryItems.forEach(item => {
      if (filterValue === 'all' || item.classList.contains(filterValue)) {
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 50);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        setTimeout(() => item.style.display = 'none', 300);
      }
    });
  });
});

// 9. Investment Calculator Logic
const calcTreatment = document.getElementById('calc-treatment');
const calcExtras = document.querySelectorAll('.calc-extra');
const calcTotal = document.getElementById('calc-total');

const calculateTotal = () => {
  let total = parseInt(calcTreatment.value) || 0;
  calcExtras.forEach(extra => { if (extra.checked) total += parseInt(extra.value) || 0; });
  calcTotal.innerText = total.toLocaleString('es-CL');
};

if (calcTreatment && calcTotal) {
  calcTreatment.addEventListener('change', calculateTotal);
  calcExtras.forEach(extra => extra.addEventListener('change', calculateTotal));
}
