// 1. Custom Cursor Logic (Easter Egg)
const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', (e) => {
  if(cursor) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  }
});

// Hover effects for cursor
const hoverElements = document.querySelectorAll('a, button, .hover-glow, .ba-handle-button, .calc-input, .calc-extra, .map-pin');
hoverElements.forEach(el => {
  el.addEventListener('mouseenter', () => cursor && cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hover'));
});

// 2. Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// 3. Intersection Observer (Fade-in-up animations)
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

const animatedElements = document.querySelectorAll('.fade-in-up');
animatedElements.forEach(el => observer.observe(el));

// 4. Animated Statistics (Counters)
const counterElements = document.querySelectorAll('.counter');
let hasCounted = false;

const counterObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !hasCounted) {
    hasCounted = true;
    counterElements.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      
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
  }
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if(statsSection) counterObserver.observe(statsSection);

// 5. Before/After Slider Logic
const slider = document.querySelector('.ba-slider');
const overlay = document.querySelector('.ba-overlay');
const handle = document.querySelector('.ba-handle');

if (slider && overlay && handle) {
  let isDragging = false;

  const moveSlider = (clientX) => {
    const rect = slider.getBoundingClientRect();
    let x = clientX - rect.left;
    // Bounds
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;
    
    const percentage = (x / rect.width) * 100;
    overlay.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  };

  // Mouse Events
  handle.addEventListener('mousedown', () => isDragging = true);
  window.addEventListener('mouseup', () => isDragging = false);
  window.addEventListener('mousemove', (e) => {
    if (isDragging) moveSlider(e.clientX);
  });

  // Touch Events
  handle.addEventListener('touchstart', () => isDragging = true);
  window.addEventListener('touchend', () => isDragging = false);
  window.addEventListener('touchmove', (e) => {
    if (isDragging) {
      moveSlider(e.touches[0].clientX);
      // Prevent scrolling while sliding
      e.preventDefault(); 
    }
  }, { passive: false });
}

// 6. Masonry Gallery Filters
const filterBtns = document.querySelectorAll('.filter-btn');
const masonryItems = document.querySelectorAll('.masonry-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    filterBtns.forEach(b => b.classList.remove('active'));
    // Add to clicked button
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
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
  });
});

// 7. Investment Calculator Logic
const calcTreatment = document.getElementById('calc-treatment');
const calcExtras = document.querySelectorAll('.calc-extra');
const calcTotal = document.getElementById('calc-total');

const calculateTotal = () => {
  let total = parseInt(calcTreatment.value) || 0;
  
  calcExtras.forEach(extra => {
    if (extra.checked) {
      total += parseInt(extra.value) || 0;
    }
  });

  // Format to Chilean Pesos (or standard number with dots)
  calcTotal.innerText = total.toLocaleString('es-CL');
};

if (calcTreatment && calcTotal) {
  calcTreatment.addEventListener('change', calculateTotal);
  calcExtras.forEach(extra => extra.addEventListener('change', calculateTotal));
}
