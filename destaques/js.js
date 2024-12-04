class FeedManager {
    constructor() {
        this.page = null;
        this.loading = false;
        this.hasMore = true;
        this.feedContainer = document.getElementById('feed-container');
        this.loadingElement = document.getElementById('loading');
        this.setupInfiniteScroll();
        this.loadPosts();
    }

    async loadPosts() {
        if (this.loading || !this.hasMore) return;

        this.loading = true;
        this.loadingElement.style.display = 'block';

        try {
            const posts = await this.fetchPosts();
            
            if (posts.length <= 0) {
                this.hasMore = false;
            } else {
                this.renderPosts(posts);
            }
        } catch (error) {
            this.showError('Erro ao carregar os posts. Por favor, tente novamente.');
            console.error('Error loading posts:', error);
        } finally {
            this.loading = false;
            this.loadingElement.style.display = 'none';
        }
    }

    async fetchPosts() {
        try {
            const exclusiveStartKey = this.page ? encodeURIComponent(JSON.stringify(this.page)) : null;
            const response = await fetch(`https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/post/get?username=${encodeURIComponent(localStorage.getItem('username'))}&dXNlcklk=${encodeURIComponent(localStorage.getItem('dXNlcklk'))}&exclusiveStartKey=${exclusiveStartKey}`, {
                method: 'GET',
                 headers: {
                     'Authorization': `${localStorage.getItem('jwtToken')}`
                 }
            });
            if (!response.ok) {
                 throw new Error(`Erro ao buscar posts: ${response.statusText}`);
            }
            const data = await response.json();
            this.page = data.message.exclusiveStartKey;
            if (this.page == null) {
                this.hasMore = false;
                this.page = 0;
            }
            return data.message.posts;
        } catch (error) {
            console.error("Erro ao buscar posts:", error);
            return []; 
        }
    }

    formatRelativeTime(dateString) {
        const date = new Date(dateString.replace(' ', 'T')); 
        const now = new Date();
        const diffMs = now - date; 
        const diffMinutes = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffWeeks = Math.floor(diffDays / 7);
    
        if (diffHours < 1) {
            return "agora";
        } else if (diffDays < 1) {
            return `${diffHours} ${diffHours === 1 ? "hora" : "horas"} atrás`;
        } else if (diffDays < 7) {
            return `${diffDays} ${diffDays === 1 ? "dia" : "dias"} atrás`;
        } else if (diffWeeks < 4) {
            return `${diffWeeks} ${diffWeeks === 1 ? "semana" : "semanas"} atrás`;
        } else {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('pt-BR', options);
        }
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return `
            ${`<i class="fas fa-star"></i>`.repeat(fullStars)}
            ${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
            ${`<i class="far fa-star"></i>`.repeat(emptyStars)}
        `;
    }

    renderPosts(posts) {
        const postsHTML = posts.map(post => `
            <div class="post-card">
                <div class="post-header">
                    <a href="../perfil/usuario?username=${post.username}" class="user-avatar" 
                       style="background-image: url(https://profile-pic-foodies.s3.us-east-2.amazonaws.com/${post.username}.jpg);">
                    </a>
                    <div class="user-info">
                        <a href="../perfil/usuario?username=${post.username}" class="user-name">
                            ${post.username}
                        </a>
                        <span class="post-time">${this.formatRelativeTime(post.dateCreation)}</span>
                    </div>
                </div>
                <img src="${post.mediaFile}" alt="Post" class="post-image">
                <div class="post-content">
                    <div class="rating">
                        <div class="stars">${this.renderStars(parseFloat(post.rating))}</div>
                        <span>${post.rating}</span>
                    </div>
                    <a href="../perfil/estabelecimento?id=${post.restaurantId}" class="restaurant-name">
                        ${post.restaurantName}
                    </a>
                    <p class="post-description">
                        <span style="font-weight:600">@${post.username}</span> ${post.caption}
                    </p>
                </div>
                <div class="post-actions">
                    <button class="action-button" data-id=${post.postId} onclick="likePost('${post.postId}')">
                        <i class="far fa-heart"></i>
                        <span>${post.likes}</span>
                    </button>
                </div>
            </div>
        `).join('');

        if (this.page === null) {
            this.feedContainer.innerHTML = postsHTML;
        } else {
            this.feedContainer.insertAdjacentHTML('beforeend', postsHTML);
        }
    }

    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        this.feedContainer.appendChild(errorElement);

        setTimeout(() => {
            errorElement.remove();
        }, 3000);
    }

    setupInfiniteScroll() {
        window.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            
            if (scrollTop + clientHeight >= scrollHeight - 300) { 
                this.loadPosts();
            }
        });
    }
}

const feedManager = new FeedManager();

async function likePost(id) {
    const button = document.querySelector(`.action-button[data-id="${id}"]`);
    const icon = button.querySelector('i');
    if(icon.classList.contains('far')) {
        try {
            const exclusiveStartKey = this.page ? encodeURIComponent(JSON.stringify(this.page)) : null;
            const response = await fetch(`https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/like?username=${encodeURIComponent(localStorage.getItem('username'))}&dXNlcklk=${encodeURIComponent(localStorage.getItem('dXNlcklk'))}&postId=${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `${localStorage.getItem('jwtToken')}`
                }
            });
            if (!response.ok) {
                throw new Error(`Erro: ${response.statusText}`);
            }
            icon.classList.remove('far');
            icon.classList.add('fas');
        } catch (error) {
            console.error("Erro ao buscar posts:", error);
            return []; 
        }
    } else {
        try {
            const response = await fetch(`https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/unlike?username=${encodeURIComponent(localStorage.getItem('username'))}&dXNlcklk=${encodeURIComponent(localStorage.getItem('dXNlcklk'))}&postId=${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `${localStorage.getItem('jwtToken')}`
                }
            });
            if (!response.ok) {
                throw new Error(`Erro: ${response.statusText}`);
            }
            icon.classList.remove('fas');
            icon.classList.add('far');
        } catch (error) {
            console.error("Erro ao buscar posts:", error);
            return []; 
        }
    }

}
