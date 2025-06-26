function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    redirectToLogin();
    return false;
  }
  // Пример проверки срока действия токена (JWT)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    if (Date.now() >= exp * 1000) {
      logout();
      return false;
    }
  } catch {
    logout();
    return false;
  }
  return true;
}

function redirectToLogin() {
  localStorage.clear();
  window.location.href = '/login.html';
}

function logout() {
  localStorage.clear();
  window.location.href = '/login.html';
}

// Отображение имени пользователя и кнопки выхода
function updateUserStatus() {
  const userName = localStorage.getItem('userName');
  const userStatus = document.getElementById('user-status');
  const logoutBtn = document.getElementById('logout-btn');

  if (userName) {
    userStatus.textContent = `Привет, ${userName}`;
    logoutBtn.style.display = 'inline-block';
  } else {
    userStatus.textContent = '';
    logoutBtn.style.display = 'none';
  }
}

document.getElementById('logout-btn').addEventListener('click', logout);

// Индикатор статуса сети
const networkStatus = document.getElementById('network-status');

function updateNetworkStatus() {
  if (navigator.onLine) {
    networkStatus.textContent = 'Соединение восстановлено';
    networkStatus.style.color = 'green';
    setTimeout(() => (networkStatus.textContent = ''), 3000);
  } else {
    networkStatus.textContent = 'Вы в офлайне';
    networkStatus.style.color = 'red';
  }
}

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

if (!checkAuth()) {
  // Если не авторизован, перенаправляем
  redirectToLogin();
} else {
  updateUserStatus();
  updateNetworkStatus();
}

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log('Service Worker зарегистрирован'))
    .catch(console.error);
}
