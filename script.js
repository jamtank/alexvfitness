/* ==========================================================================
   Personal Trainer Website - Shared Scripts
   - Mobile menu toggle
   - FAQ accordion
   - Transformations filter
   - Contact form validation
   - Footer year
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initFAQ();
    initTransformationsFilter();
    initContactForm();
    initFooterYear();
  });

  /* -------- Mobile Menu Toggle -------- */
  function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      const isOpen = menu.classList.toggle('active');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when clicking a link
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        menu.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* -------- FAQ Accordion -------- */
  function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      const question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');

        // Close all
        items.forEach(function (other) {
          other.classList.remove('open');
          const q = other.querySelector('.faq-question');
          if (q) q.setAttribute('aria-expanded', 'false');
        });

        // Open clicked (if it wasn't open)
        if (!isOpen) {
          item.classList.add('open');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* -------- Transformations Filter -------- */
  function initTransformationsFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.transformation-card');
    const grid = document.querySelector('.transformations-grid');
    if (!filterBtns.length || !cards.length) return;

    let noResultsEl = grid ? grid.querySelector('.no-results') : null;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const goal = btn.getAttribute('data-filter');

        // Active state
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        let visibleCount = 0;
        cards.forEach(function (card) {
          const cardGoal = card.getAttribute('data-goal');
          const matches = goal === 'all' || cardGoal === goal;
          card.classList.toggle('hidden', !matches);
          if (matches) visibleCount++;
        });

        // Toggle "no results" message
        if (grid) {
          if (visibleCount === 0) {
            if (!noResultsEl) {
              noResultsEl = document.createElement('div');
              noResultsEl.className = 'no-results';
              noResultsEl.textContent = 'Aún no hay transformaciones que coincidan con este filtro — vuelve pronto.';
              grid.appendChild(noResultsEl);
            }
            noResultsEl.style.display = 'block';
          } else if (noResultsEl) {
            noResultsEl.style.display = 'none';
          }
        }
      });
    });
  }

  /* -------- Contact Form Validation -------- */
  function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const successEl = form.querySelector('.form-success');
    const fields = form.querySelectorAll('[data-validate]');

    // Per-field validation rules
    const validators = {
      required: function (value) {
        return value.trim().length > 0 || 'Este campo es obligatorio.';
      },
      email: function (value) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(value.trim()) || 'Por favor, ingresa una dirección de correo electrónico válida.';
      },
      phone: function (value) {
        // Accept digits, spaces, dashes, parens, plus; require >= 7 digits
        const digits = value.replace(/\D/g, '');
        return digits.length >= 7 || 'Por favor, ingresa un número de teléfono válido.';
      }
    };

    function validateField(field) {
      const rules = (field.getAttribute('data-validate') || '').split(',').map(function (s) { return s.trim(); });
      const value = field.value || '';
      const errorEl = field.parentElement.querySelector('.form-error');

      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (!rule || !validators[rule]) continue;
        const result = validators[rule](value);
        if (result !== true) {
          if (errorEl) errorEl.textContent = result;
          field.classList.add('invalid');
          field.setAttribute('aria-invalid', 'true');
          return false;
        }
      }

      if (errorEl) errorEl.textContent = '';
      field.classList.remove('invalid');
      field.removeAttribute('aria-invalid');
      return true;
    }

    fields.forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
      field.addEventListener('input', function () {
        if (field.classList.contains('invalid')) validateField(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      let allValid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) allValid = false;
      });

      if (!allValid) {
        // Scroll to first invalid field
        const firstInvalid = form.querySelector('.invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Simulate submit success (no backend in static site)
      if (successEl) {
        successEl.classList.add('visible');
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();

      // Auto-hide success after a while
      setTimeout(function () {
        if (successEl) successEl.classList.remove('visible');
      }, 8000);
    });
  }

  /* -------- Footer year -------- */
  function initFooterYear() {
    const el = document.querySelector('.footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }
})();
