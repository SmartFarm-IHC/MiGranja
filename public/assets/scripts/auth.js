
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const store = window.MiGranjaStore;

    store.seedDemoUser();

    const loginView = document.getElementById('login-view');
    const recoveryView = document.getElementById('recovery-view');
    const resetView = document.getElementById('reset-view');

    const loginForm = document.getElementById('login-form');
    const recoveryForm = document.getElementById('recovery-form');
    const resetForm = document.getElementById('reset-form');

    let recoveryEmail = '';

    function showView(view) {
        [loginView, recoveryView, resetView].forEach(item => {
            item.classList.add('hidden');
        });

        view.classList.remove('hidden');
    }

    function feedback(id, message, type) {
        const element = document.getElementById(id);
        element.textContent = message;
        element.className = `feedback show ${type}`;
    }

    function clearFeedback() {
        document.querySelectorAll('.feedback').forEach(element => {
            element.textContent = '';
            element.className = 'feedback';
        });
    }

    document.getElementById('show-recovery').addEventListener('click', () => {
        clearFeedback();
        showView(recoveryView);
    });

    document.querySelectorAll('[data-back-login]').forEach(button => {
        button.addEventListener('click', () => {
            clearFeedback();
            showView(loginView);
        });
    });

    document.querySelectorAll('[data-toggle]').forEach(button => {
        button.addEventListener('click', () => {
            const input = document.getElementById(button.dataset.toggle);
            const icon = button.querySelector('i');

            input.type = input.type === 'password' ? 'text' : 'password';
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    });

    loginForm.addEventListener('submit', event => {
        event.preventDefault();
        clearFeedback();

        const email = document.getElementById('login-email').value
            .trim().toLowerCase();

        const password = document.getElementById('login-password').value;
        const remember = document.getElementById('remember-me').checked;

        const user = store.getUsers().find(item =>
            item.email.toLowerCase() === email &&
            item.password === password
        );

        if (!user) {
            feedback(
                'login-feedback',
                'El correo o la contraseña son incorrectos.',
                'error'
            );
            return;
        }

        store.setSession(user, remember);
        window.location.href = 'dashboard.html';
    });

    recoveryForm.addEventListener('submit', event => {
        event.preventDefault();
        clearFeedback();

        const email = document.getElementById('recovery-email').value
            .trim().toLowerCase();

        const user = store.getUsers().find(item =>
            item.email.toLowerCase() === email
        );

        if (!user) {
            feedback(
                'recovery-feedback',
                'No encontramos una cuenta registrada con ese correo.',
                'error'
            );
            return;
        }

        recoveryEmail = email;
        showView(resetView);

        feedback(
            'reset-feedback',
            'Modo demostración: utiliza el código 123456. No se envió ningún correo.',
            'success'
        );
    });

    resetForm.addEventListener('submit', event => {
        event.preventDefault();
        clearFeedback();

        const code = document.getElementById('reset-code').value.trim();
        const password = document.getElementById('new-password').value;
        const confirm = document.getElementById('confirm-password').value;

        if (code !== '123456') {
            feedback(
                'reset-feedback',
                'El código de verificación es incorrecto.',
                'error'
            );
            return;
        }

        if (password.length < 8) {
            feedback(
                'reset-feedback',
                'La contraseña debe tener al menos 8 caracteres.',
                'error'
            );
            return;
        }

        if (password !== confirm) {
            feedback(
                'reset-feedback',
                'Las contraseñas no coinciden.',
                'error'
            );
            return;
        }

        const updated = store.updatePassword(recoveryEmail, password);

        if (!updated) {
            feedback(
                'reset-feedback',
                'No fue posible actualizar la contraseña.',
                'error'
            );
            return;
        }

        resetForm.reset();
        loginForm.reset();
        document.getElementById('login-email').value = recoveryEmail;

        showView(loginView);

        feedback(
            'login-feedback',
            'Contraseña actualizada correctamente. Ya puedes iniciar sesión.',
            'success'
        );
    });
});
