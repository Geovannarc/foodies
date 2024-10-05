document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = {
      username: username,
      passwordHash: password
    };

    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.style.display = 'none';
    errorMessageDiv.textContent = '';

    try {
      const response = await fetch('https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        const token = result.token;

        localStorage.setItem('jwtToken', token);
        localStorage.setItem('username', username);

        window.location.href = '../destaques/index.html';
      } else {
        const errorData = await response.json();

        if (response.status === 400) {
          errorMessageDiv.textContent = 'Usuário ou senha incorretos.';
        } else if (response.status === 500) {
          errorMessageDiv.textContent = 'Ocorreu um erro ao fazer login.';
        }

        errorMessageDiv.style.display = 'block';
      }
    } catch (error) {
      alert('Ocorreu um erro ao fazer login: ' + error.message);
    }
  });