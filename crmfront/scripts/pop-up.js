// Элементы управления попапом 
const overlay = document.getElementById('popupOverlay');
const closeBtn = document.getElementById('closePopupBtn');

// Экраны 
const loginScreen = document.getElementById('loginScreen');
const registerScreen = document.getElementById('registerScreen');
const forgotScreen = document.getElementById('forgotScreen');

// Контейнеры ошибок 
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');
const forgotError = document.getElementById('forgotError');

// Формы и их поля 
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginSubmitBtn = document.getElementById('loginSubmitBtn');

const registerForm = document.getElementById('registerForm');
const regName = document.getElementById('regName');
const regEmail = document.getElementById('regEmail');
const regPassword = document.getElementById('regPassword');
const regConfirm = document.getElementById('regConfirm');
const registerSubmitBtn = document.getElementById('registerSubmitBtn');

const forgotForm = document.getElementById('forgotForm');
const forgotEmail = document.getElementById('forgotEmail');
const forgotSubmitBtn = document.getElementById('forgotSubmitBtn');

const forgotLink = document.getElementById('forgotLink');
const registerLink = document.getElementById('registerLink');
const backToLoginFromRegister = document.getElementById('backToLoginFromRegister');
const backToLoginFromForgot = document.getElementById('backToLoginFromForgot');

// Динамические элементы заголовка и описания 
const popupTitle = document.getElementById('popup-title');
const popupDesc = document.getElementById('popup-desc');

// Переменные для управления фокусом 
let lastFocusedElement = null;
let focusableElementsString = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
let focusableElements;
let firstFocusable;
let lastFocusable;

// Вспомогательные функции 

function updateAriaLabels(screen) {
    if (screen === loginScreen) {
        popupTitle.textContent = 'Добро пожаловать!';
        popupDesc.textContent = 'Войдите, чтобы продолжить';
    } else if (screen === registerScreen) {
        popupTitle.textContent = 'Создать аккаунт';
        popupDesc.textContent = 'Заполните данные для регистрации';
    } else if (screen === forgotScreen) {
        popupTitle.textContent = 'Восстановление пароля';
        popupDesc.textContent = 'Мы отправим ссылку на ваш email';
    }
}

function showScreen(screen) {
    loginScreen.classList.add('hidden');
    registerScreen.classList.add('hidden');
    forgotScreen.classList.add('hidden');
    screen.classList.remove('hidden');
    updateAriaLabels(screen);
    setTimeout(() => {
        const firstInput = screen.querySelector('input:not([type="hidden"])');
        if (firstInput) firstInput.focus();
    }, 100);
}

let errorTimeout = null;

function showError(container, message) {
    if (errorTimeout) clearTimeout(errorTimeout);
    container.textContent = message;
    container.classList.remove('hidden');
    errorTimeout = setTimeout(() => {
        container.classList.add('hidden');
        errorTimeout = null;
    }, 5000);
}

// Функция показа уведомлений
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = 'notification'; 
    notification.classList.add(type);
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 300);
    }, 3000);
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function trapFocus(e) {
    if (!overlay.classList.contains('hidden')) {
        focusableElements = overlay.querySelectorAll(focusableElementsString);
        if (focusableElements.length > 0) {
            firstFocusable = focusableElements[0];
            lastFocusable = focusableElements[focusableElements.length - 1];

            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        }
    }
}

function openPopup() {
    lastFocusedElement = document.activeElement;
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    showScreen(loginScreen);
    document.addEventListener('keydown', trapFocus);
    document.body.style.overflow = 'hidden';
}

function closePopup() {
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    loginError.classList.add('hidden');
    registerError.classList.add('hidden');
    forgotError.classList.add('hidden');
    loginForm.reset();
    registerForm.reset();
    forgotForm.reset();
    document.removeEventListener('keydown', trapFocus);
    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

// Автоматическое открытие 
document.addEventListener('DOMContentLoaded', () => {
    openPopup();
});

// Обработчики закрытия 
closeBtn.addEventListener('click', closePopup);
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePopup();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
        closePopup();
    }
});

// Переключение экранов 
registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    showScreen(registerScreen);
    registerError.classList.add('hidden');
    registerForm.reset();
});

forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    showScreen(forgotScreen);
    forgotError.classList.add('hidden');
    forgotForm.reset();
});

backToLoginFromRegister.addEventListener('click', (e) => {
    e.preventDefault();
    showScreen(loginScreen);
    loginError.classList.add('hidden');
});

backToLoginFromForgot.addEventListener('click', (e) => {
    e.preventDefault();
    showScreen(loginScreen);
    loginError.classList.add('hidden');
});

// Обработчики отправки форм
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!email || !password) {
        showError(loginError, 'Заполните все поля');
        return;
    }
    if (password.length < 6) {
        showError(loginError, 'Пароль должен быть минимум 6 символов');
        return;
    }
    if (!isValidEmail(email)) {
        showError(loginError, 'Введите корректный email');
        return;
    }
    loginSubmitBtn.disabled = true;
    loginSubmitBtn.textContent = 'Вход...';
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Успешный вход:', { email });
        showNotification('Вход выполнен успешно!', 'success');
        closePopup();
    } catch (error) {
        showError(loginError, 'Ошибка при входе');
        console.error(error);
    } finally {
        loginSubmitBtn.disabled = false;
        loginSubmitBtn.textContent = 'Войти';
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = regName.value.trim();
    const email = regEmail.value.trim();
    const password = regPassword.value.trim();
    const confirm = regConfirm.value.trim();
    if (!name || !email || !password || !confirm) {
        showError(registerError, 'Заполните все поля');
        return;
    }
    if (password.length < 6) {
        showError(registerError, 'Пароль должен быть минимум 6 символов');
        return;
    }
    if (password !== confirm) {
        showError(registerError, 'Пароли не совпадают');
        return;
    }
    if (!isValidEmail(email)) {
        showError(registerError, 'Введите корректный email');
        return;
    }
    registerSubmitBtn.disabled = true;
    registerSubmitBtn.textContent = 'Регистрация...';
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Регистрация:', { name, email });
        showNotification('Регистрация прошла успешно!', 'success');
        emailInput.value = email;
        showScreen(loginScreen);
        registerForm.reset();
    } catch (error) {
        showError(registerError, 'Ошибка при регистрации');
    } finally {
        registerSubmitBtn.disabled = false;
        registerSubmitBtn.textContent = 'Зарегистрироваться';
    }
});

forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = forgotEmail.value.trim();
    if (!email) {
        showError(forgotError, 'Введите email');
        return;
    }
    if (!isValidEmail(email)) {
        showError(forgotError, 'Введите корректный email');
        return;
    }
    forgotSubmitBtn.disabled = true;
    forgotSubmitBtn.textContent = 'Отправка...';
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Восстановление пароля для:', email);
        showNotification('Ссылка для сброса пароля отправлена', 'info');
        showScreen(loginScreen);
        forgotForm.reset();
    } catch (error) {
        showError(forgotError, 'Ошибка при отправке');
    } finally {
        forgotSubmitBtn.disabled = false;
        forgotSubmitBtn.textContent = 'Отправить';
    }
});

// === Очистка ошибок при вводе ===
emailInput.addEventListener('input', () => loginError.classList.add('hidden'));
passwordInput.addEventListener('input', () => loginError.classList.add('hidden'));
regName.addEventListener('input', () => registerError.classList.add('hidden'));
regEmail.addEventListener('input', () => registerError.classList.add('hidden'));
regPassword.addEventListener('input', () => registerError.classList.add('hidden'));
regConfirm.addEventListener('input', () => registerError.classList.add('hidden'));
forgotEmail.addEventListener('input', () => forgotError.classList.add('hidden'));