
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const store = window.MiGranjaStore;

    // 1. VERIFICAR SESIÓN
    if (!store) {
        alert('No se pudo cargar el almacenamiento de MiGranja.');
        return;
    }

    const session = store.getSession();

    if (!session) {
        window.location.replace('login.html');
        return;
    }

    // 2. UTILIDADES
    const $ = id => document.getElementById(id);

    const uid = () => {
        if (window.crypto && typeof window.crypto.randomUUID === 'function') {
            return window.crypto.randomUUID();
        }
        return `mg-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    };

    const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[char]);

    function localDate(offset = 0) {
        const date = new Date();
        date.setDate(date.getDate() + offset);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    function formatDate(value) {
        if (!value) return 'No programada';

        const parts = value.split('-');

        if (parts.length !== 3) return value;

        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    function showFeedback(id, message, type = 'success') {
        const element = $(id);
        if (!element) return;

        element.textContent = message;
        element.className = `form-feedback ${type}`;
    }

    function emptyRow(columns, message) {
        return `<tr><td colspan="${columns}" class="empty-row">${message}</td></tr>`;
    }

    // 3. DATOS DE DEMOSTRACIÓN
    // Solo se cargan cuando el almacenamiento está completamente vacío.
    function seedDemoData() {
        const keys = ['animals', 'lots', 'vaccinations', 'feedings'];

        const isEmpty = keys.every(key => store.getData(key).length === 0);

        if (!isEmpty) return;

        const lots = [
            {
                id: 'demo-lot-1',
                name: 'Lote Norte',
                location: 'Sector norte',
                description: 'Ganado de producción'
            },
            {
                id: 'demo-lot-2',
                name: 'Lote Sur',
                location: 'Sector sur',
                description: 'Ganado joven'
            }
        ];

        const animals = [
            {
                id: 'demo-animal-1',
                code: 'VAC-001',
                name: 'Luna',
                breed: 'Holstein',
                sex: 'Hembra',
                birth: '2022-05-12',
                lotId: 'demo-lot-1'
            },
            {
                id: 'demo-animal-2',
                code: 'VAC-002',
                name: 'Max',
                breed: 'Brown Swiss',
                sex: 'Macho',
                birth: '2021-09-20',
                lotId: 'demo-lot-1'
            },
            {
                id: 'demo-animal-3',
                code: 'VAC-003',
                name: 'Canela',
                breed: 'Jersey',
                sex: 'Hembra',
                birth: '2023-02-15',
                lotId: 'demo-lot-2'
            },
            {
                id: 'demo-animal-4',
                code: 'VAC-004',
                name: 'Toby',
                breed: 'Holstein',
                sex: 'Macho',
                birth: '2022-11-08',
                lotId: 'demo-lot-2'
            }
        ];

        const vaccinations = [
            {
                id: 'demo-vacc-1',
                animalId: 'demo-animal-1',
                vaccine: 'Vacuna de aftosa',
                date: localDate(-25),
                nextDate: localDate(5),
                notes: 'Registro de demostración'
            },
            {
                id: 'demo-vacc-2',
                animalId: 'demo-animal-2',
                vaccine: 'Vacuna clostridial',
                date: localDate(-20),
                nextDate: localDate(12),
                notes: 'Registro de demostración'
            }
        ];

        const feedings = [
            {
                id: 'demo-feed-1',
                targetType: 'lot',
                targetId: 'demo-lot-1',
                feedType: 'Pasto',
                quantity: 35,
                date: localDate(-1),
                notes: 'Ración de la mañana'
            },
            {
                id: 'demo-feed-2',
                targetType: 'animal',
                targetId: 'demo-animal-3',
                feedType: 'Concentrado',
                quantity: 8,
                date: localDate(0),
                notes: 'Ración individual'
            }
        ];

        store.saveData('lots', lots);
        store.saveData('animals', animals);
        store.saveData('vaccinations', vaccinations);
        store.saveData('feedings', feedings);
    }

    seedDemoData();

    // 4. OBTENER DATOS ACTUALES
    const getAnimals = () => store.getData('animals');
    const getLots = () => store.getData('lots');
    const getVaccinations = () => store.getData('vaccinations');
    const getFeedings = () => store.getData('feedings');

    const getAnimal = id => getAnimals().find(item => item.id === id);
    const getLot = id => getLots().find(item => item.id === id);

    function animalLabel(id) {
        const animal = getAnimal(id);
        return animal ? `${animal.code} - ${animal.name || 'Sin nombre'}` : 'Animal eliminado';
    }

    function lotLabel(id) {
        const lot = getLot(id);
        return lot ? lot.name : 'Lote eliminado';
    }

    // 5. INFORMACIÓN DEL USUARIO
    $('sidebar-user-name').textContent = session.name || session.email;
    $('welcome-user').textContent = (session.name || 'Administrador').split(' ')[0];

    $('current-date').textContent = new Date().toLocaleDateString('es-PE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // 6. NAVEGACIÓN DEL DASHBOARD
    const titles = {
        overview: 'Resumen general',
        animals: 'Gestión de animales',
        lots: 'Gestión de lotes',
        vaccinations: 'Control de vacunación',
        feeding: 'Control de alimentación'
    };

    function showSection(section) {
        document.querySelectorAll('.dashboard-view').forEach(view => {
            view.classList.add('hidden');
        });

        const selected = $(`${section}-view`);

        if (!selected) return;

        selected.classList.remove('hidden');
        $('dashboard-section-title').textContent = titles[section];

        document.querySelectorAll('.dashboard-nav-item').forEach(button => {
            button.classList.toggle('active', button.dataset.section === section);
        });

        $('dashboard-sidebar').classList.remove('is-open');
    }

    document.querySelectorAll('.dashboard-nav-item').forEach(button => {
        button.addEventListener('click', () => {
            showSection(button.dataset.section);
        });
    });

    $('sidebar-toggle').addEventListener('click', () => {
        $('dashboard-sidebar').classList.toggle('is-open');
    });

    $('logout-button').addEventListener('click', () => {
        if (!confirm('¿Seguro que deseas cerrar sesión?')) return;

        store.clearSession();
        window.location.replace('login.html');
    });

    // 7. ACTUALIZAR SELECTORES
    function updateAnimalOptions() {
        const animals = getAnimals();

        $('animal-lot').innerHTML =
            '<option value="">Sin asignar</option>' +
            getLots().map(lot =>
                `<option value="${escapeHTML(lot.id)}">${escapeHTML(lot.name)}</option>`
            ).join('');

        $('vaccination-animal').innerHTML =
            '<option value="">Selecciona un animal</option>' +
            animals.map(animal =>
                `<option value="${escapeHTML(animal.id)}">${escapeHTML(animal.code)} - ${escapeHTML(animal.name || 'Sin nombre')}</option>`
            ).join('');

        updateFeedingTargets();
    }

    function updateFeedingTargets() {
        const type = $('feeding-target-type').value;
        const target = $('feeding-target');

        if (type === 'animal') {
            target.innerHTML =
                '<option value="">Selecciona un animal</option>' +
                getAnimals().map(animal =>
                    `<option value="${escapeHTML(animal.id)}">${escapeHTML(animal.code)} - ${escapeHTML(animal.name || 'Sin nombre')}</option>`
                ).join('');
        } else {
            target.innerHTML =
                '<option value="">Selecciona un lote</option>' +
                getLots().map(lot =>
                    `<option value="${escapeHTML(lot.id)}">${escapeHTML(lot.name)}</option>`
                ).join('');
        }
    }

    $('feeding-target-type').addEventListener('change', updateFeedingTargets);

    // 8. MOSTRAR ANIMALES
    function renderAnimals() {
        const animals = getAnimals().sort((a, b) =>
            a.code.localeCompare(b.code)
        );

        $('animal-count').textContent =
            `${animals.length} registro${animals.length === 1 ? '' : 's'}`;

        $('animals-table-body').innerHTML = animals.length
            ? animals.map(animal => `
          <tr>
            <td>${escapeHTML(animal.code)}</td>
            <td>${escapeHTML(animal.name || '-')}</td>
            <td>${escapeHTML(animal.breed || '-')}</td>
            <td>${escapeHTML(animal.sex || '-')}</td>
            <td>${escapeHTML(lotLabel(animal.lotId))}</td>
            <td>
              <button type="button" class="table-action" data-action="edit-animal" data-id="${escapeHTML(animal.id)}" aria-label="Editar animal">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button type="button" class="table-action danger" data-action="delete-animal" data-id="${escapeHTML(animal.id)}" aria-label="Eliminar animal">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        `).join('')
            : emptyRow(6, 'Todavía no hay animales registrados.');

        updateAnimalOptions();
    }

    // 9. REGISTRAR Y EDITAR ANIMALES
    $('animal-form').addEventListener('submit', event => {
        event.preventDefault();

        const id = $('animal-id').value;
        const code = $('animal-code').value.trim().toUpperCase();
        const animals = getAnimals();

        const duplicate = animals.some(animal =>
            animal.code.toUpperCase() === code && animal.id !== id
        );

        if (duplicate) {
            showFeedback('animal-feedback', 'Ya existe un animal con ese código.', 'error');
            return;
        }

        const animal = {
            id: id || uid(),
            code,
            name: $('animal-name').value.trim(),
            breed: $('animal-breed').value.trim(),
            sex: $('animal-sex').value,
            birth: $('animal-birth').value,
            lotId: $('animal-lot').value
        };

        if (id) {
            const index = animals.findIndex(item => item.id === id);
            if (index === -1) return;
            animals[index] = animal;
        } else {
            animals.push(animal);
        }

        store.saveData('animals', animals);

        $('animal-form').reset();
        $('animal-id').value = '';
        $('animal-form-title').textContent = 'Registrar nuevo animal';
        $('cancel-animal-edit').classList.add('hidden');

        showFeedback(
            'animal-feedback',
            id ? 'Animal actualizado correctamente.' : 'Animal registrado correctamente.'
        );

        renderAll();
    });

    function editAnimal(id) {
        const animal = getAnimal(id);
        if (!animal) return;

        showSection('animals');

        $('animal-id').value = animal.id;
        $('animal-code').value = animal.code;
        $('animal-name').value = animal.name || '';
        $('animal-breed').value = animal.breed || '';
        $('animal-sex').value = animal.sex || 'Hembra';
        $('animal-birth').value = animal.birth || '';
        $('animal-lot').value = animal.lotId || '';

        $('animal-form-title').textContent = 'Editar animal';
        $('cancel-animal-edit').classList.remove('hidden');

        $('animal-code').focus();
    }

    $('cancel-animal-edit').addEventListener('click', () => {
        $('animal-form').reset();
        $('animal-id').value = '';
        $('animal-form-title').textContent = 'Registrar nuevo animal';
        $('cancel-animal-edit').classList.add('hidden');
        showFeedback('animal-feedback', 'Edición cancelada.');
    });

    function deleteAnimal(id) {
        const animal = getAnimal(id);
        if (!animal) return;

        if (!confirm(`¿Eliminar al animal ${animal.code}? También se eliminarán sus vacunaciones y registros individuales de alimentación.`)) {
            return;
        }

        store.saveData('animals', getAnimals().filter(item => item.id !== id));

        store.saveData(
            'vaccinations',
            getVaccinations().filter(item => item.animalId !== id)
        );

        store.saveData(
            'feedings',
            getFeedings().filter(item =>
                !(item.targetType === 'animal' && item.targetId === id)
            )
        );

        renderAll();
    }

    $('animals-table-body').addEventListener('click', event => {
        const button = event.target.closest('button[data-action]');
        if (!button) return;

        const { action, id } = button.dataset;

        if (action === 'edit-animal') editAnimal(id);
        if (action === 'delete-animal') deleteAnimal(id);
    });

    // 10. GESTIÓN DE LOTES
    $('lot-form').addEventListener('submit', event => {
        event.preventDefault();

        const name = $('lot-name').value.trim();
        const lots = getLots();

        if (lots.some(lot => lot.name.toLowerCase() === name.toLowerCase())) {
            showFeedback('lot-feedback', 'Ya existe un lote con ese nombre.', 'error');
            return;
        }

        lots.push({
            id: uid(),
            name,
            location: $('lot-location').value.trim(),
            description: $('lot-description').value.trim()
        });

        store.saveData('lots', lots);

        $('lot-form').reset();
        showFeedback('lot-feedback', 'Lote registrado correctamente.');

        renderAll();
    });

    function renderLots() {
        const lots = getLots();

        $('lots-table-body').innerHTML = lots.length
            ? lots.map(lot => {
                const count = getAnimals().filter(animal => animal.lotId === lot.id).length;

                return `
            <tr>
              <td>${escapeHTML(lot.name)}</td>
              <td>${escapeHTML(lot.location || '-')}</td>
              <td>${count}</td>
              <td>
                <button type="button" class="table-action danger" data-action="delete-lot" data-id="${escapeHTML(lot.id)}" aria-label="Eliminar lote">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          `;
            }).join('')
            : emptyRow(4, 'Todavía no hay lotes registrados.');
    }

    $('lots-table-body').addEventListener('click', event => {
        const button = event.target.closest('[data-action="delete-lot"]');
        if (!button) return;

        const id = button.dataset.id;
        const lot = getLot(id);

        if (!lot) return;

        if (!confirm(`¿Eliminar el lote ${lot.name}? Los animales permanecerán registrados, pero quedarán sin lote asignado.`)) {
            return;
        }

        const animals = getAnimals().map(animal =>
            animal.lotId === id ? { ...animal, lotId: '' } : animal
        );

        store.saveData('animals', animals);
        store.saveData('lots', getLots().filter(item => item.id !== id));

        renderAll();
    });

    // 11. VACUNACIONES
    $('vaccination-form').addEventListener('submit', event => {
        event.preventDefault();

        const animalId = $('vaccination-animal').value;
        const date = $('vaccination-date').value;
        const nextDate = $('vaccination-next-date').value;

        if (!getAnimal(animalId)) {
            showFeedback('vaccination-feedback', 'Selecciona un animal válido.', 'error');
            return;
        }

        if (nextDate && nextDate < date) {
            showFeedback('vaccination-feedback', 'La próxima fecha no puede ser anterior a la aplicación.', 'error');
            return;
        }

        const vaccinations = getVaccinations();

        vaccinations.push({
            id: uid(),
            animalId,
            vaccine: $('vaccine-name').value.trim(),
            date,
            nextDate,
            notes: $('vaccination-notes').value.trim()
        });

        store.saveData('vaccinations', vaccinations);

        $('vaccination-form').reset();
        $('vaccination-date').value = localDate();

        showFeedback('vaccination-feedback', 'Vacunación registrada correctamente.');

        renderAll();
    });

    function renderVaccinations() {
        const records = getVaccinations().sort((a, b) =>
            b.date.localeCompare(a.date)
        );

        $('vaccinations-table-body').innerHTML = records.length
            ? records.map(record => `
          <tr>
            <td>${escapeHTML(animalLabel(record.animalId))}</td>
            <td>${escapeHTML(record.vaccine)}</td>
            <td>${formatDate(record.date)}</td>
            <td>${formatDate(record.nextDate)}</td>
            <td>
              <button type="button" class="table-action danger" data-action="delete-vaccination" data-id="${escapeHTML(record.id)}" aria-label="Eliminar vacunación">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        `).join('')
            : emptyRow(5, 'Todavía no hay vacunaciones registradas.');
    }

    $('vaccinations-table-body').addEventListener('click', event => {
        const button = event.target.closest('[data-action="delete-vaccination"]');
        if (!button) return;

        if (!confirm('¿Deseas eliminar este registro de vacunación?')) return;

        store.saveData(
            'vaccinations',
            getVaccinations().filter(item => item.id !== button.dataset.id)
        );

        renderAll();
    });

    // 12. ALIMENTACIÓN
    $('feeding-form').addEventListener('submit', event => {
        event.preventDefault();

        const type = $('feeding-target-type').value;
        const targetId = $('feeding-target').value;
        const quantity = Number($('feeding-quantity').value);

        const validTarget = type === 'animal'
            ? Boolean(getAnimal(targetId))
            : Boolean(getLot(targetId));

        if (!validTarget) {
            showFeedback('feeding-feedback', 'Selecciona un animal o lote válido.', 'error');
            return;
        }

        if (!Number.isFinite(quantity) || quantity <= 0) {
            showFeedback('feeding-feedback', 'La cantidad debe ser mayor que cero.', 'error');
            return;
        }

        const feedings = getFeedings();

        feedings.push({
            id: uid(),
            targetType: type,
            targetId,
            feedType: $('feed-type').value.trim(),
            quantity,
            date: $('feeding-date').value,
            notes: $('feeding-notes').value.trim()
        });

        store.saveData('feedings', feedings);

        $('feeding-form').reset();
        $('feeding-date').value = localDate();
        updateFeedingTargets();

        showFeedback('feeding-feedback', 'Registro de alimentación guardado correctamente.');

        renderAll();
    });

    function feedingTargetLabel(record) {
        return record.targetType === 'lot'
            ? lotLabel(record.targetId)
            : animalLabel(record.targetId);
    }

    function renderFeedings() {
        const records = getFeedings().sort((a, b) =>
            b.date.localeCompare(a.date)
        );

        $('feedings-table-body').innerHTML = records.length
            ? records.map(record => `
          <tr>
            <td>${escapeHTML(feedingTargetLabel(record))}</td>
            <td>${escapeHTML(record.feedType)}</td>
            <td>${escapeHTML(record.quantity)} kg</td>
            <td>${formatDate(record.date)}</td>
            <td>
              <button type="button" class="table-action danger" data-action="delete-feeding" data-id="${escapeHTML(record.id)}" aria-label="Eliminar alimentación">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        `).join('')
            : emptyRow(5, 'Todavía no hay registros de alimentación.');
    }

    $('feedings-table-body').addEventListener('click', event => {
        const button = event.target.closest('[data-action="delete-feeding"]');
        if (!button) return;

        if (!confirm('¿Deseas eliminar este registro de alimentación?')) return;

        store.saveData(
            'feedings',
            getFeedings().filter(item => item.id !== button.dataset.id)
        );

        renderAll();
    });

    // 13. RESUMEN GENERAL
    function renderOverview() {
        const animals = getAnimals();
        const lots = getLots();
        const vaccinations = getVaccinations();
        const feedings = getFeedings();
        const today = localDate();

        const upcoming = vaccinations
            .filter(item => item.nextDate && item.nextDate >= today)
            .sort((a, b) => a.nextDate.localeCompare(b.nextDate));

        $('stat-animals').textContent = animals.length;
        $('stat-lots').textContent = lots.length;
        $('stat-vaccinations').textContent = upcoming.length;
        $('stat-feedings').textContent = feedings.length;

        $('upcoming-vaccinations').innerHTML = upcoming.length
            ? upcoming.slice(0, 6).map(item => `
          <tr>
            <td>${escapeHTML(animalLabel(item.animalId))}</td>
            <td>${escapeHTML(item.vaccine)}</td>
            <td>${formatDate(item.nextDate)}</td>
          </tr>
        `).join('')
            : emptyRow(3, 'No tienes próximas vacunaciones registradas.');

        const recentFeedings = feedings
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 5);

        $('recent-feedings').innerHTML = recentFeedings.length
            ? recentFeedings.map(item => `
          <tr>
            <td>${escapeHTML(feedingTargetLabel(item))}</td>
            <td>${escapeHTML(item.feedType)}</td>
            <td>${escapeHTML(item.quantity)} kg</td>
            <td>${formatDate(item.date)}</td>
          </tr>
        `).join('')
            : emptyRow(4, 'No tienes registros de alimentación.');
    }

    // 14. ACTUALIZACIÓN GENERAL
    function renderAll() {
        renderAnimals();
        renderLots();
        renderVaccinations();
        renderFeedings();
        renderOverview();
    }

    // FECHAS INICIALES
    $('vaccination-date').value = localDate();
    $('feeding-date').value = localDate();

    // INICIAR DASHBOARD
    renderAll();
});
