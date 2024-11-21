document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault(); 
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const dataNascimento = document.getElementById('data-nascimento').value;
    const senha = document.getElementById('senha').value;
    const verificaSenha = document.getElementById('verifica-senha').value;

    if (senha !== verificaSenha) {
        showError('As senhas não coincidem.');
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
            localStorage.setItem('username', username);
            localStorage.setItem(`jwtToken`, result.token);
            localStorage.setItem(`dXNlcklk`, result.message);
            window.location.href = '../criar-perfil/';
        } else {
            const errorData = await response.json();
            if (response.status === 400) {
                showError('Erro ao registrar. Tente novamente.');
            }
        }
    } catch (error) {
        showError('Erro ao registrar. Tente novamente.');
    }
});