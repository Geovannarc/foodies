const fileInput = document.getElementById('file-input');
  const profilePic = document.getElementById('profile-pic');

    fileInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          profilePic.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
    document.querySelector('form').addEventListener('submit', async function(event) {
      event.preventDefault(); 
  
      const nome = document.getElementById('nome').value;
      const bio = document.getElementById('bio').value;
      const fileInput = document.getElementById('file-input');
  
      if (!fileInput.files.length) {
          alert("Por favor, selecione uma imagem de perfil.");
          return;
      }

      const formData = new FormData();
      formData.append('name', nome);
      formData.append('bio', bio);
      formData.append('image', fileInput.files[0]); 
      formData.append('imageURL', ''); 
      formData.append('username', localStorage.getItem('username')); 
      const username = localStorage.getItem('username');

      const response = await fetch('https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/user/create-profile', {
          method: 'POST',
          body: formData,
          headers: {
              "Authorization": localStorage.getItem(`jwtToken`)
          }
      })
      .then(response => response.json())
      .then(data => {
          if(response.ok) {
              window.location.href = '../tags/';
          } else {
              alert('Ocorreu um erro ao criar o perfil.');
          }
      })
      .catch(error => {
          console.error('Erro:', error);
          alert('Ocorreu um erro ao criar o perfil.');
      });
  });