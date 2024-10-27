document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = new FormData();
    data.append('username', username);
    data.append('password', password);

    try {
      const response = await fetch('https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/user/login', {
        method: 'POST',
        body: data
      });

      if (response.ok) {
        const result = await response.json();
        const token = result.token;

        localStorage.setItem(`jwtToken`, token);
        localStorage.setItem('username', username);

        window.location.href = '../destaques/index.html';
      } else {
        const errorData = await response.json();

        if (response.status === 400) {
          showError('Usuário ou senha incorretos.');
        } else if (response.status === 500) {
          showError('Ocorreu um erro ao fazer login.');
        }
      }
    } catch (error) {
      showError('Ocorreu um erro ao fazer login.');
    }
  });