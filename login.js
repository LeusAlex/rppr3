document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.email.value.trim();
  const password = e.target.password.value;

  // Простейшая валидация
  if (!email || !password || password.length < 6) {
    showError('Введите корректные данные');
    return;
  }

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const { message } = await response.json();
      throw new Error(message || 'Ошибка авторизации');
    }

    const { token, user } = await response.json();

    // Сохраняем токен и имя пользователя
    localStorage.setItem('token', token);
    localStorage.setItem('userName', user.name);

    // Перенаправляем в защищённое приложение
    window.location.href = '/index.html';
  } catch (err) {
    showError(err.message);
  }
});

function showError(msg) {
  document.getElementById('error').textContent = msg;
}
