// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// FAQ Accordion Logic
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    
    // Close all items
    faqItems.forEach(i => i.classList.remove('active'));
    
    // Open clicked item if it wasn't active
    if (!isActive) {
      item.classList.add('active');
    }
  });
});

// Intersection Observer for scroll animations (fade-in-up)
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optional: Stop observing once visible if you only want it to animate once
      // observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all elements with the fade-in-up class
const animatedElements = document.querySelectorAll('.fade-in-up');
animatedElements.forEach(el => observer.observe(el));
