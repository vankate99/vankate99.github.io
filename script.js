// ==========================================
// Dr. Vandana Kate - Portfolio Interactions
// ==========================================

// ==========================================
// 1. INTERSECTION OBSERVER - Scroll Animations
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
  
  // Select all sections with data-aos attribute
  const animatedElements = document.querySelectorAll('[data-aos]');
  
  // Create Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-visible');
        // Optional: Uncomment to stop observing after animation
        // observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observe each element
  animatedElements.forEach(el => {
    observer.observe(el);
    // Add initial hidden state
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  });
  
  // Add visible class when element appears
  // This will be handled by the observer callback
  
  // Override the observer callback to add animation
  const enhancedObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        // Add staggered delay for child elements
        const children = entry.target.querySelectorAll('li, .patent-item, .book-item, .pub-item, .experience-item');
        children.forEach((child, index) => {
          child.style.opacity = '0';
          child.style.transform = 'translateY(15px)';
          child.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, 100 + (index * 50));
        });
        enhancedObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Re-observe with enhanced observer
  animatedElements.forEach(el => {
    enhancedObserver.observe(el);
  });

  // ==========================================
  // 2. BACK TO TOP BUTTON
  // ==========================================
  
  const backToTopBtn = document.getElementById('backToTop');
  
  if (backToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    
    // Smooth scroll to top
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 3. FOOTER YEAR AUTO-UPDATE
  // ==========================================
  
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = ' · ' + new Date().getFullYear();
  }

  // ==========================================
  // 4. CONTACT ITEM CLICK TO COPY
  // ==========================================
  
  const contactItems = document.querySelectorAll('.contact-item');
  contactItems.forEach(item => {
    item.addEventListener('click', function(e) {
      // Get text content (remove emoji and icon)
      let text = this.textContent.trim();
      // Remove emoji characters (simple approach)
      text = text.replace(/[^\w\s@.\-+()]/g, '').trim();
      
      // Only copy if it's email or phone
      if (text.includes('@') || text.match(/[\d]{10,}/)) {
        navigator.clipboard.writeText(text).then(() => {
          showToast('📋 Copied: ' + text);
        }).catch(() => {
          // Fallback for older browsers
          const input = document.createElement('input');
          input.value = text;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          document.body.removeChild(input);
          showToast('📋 Copied: ' + text);
        });
      }
    });
  });

  // ==========================================
  // 5. TOAST NOTIFICATION SYSTEM
  // ==========================================
  
  function showToast(message) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
      existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: #1e293b;
      color: white;
      padding: 12px 24px;
      border-radius: 12px;
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      box-shadow: 0 8px 30px rgba(0,0,0,0.2);
      z-index: 1000;
      opacity: 0;
      transition: all 0.4s ease;
      pointer-events: none;
      max-width: 90%;
    `;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    // Auto dismiss after 2.5 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 2500);
  }

  // ==========================================
  // 6. SECTION COUNTER ANIMATION
  // ==========================================
  
  // Animate numbers in count badges
  const countBadges = document.querySelectorAll('.count-badge');
  countBadges.forEach(badge => {
    const text = badge.textContent;
    const number = parseInt(text);
    if (!isNaN(number)) {
      let current = 0;
      const target = number;
      const increment = Math.ceil(target / 30);
      const duration = 1000;
      const stepTime = duration / 30;
      
      // Only animate if visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const interval = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(interval);
              }
              badge.textContent = current + '+';
            }, stepTime);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(badge);
    }
  });

  // ==========================================
  // 7. KEYBOARD NAVIGATION (Accessibility)
  // ==========================================
  
  // Add keyboard support for cards
  document.querySelectorAll('.card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // ==========================================
  // 8. SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // ==========================================
  // 9. CONSOLE WELCOME MESSAGE
  // ==========================================
  
  console.log('%c Dr. Vandana Kate %c Portfolio ',
    'background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 10px 20px; border-radius: 8px 0 0 8px; font-size: 18px; font-weight: bold;',
    'background: #1e293b; color: white; padding: 10px 20px; border-radius: 0 8px 8px 0; font-size: 18px;'
  );
  console.log('%c📧 vandanakate@acropolis.in | 📞 +91 98260 70064', 'color: #475569; font-size: 14px;');

  console.log('✨ Portfolio loaded successfully!');

  // ==========================================
  // 10. PAGE VISIBILITY - Refresh on focus
  // ==========================================
  
  // Optional: Reload data when user returns to tab
  // document.addEventListener('visibilitychange', function() {
  //   if (!document.hidden) {
  //     // Refresh dynamic content if needed
  //   }
  // });

  console.log('✅ All interactions initialized!');
});
