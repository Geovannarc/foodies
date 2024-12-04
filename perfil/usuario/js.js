let currentIndex = 0;
let id;
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

async function followUser() {
    try {

        const response = await fetch(`https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/follow?username=${localStorage.getItem('username')}&following=${localStorage.getItem('dXNlcklk')}&follow=${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `${localStorage.getItem('jwtToken')}`
            }
        });
        if (!response.ok) {
            throw new Error(`Erro ao seguir usuário: ${response.statusText}`);
        }
        const data = await response.json();
        document.getElementById('follow-button').style.display = 'none';
        document.getElementById('unfollow-button').style.display = 'inline;';
        return data.message;
    } catch (error) {
        console.error("Erro ao seguir usuário:", error);
        return null;
    }
}

async function unfollowUser() {
    try {
        const response = await fetch(`https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/unfollow?username=${localStorage.getItem('username')}&following=${localStorage.getItem('dXNlcklk')}&unfollow=${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `${localStorage.getItem('jwtToken')}`
            }
        });
        if (!response.ok) {
            throw new Error(`Erro ao deixar de seguir usuário: ${response.statusText}`);
        }
        const data = await response.json();
        document.getElementById('follow-button').style.display = 'inline;';
        document.getElementById('unfollow-button').style.display = 'none';
        return data.message;
    } catch (error) {
        console.error("Erro ao deixar de seguir usuário:", error);
        return null;
    }
}

async function getProfile(params) {
    try {
        const response = await fetch(`https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/user/getProfile?username=${params}`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`Erro ao buscar usuário: ${response.statusText}`);
        }
        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return null;
    }
}

async function getIsFollowing(userId) {
    try {
        const response = await fetch(`https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/user/checkFollow?username=${localStorage.getItem('username')}&following=${localStorage.getItem('dXNlcklk')}&follower=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `${localStorage.getItem('jwtToken')}`
            }
        });
        if (!response.ok) {
            throw new Error(`Erro ao buscar usuário: ${response.statusText}`);
        }
        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return null;
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
    document.getElementById('modal-likes').innerHTML = `<i class="far fa-heart"></i><span> ${post.likes}</span>`;
}

let posts = [];

function renderProfile(profile) {
    document.getElementById('profile-pic').src = profile.imageURL;
    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-username').textContent = `@${profile.username}`;
    document.getElementById('profile-bio').textContent = profile.bio;
    document.getElementById('profile-followers').textContent = profile.followercount;
    document.getElementById('profile-following').textContent = profile.followingcount;
    document.getElementById('profile-posts').textContent = profile.postcount;
    renderFollowButton(profile);
}

async function renderFollowButton(profile) {
    if (profile.username === localStorage.getItem('username')) {
        document.getElementById('follow-button').style.display = 'none';
        document.getElementById('unfollow-button').style.display = 'none';
    } else {
        if(await getIsFollowing(profile.userId) == true) {
            document.getElementById('follow-button').style.display = 'none';
            document.getElementById('unfollow-button').style.display = 'inline';
        } else {
            document.getElementById('follow-button').style.display = 'inline';
            document.getElementById('unfollow-button').style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    if (!username) {
        console.error("Erro ao buscar posts: Nome de usuário não encontrado.");
        return;
    }
    let profile = await getProfile(username);
    renderProfile(profile);
    id = profile.userId;
    posts = await fetchUserPosts(username);
    renderFeed(posts);
});