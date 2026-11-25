(() => {
  const app = () => window.MiGranjaApp;
  const shell = document.getElementById('app-shell');
  const siteBar = document.getElementById('site-bar');
  const menuToggle = document.getElementById('menu-toggle');
  const menuBackdrop = document.getElementById('menu-backdrop');
  let toastTimer;
  function closeMenu() {
    siteBar.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
    menuBackdrop.hidden = true;
  }
  function toast(message) {
    shell.querySelector('.toast')?.remove();
    const element = document.createElement('div');
    element.className = 'toast';
    element.role = 'status';
    element.textContent = message;
    shell.append(element);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.remove(), 3200);
  }
  document.addEventListener('input', event => {
    if (!event.target.matches('[data-search-input]')) return;
    const screen = event.target.closest('.screen');
    const list = screen?.querySelector('[data-search-list]');
    if (!list) return;
    const query = event.target.value.trim().toLocaleLowerCase('es');
    const items = [...list.querySelectorAll(':scope > .list-row, :scope > .check-line, :scope > .search-group')];
    let visible = 0;
    items.forEach(item => {
      item.hidden = !item.textContent.toLocaleLowerCase('es').includes(query);
      if (!item.hidden) visible++;
    });
    let empty = screen.querySelector('.search-empty');
    if (!empty) {
      empty = document.createElement('p');
      empty.className = 'search-empty muted';
      empty.textContent = 'No se encontraron resultados.';
      list.insertAdjacentElement('afterend', empty);
    }
    empty.hidden = visible !== 0;
    const summary = screen.querySelector('[data-search-summary]');
    if (summary) summary.textContent = query ? `Coincidencias para “${event.target.value.trim()}”` : 'Todos los resultados de ejemplo';
  });
  document.addEventListener('change', event => {
    if (!event.target.matches('[data-search-list] input[type="checkbox"]')) return;
    const screen = event.target.closest('.screen');
    const count = screen?.querySelector('[data-selected-count]');
    if (count) count.textContent = screen.querySelectorAll('[data-search-list] input[type="checkbox"]:checked').length;
  });
  document.addEventListener('click', event => {
    if (event.target.closest('#menu-toggle')) {
      const opening = !siteBar.classList.contains('menu-open');
      siteBar.classList.toggle('menu-open', opening);
      menuToggle.setAttribute('aria-expanded', String(opening));
      menuToggle.setAttribute('aria-label', opening ? 'Cerrar menú' : 'Abrir menú');
      menuBackdrop.hidden = !opening;
      return;
    }
    if (event.target.closest('#menu-backdrop')) {
      closeMenu();
      menuToggle.focus();
      return;
    }
    const routeTarget = event.target.closest('[data-route]');
    if (routeTarget) {
      event.preventDefault();
      app().go(routeTarget.dataset.route);
      return;
    }
    const toggle = event.target.closest('[data-toggle-group]');
    if (toggle) {
      const group = toggle.dataset.toggleGroup;
      document.querySelectorAll(`[data-toggle-group="${group}"]`).forEach(item => {
        item.setAttribute('aria-pressed', String(item === toggle));
        item.classList.toggle('is-active', item === toggle);
      });
    }
    const action = event.target.closest('[data-action]');
    if (!action) return;
    switch (action.dataset.action) {
      case 'toast': toast(action.dataset.message || 'Acción registrada en el mockup'); break;
      case 'print': window.print(); break;
      case 'share':
        if (navigator.share) navigator.share({ title: 'MiGranja · Reporte semanal', url: location.href }).catch(() => {});
        else toast('El reporte está listo para compartir');
        break;
      case 'logout':
        sessionStorage.removeItem('migranja-mock-session');
        app().go('cuenta/iniciar-sesion');
        break;
      case 'reset': action.closest('form')?.reset(); toast('Filtros limpiados'); break;
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && siteBar.classList.contains('menu-open')) {
      closeMenu();
      menuToggle.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) closeMenu();
  });
  document.addEventListener('submit', event => {
    const form = event.target;
    if (!form.matches('[data-next]')) return;
    event.preventDefault();
    if (!form.reportValidity()) return;
    const next = form.dataset.next;
    if (app().route === 'cuenta/iniciar-sesion') sessionStorage.setItem('migranja-mock-session', 'demo');
    app().go(next).then(() => {
      if (form.dataset.message) toast(form.dataset.message);
    });
  });
  document.addEventListener('migranja:screen', () => shell.querySelector('.toast')?.remove());
})();
