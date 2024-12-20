let currentIndex = 0;
let posts = [];

function renderRating(containerId, rating) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; 

    const fullStars = Math.floor(rating); 
    const partialStar = rating % 1;
    const totalStars = 5;

    for (let i = 0; i < fullStars; i++) {
        const star = document.createElement("div");
        star.className = "star full";
        container.appendChild(star);
    }

    if (partialStar > 0) {
        const star = document.createElement("div");
        star.className = "star partial";
        star.style.background = `linear-gradient(to right, #40D9A1 ${partialStar * 100}%, #ccc ${partialStar * 100}%)`;
        container.appendChild(star);
    }

    for (let i = fullStars + (partialStar > 0 ? 1 : 0); i < totalStars; i++) {
        const star = document.createElement("div");
        star.className = "star";
        container.appendChild(star);
    }

    const ratingValue = document.createElement("span");
    ratingValue.style.placeSelf = "center";
    ratingValue.textContent = rating;
    container.appendChild(ratingValue);

}

function renderNumberOfRatings(containerId, numberOfRatings) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    const reviews = document.createElement("span");
    reviews.className = "reviews";
    reviews.textContent = `${numberOfRatings} avaliações`;
    container.appendChild(reviews);
}

function redirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    window.location.href = `../../criar-post/index.html?id=${encodeURIComponent(id)}`;
}


document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        try {
            const response = await fetch(`https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/establishment/findById?id=${encodeURIComponent(id)}`);
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados: ${response.statusText}`);
            }
            const data = await response.json();
            document.getElementById('name').textContent = data.message.name;
            document.getElementById('address').textContent = data.message.address;
            document.getElementById('address').href = `https://www.google.com/maps/place/${encodeURIComponent(data.message.address)}`;
            renderRating("star-rating", data.message.rating);
            renderNumberOfRatings("reviews", data.message.number_rating);
            try {
                const response = await fetch(`https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/post/getByRestaurantId?restaurantId=${encodeURIComponent(id)}`, {
                    method: 'GET',
                });
                if (!response.ok) {
                     throw new Error(`Erro ao buscar posts: ${response.statusText}`);
                }
                const data = await response.json();
                posts = data.message;
                renderPosts(posts);
            } catch (error) {
                console.error("Erro ao buscar posts:", error);
                return []; 
            }
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    } else {
        console.error('ID não fornecido na URL');
    }
});

function renderPosts(posts) {
    const feedContainer = document.getElementById('content'); 
    feedContainer.innerHTML = '';
    for (let i = 0; i < posts.length; i += 4) {
        const row = document.createElement('div');
        row.className = 'row';

        posts.slice(i, i + 4).forEach((post, idx) => {
            const col = document.createElement('div');
            col.className = 'col-3 fill';
            const img = document.createElement('img');
            img.className = 'w-100';
            img.style.cursor = 'pointer';
            img.src = post.mediaFile;
            img.addEventListener('click', () => openModal(i + idx)); 
            col.appendChild(img);
            row.appendChild(col);
        });

        feedContainer.appendChild(row);
    }
}
function openModal(index) {
    currentIndex = index;
    updateModalContent();
    document.getElementById('post-modal').style.display = 'flex';
}

const closeModalButton = document.getElementById('close-modal');
closeModalButton.addEventListener('click', () => {
    const modal = document.getElementById('post-modal');
    modal.style.display = 'none';
});

function updateModalContent() {
    const post = posts[currentIndex];
    document.getElementById('modal-image').src = post.mediaFile;
    document.getElementById('modal-caption').innerHTML =`<span style="font-weight:600">${post.username}</span> ${post.caption || 'Sem legenda'}`;
    document.getElementById('modal-rating').innerHTML = renderStars(post.rating);
    document.getElementById('modal-restaurant').textContent = post.restaurantName;
    document.getElementById('modal-likes').innerHTML = `<button class="action-button" data-id=${post.postId} onclick="likePost('${post.postId}')">
                        <i class="far fa-heart"></i>
                        <span>${post.likes}</span>
                    </button>`;
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return `
        ${`<i class="fas fa-star"></i>`.repeat(fullStars)}
        ${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
        ${`<i class="far fa-star"></i>`.repeat(emptyStars)}
    `;
}
function back() {
    window.history.back();
}
