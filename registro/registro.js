document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault(); 
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const dataNascimento = document.getElementById('data-nascimento').value;
    const senha = document.getElementById('senha').value;
    const verificaSenha = document.getElementById('verifica-senha').value;
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.style.display = 'none';
    errorMessageDiv.textContent = '';

    if (senha !== verificaSenha) {
        errorMessageDiv.textContent = 'As senhas não coincidem.';
        errorMessageDiv.style.display = 'block';
        return;
    }

    const data = {
        email: email,
        username: username,
        dateBirth: dataNascimento,
        passwordHash: senha
    };

    try {
        const response = await fetch('https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
            localStorage.setItem('username', username);
            localStorage.setItem(`jwtToken`, result.token);
            window.location.href = '../criar-perfil/index.html';
        } else {
            const errorData = await response.json();
            if (response.status === 400) {
                errorMessageDiv.textContent = 'Erro ao registrar. Tente novamente.';
                errorMessageDiv.style.display = 'block';
            }
        }
    } catch (error) {
        errorMessageDiv.textContent = 'Erro ao registrar. Tente novamente.';
        errorMessageDiv.style.display = 'block';
    }
});