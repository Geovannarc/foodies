async function fetchUserPosts(username) {
    const token = localStorage.getItem('jwtToken');
    try {
        const response = await fetch(`https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/post/getByUsername?username=${encodeURIComponent(username)}`, {
            method: 'GET',
             headers: {
                 'Authorization': `${token}`
             }
        });
        if (!response.ok) {
             throw new Error(`Erro ao buscar posts: ${response.statusText}`);
        }
        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error("Erro ao buscar posts:", error);
        return []; 
    }
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

function renderFeed(posts) {
    const feedContainer = document.getElementById('content'); 
    feedContainer.innerHTML = '';
    for (let i = 0; i < posts.length; i += 4) {
        const row = document.createElement('div');
        row.className = 'row';

        posts.slice(i, i + 4).forEach(post => {
            const col = document.createElement('div');
            col.className = 'col-3 fill';
            const img = document.createElement('img');
            img.className = 'w-100';
            img.style.cursor = 'pointer';
            img.src = post.mediaFile;
            img.addEventListener('click', () => openModal(i)); 
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
    document.getElementById('modal-caption').textContent = post.caption || 'Sem legenda';
    document.getElementById('modal-rating').innerHTML = renderStars(post.rating);
    document.getElementById('modal-restaurant').textContent = post.restaurant;
    document.getElementById('modal-likes').innerHTML = `<i class="far fa-heart"></i><span> ${post.likes}</span>`;
}

let posts = [];

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    if (!username) {
        console.error("Erro ao buscar posts: Nome de usuário não encontrado.");
        return;
    }

    posts = await fetchUserPosts(username);
    renderFeed(posts);
});