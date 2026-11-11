'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  const year = document.getElementById('current-year');
  const contactForm = document.getElementById('contact-form');
  const messageField = document.getElementById('contact-message');
  const feedback = document.getElementById('form-feedback');

  if (year) year.textContent = new Date().getFullYear();

  const closeMenu = () => {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
    mainNav.classList.remove('is-open');
  };

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isExpanded));
      menuToggle.setAttribute('aria-label', isExpanded ? 'Abrir menú' : 'Cerrar menú');
      mainNav.classList.toggle('is-open', !isExpanded);
    });

    navLinks.forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', (event) => {
      const clickedInsideMenu = mainNav.contains(event.target) || menuToggle.contains(event.target);
      if (!clickedInsideMenu) closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 720) closeMenu();
    });
  }

  const updateHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  document.querySelectorAll('.plan-button').forEach((button) => {
    button.addEventListener('click', () => {
      const planName = button.dataset.plan;
      if (messageField && planName) {
        messageField.value = `Estoy interesado(a) en conocer más sobre el plan ${planName} de MiGranja.`;
      }
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      const formData = new FormData(contactForm);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const message = String(formData.get('message') || '').trim();
      const subject = encodeURIComponent(`Consulta sobre MiGranja - ${name}`);
      const body = encodeURIComponent(
        `Nombre: ${name}\nCorreo: ${email}\n\nConsulta:\n${message || 'Deseo recibir información sobre MiGranja.'}`
      );

      if (feedback) feedback.textContent = 'Se abrirá tu aplicación de correo para completar el envío.';
      window.location.href = `mailto:info@migranja.com?subject=${subject}&body=${body}`;
    });
  }

  const navigationSections = [
    { element: document.querySelector('.hero-section'), target: '#inicio' },
    { element: document.getElementById('servicios'), target: '#servicios' },
    { element: document.getElementById('planes'), target: '#planes' },
    { element: document.getElementById('nosotros'), target: '#nosotros' },
    { element: document.getElementById('contacto'), target: '#contacto' }
  ].filter((item) => item.element);

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const currentTarget = navigationSections.find((item) => item.element === entry.target)?.target;
        if (!currentTarget) return;
        document.querySelectorAll('.nav-link').forEach((link) => {
          const isCurrent = link.getAttribute('href') === currentTarget;
          link.classList.toggle('active', isCurrent);
          if (isCurrent) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });

    navigationSections.forEach((item) => sectionObserver.observe(item.element));
  }
});
