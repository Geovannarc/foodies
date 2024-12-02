const restaurantId = new URLSearchParams(window.location.search).get('id');
const errorMessage = document.getElementById('error-message');
errorMessage.style.display = 'none';
fetch(`https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/establishment/findById?id=${encodeURIComponent(restaurantId)}`)
    .then(response => response.json())
    .then(restaurant => {
        document.getElementById('restaurant-name').textContent = restaurant.message.name;
        document.getElementById('restaurant-id').value = restaurant.message.id;
    });

document.getElementById('restaurant-image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.querySelector('.restaurant-image-preview');
            preview.innerHTML = '';
            preview.style.backgroundImage = `url(${e.target.result})`;
            preview.style.backgroundSize = 'cover';
            preview.style.backgroundPosition = 'center';
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('restaurant-review-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('restaurantId', restaurantId);
    const ratingElement = document.querySelector('.star-rating:checked');
    if (ratingElement) {
        formData.append('rating', ratingElement.value);
    } else {
        alert('Por favor, selecione uma avaliação.');
        return;
    }

    const tags = Array.from(document.querySelectorAll('.characteristics:checked')).map(el => el.value);
    formData.append('tags', tags.join(','));

    formData.append('caption', document.getElementById('review').value);
    formData.append('mediaFile', document.getElementById('restaurant-image').files[0]);
    formData.append('restaurantName', document.getElementById('restaurant-name').textContent);
    try {
        const response = await fetch(`https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/post/save?username=${encodeURIComponent(localStorage.getItem('username'))}&dXNlcklk=${encodeURIComponent(localStorage.getItem('dXNlcklk'))}`, {
            method: 'POST',
            headers: {
                'Authorization': `${localStorage.getItem('jwtToken')}`
            },
            body: formData
        });

        if (response.ok) {
            window.location.href = '../destaques';
        } else {
            const errorText = await response.text();
            errorMessage.textContent = `Erro ao salvar a avaliação: ${errorText}`;
            let textarea = document.getElementById('review');
            textarea.style.marginBottom = '0'; 
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        errorMessage.textContent = `Ocorreu um erro inesperado: ${error.message}`;
        let textarea = document.getElementById('review');
        textarea.style.marginBottom = '0'; 
        errorMessage.style.display = 'block';
    }
    

});

const starLabels = document.querySelectorAll('.star-label');

function colorStarsUpTo(index, color) {
    for (let i = 0; i <= index; i++) {
        starLabels[i].style.color = color;
    }
    for (let i = index + 1; i < starLabels.length; i++) {
        starLabels[i].style.color = '#ddd';
    }
}

starLabels.forEach((label, index) => {
    label.addEventListener('mouseover', () => {
    colorStarsUpTo(index, '#40D9A1');
    });

    label.addEventListener('mouseout', () => {
        colorStarsUpTo(index, '#40D9A1');
    });

    label.addEventListener('click', () => {
        for (let i = 0; i <= index; i++) {
            starLabels[i].style.color = '#40D9A1';
        }
    });
});

function back() {
    window.history.back();
}