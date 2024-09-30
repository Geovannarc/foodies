document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita o envio do formulário padrão

    // Captura os valores dos campos do formulário
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const dataNascimento = document.getElementById('data-nascimento').value;
    const senha = document.getElementById('senha').value;
    const verificaSenha = document.getElementById('verifica-senha').value;

    // Verifica se as senhas coincidem
    if (senha !== verificaSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    // Monta o payload para envio
    const data = {
        email: email,
        username: username,
        dataNascimento: dataNascimento,
        passwordHash: senha
    };

    try {
        const response = await fetch('http://localhost:8080/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
            localStorage.setItem('jwtToken', result.token);
            window.location.href = '../criar-perfil/index.html';
        } else {
            const errorData = await response.json();
            alert('Erro ao registrar: ' + errorData.message);
        }
    } catch (error) {
        alert('Ocorreu um erro ao registrar: ' + error.message);
    }
});