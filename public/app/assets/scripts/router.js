(() => {
  const routes = {
    'cuenta/iniciar-sesion': ['Iniciar sesión', 'auth'],
    'cuenta/registrar-usuario': ['Registro de cuenta', 'legacy'],
    'cuenta/registrar-granja': ['Registro de cuenta', 'legacy'],
    'cuenta/seleccionar-plan': ['Nuestros planes', 'legacy'],
    'cuenta/confirmar-registro': ['', 'legacy'],
    'cuenta/recuperar-contrasena': ['', 'legacy'],
    'cuenta/validar-codigo': ['', 'legacy'],
    'cuenta/nueva-contrasena': ['', 'legacy'],
    'cuenta/contrasena-restablecida': ['', 'legacy'],
    'cuenta/perfil': ['Mi perfil', 'modern'],
    'cuenta/editar-perfil': ['Editar perfil', 'modern'],
    'cuenta/mi-plan': ['Mi plan', 'modern'],
    'cuenta/cambiar-plan': ['Cambiar plan', 'modern'],
    'cuenta/configuracion': ['Configuración', 'modern'],
    'cuenta/cerrar-sesion': ['Cerrar sesión', 'modern'],
    'inicio/resumen': ['', 'home'],
    'inicio/acciones': ['Nuevo registro', 'modern'],
    'inicio/alertas': ['Alertas', 'modern'],
    'inicio/alertas-altas': ['Alertas', 'modern'],
    'inicio/alertas-vacunas': ['Alertas', 'modern'],
    'inicio/detalle-alerta': ['Detalle de alerta', 'modern'],
    'animales/listado': ['Lista de animales', 'legacy-tab'],
    'animales/filtrar': ['Filtrar ganado', 'legacy'],
    'animales/detalle': ['BOV-001', 'legacy'],
    'animales/registrar': ['Registrar animal', 'legacy'],
    'animales/editar': ['Editar animal', 'legacy'],
    'animales/dar-de-baja': ['Estado del animal', 'legacy'],
    'lotes/listado': ['Lotes', 'legacy-tab'],
    'lotes/detalle': ['Lote Norte', 'legacy'],
    'lotes/crear': ['Nuevo lote', 'legacy'],
    'lotes/asignar-animales': ['Asignar a Lote Norte', 'legacy'],
    'lotes/editar': ['Editar lote', 'legacy'],
    'alimentacion/listado': ['Alimentación', 'legacy-tab'],
    'alimentacion/registrar': ['Registrar alimentación', 'modern'],
    'alimentacion/detalle': ['Detalle alimentación', 'modern'],
    'alimentacion/editar': ['Editar alimentación', 'modern'],
    'vacunacion/listado': ['Vacunaciones', 'modern-tab'],
    'vacunacion/registrar': ['Registrar vacunación', 'modern'],
    'vacunacion/detalle': ['Detalle vacuna', 'modern'],
    'vacunacion/editar': ['Editar vacunación', 'modern'],
    'vacunacion/proximas': ['Próximas vacunaciones', 'modern'],
    'manejo/ubicaciones': ['Ubicaciones', 'modern-tab'],
    'manejo/detalle-ubicacion': ['Corral 2', 'modern'],
    'manejo/movimientos': ['Movimientos', 'modern'],
    'manejo/registrar-movimiento': ['Nuevo movimiento', 'modern'],
    'manejo/detalle-movimiento': ['Detalle movimiento', 'modern'],
    'historial/buscar': ['Historial', 'modern'],
    'historial/animal': ['Historial BOV-001', 'modern'],
    'historial/filtrar': ['Filtrar historial', 'modern'],
    'historial/lote': ['Historial Lote Norte', 'modern'],
    'reportes/resumen-operativo': ['Resumen de granja', 'modern'],
    'reportes/generar': ['Nuevo reporte', 'modern'],
    'reportes/reporte-generado': ['Reporte semanal', 'modern'],
    'reportes/buscar': ['Buscar', 'modern']
  };
  const root = document.getElementById('screen-root');
  const header = document.getElementById('app-header');
  const siteBar = document.getElementById('site-bar');
  const bottomNav = document.getElementById('bottom-nav');
  const menu = document.getElementById('main-nav');
  const menuToggle = document.getElementById('menu-toggle');
  const menuBackdrop = document.getElementById('menu-backdrop');
  const title = document.getElementById('screen-title');
  const back = document.getElementById('back-button');
  const publicRoutes = new Set([
    'cuenta/iniciar-sesion', 'cuenta/registrar-usuario', 'cuenta/registrar-granja',
    'cuenta/seleccionar-plan', 'cuenta/confirmar-registro', 'cuenta/recuperar-contrasena',
    'cuenta/validar-codigo', 'cuenta/nueva-contrasena', 'cuenta/contrasena-restablecida'
  ]);
  const navRoutes = {
    inicio: 'inicio/resumen', animales: 'animales/listado', lotes: 'lotes/listado',
    alimentacion: 'alimentacion/listado', vacunacion: 'vacunacion/listado',
    manejo: 'manejo/ubicaciones', historial: 'historial/buscar',
    reportes: 'reportes/resumen-operativo', cuenta: 'cuenta/configuracion'
  };
  let current = '';
  let previous = 'inicio/resumen';

  function currentFromUrl() {
    return new URLSearchParams(location.search).get('screen') || 'cuenta/iniciar-sesion';
  }
  async function render(route) {
    if (!Object.hasOwn(routes, route)) route = 'cuenta/iniciar-sesion';
    const [label, kind] = routes[route];
    const response = await fetch(`screens/${route}.html`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`No se pudo cargar ${route}`);
    root.innerHTML = await response.text();
    window.scrollTo(0, 0);
    root.dataset.screen = route;
    document.title = label ? `${label} · MiGranja` : 'MiGranja · Aplicación';
    title.textContent = label;
    siteBar.hidden = publicRoutes.has(route);
    bottomNav.hidden = !['home', 'legacy-tab', 'modern-tab'].includes(kind);
    header.hidden = kind === 'auth' || kind === 'home';
    header.classList.toggle('header--legacy', kind.startsWith('legacy'));
    back.hidden = route === 'inicio/resumen';
    const activeRoute = navRoutes[route.split('/')[0]];
    document.querySelectorAll('#main-nav [data-route], .account-link').forEach(button => {
      const active = button.dataset.route === activeRoute;
      button.classList.toggle('is-current', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    document.querySelectorAll('#bottom-nav [data-route]').forEach(button => {
      button.classList.toggle('is-current', button.dataset.route === route);
    });
    siteBar.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
    menuBackdrop.hidden = true;
    menu.removeAttribute('aria-hidden');
    current = route;
    document.dispatchEvent(new CustomEvent('migranja:screen', { detail: { route } }));
  }
  function go(route, replace = false) {
    if (!Object.hasOwn(routes, route)) return;
    if (current && current !== route) previous = current;
    const url = new URL(location.href);
    url.searchParams.set('screen', route);
    history[replace ? 'replaceState' : 'pushState']({ route }, '', url);
    return render(route).catch(showError);
  }
  function showError(error) {
    root.innerHTML = `<section class="screen"><h1>No se pudo cargar la pantalla</h1><p>${error.message}</p><button class="btn" type="button" data-route="inicio/resumen">Volver al inicio</button></section>`;
  }
  back.addEventListener('click', () => {
    if (history.length > 1) history.back();
    else go(previous || 'inicio/resumen');
  });
  window.addEventListener('popstate', () => render(currentFromUrl()).catch(showError));
  window.MiGranjaApp = { go, get route() { return current; }, routes };
  render(currentFromUrl()).catch(showError);
})();
