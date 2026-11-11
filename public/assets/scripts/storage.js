
'use strict';

(function () {
    const KEYS = {
        users: 'migranja_users',
        session: 'migranja_session',
        animals: 'migranja_animals',
        lots: 'migranja_lots',
        feedings: 'migranja_feedings',
        vaccinations: 'migranja_vaccinations'
    };

    function readJSON(key, fallback = []) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            console.error('Error al leer almacenamiento:', error);
            return fallback;
        }
    }

    function writeJSON(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function getUsers() {
        return readJSON(KEYS.users, []);
    }

    function saveUsers(users) {
        writeJSON(KEYS.users, users);
    }

    function seedDemoUser() {
        const users = getUsers();
        const email = 'demo@migranja.com';

        const exists = users.some(user => user.email === email);

        if (!exists) {
            users.push({
                id: 'demo-user-001',
                name: 'Administrador Demo',
                email,
                password: 'MiGranja2026!',
                role: 'Administrador'
            });

            saveUsers(users);
        }
    }

    function setSession(user, remember) {
        const session = {
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        };

        clearSession();

        const destination = remember ? localStorage : sessionStorage;
        destination.setItem(KEYS.session, JSON.stringify(session));
    }

    function getSession() {
        return readSession(localStorage) ||
            readSession(sessionStorage);
    }

    function readSession(storage) {
        try {
            const value = storage.getItem(KEYS.session);
            return value ? JSON.parse(value) : null;
        } catch {
            return null;
        }
    }

    function clearSession() {
        localStorage.removeItem(KEYS.session);
        sessionStorage.removeItem(KEYS.session);
    }

    function updatePassword(email, newPassword) {
        const users = getUsers();
        const user = users.find(item => item.email === email);

        if (!user) return false;

        user.password = newPassword;
        saveUsers(users);
        return true;
    }

    function getData(key) {
        return readJSON(KEYS[key], []);
    }

    function saveData(key, data) {
        if (!KEYS[key] || ['users', 'session'].includes(key)) {
            throw new Error('Clave de almacenamiento no permitida.');
        }

        writeJSON(KEYS[key], data);
    }

    window.MiGranjaStore = {
        getUsers,
        saveUsers,
        seedDemoUser,
        setSession,
        getSession,
        clearSession,
        updatePassword,
        getData,
        saveData
    };
})();
