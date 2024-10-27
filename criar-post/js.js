const restaurantId = new URLSearchParams(window.location.search).get('id');

//fetch(`https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/restaurant/${restaurantId}`)
  //  .then(response => response.json())
    //.then(restaurant => {
      //  document.getElementById('restaurant-name').textContent = restaurant.name;
        //document.getElementById('restaurant-id').value = restaurant.id;
    //});

    // (MOCKADO, mudar depois)
    // mock de um restaurante
    const restaurant = {
        id: 1,
        name: 'Restaurante Teste'
    };
    document.getElementById('restaurant-name').textContent = restaurant.name;
    document.getElementById('restaurant-id').value = restaurant.id;

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

document.getElementById('restaurant-review-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = {
        restaurant_id: formData.get('restaurant-id'),
        rating: formData.get('rating'),
        tags: formData.getAll('characteristics'),
        review: formData.get('review'),
        image: formData.get('restaurant-image')
    };

    console.log('Dados do formulário:', data);
    
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