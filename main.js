// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Intersection Observer for Scroll Animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // If it's the counter, animate it
      if (entry.target.classList.contains('counter') && !entry.target.classList.contains('counted')) {
        animateCounter(entry.target);
        entry.target.classList.add('counted');
      }
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all fade-up elements
document.querySelectorAll('.animate-fade-up, .card-float').forEach(el => {
  // If we don't already have animate-fade-up, add it
  if(!el.classList.contains('animate-fade-up') && el.classList.contains('card-float')) {
      el.classList.add('animate-fade-up');
  }
  observer.observe(el);
});

// Observe counter
document.querySelectorAll('.counter').forEach(el => {
  observer.observe(el);
});

// Counter Animation Function
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000; // 2 seconds
  const step = target / (duration / 16); // 60fps
  let current = 0;

  const updateCounter = () => {
    current += step;
    if (current < target) {
      el.innerText = Math.ceil(current);
      requestAnimationFrame(updateCounter);
    } else {
      el.innerText = target;
    }
  };
  
  updateCounter();
}

// Smooth Scroll for Quiz Buttons
document.querySelectorAll('.quiz-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const targetId = btn.getAttribute('data-target');
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      // Get height of fixed navbar
      const navbarHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight - 20; // 20px padding
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Add a subtle highlight effect to the target card
      if (targetEl.classList.contains('card')) {
        setTimeout(() => {
          targetEl.style.transform = 'scale(1.02)';
          targetEl.style.boxShadow = '0 0 20px rgba(194, 164, 141, 0.5)';
          setTimeout(() => {
            targetEl.style.transform = '';
            targetEl.style.boxShadow = '';
          }, 1000);
        }, 800);
      }
    }
  });
});

// Smooth Scroll for Navbar Links
document.querySelectorAll('.nav-links a, .btn-secondary').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    if (this.getAttribute('href').startsWith('#')) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});

// Parallax Effect
window.addEventListener('scroll', () => {
  const parallaxBg = document.querySelector('.parallax-bg img');
  if (parallaxBg) {
    const scrolled = window.scrollY;
    // Adjust speed by multiplying scrolled by a small decimal
    parallaxBg.style.transform = `translateY(${scrolled * 0.15}px)`;
  }
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all others
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Toggle current
    if (!isActive) {
      faqItem.classList.add('active');
    }
  });
});
