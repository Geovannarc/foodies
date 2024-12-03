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
            const response = await fetch(`https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/post/get?username=${encodeURIComponent(localStorage.getItem('username'))}&dXNlcklk=${encodeURIComponent(localStorage.getItem('dXNlcklk'))}&exclusiveStartKey=${this.page}`, {
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
            if (!this.page) {
                this.hasMore = false;
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
                    <div class="user-avatar" style="background-image: url(https://profile-pic-foodies.s3.us-east-2.amazonaws.com/${post.username}.jpg);">
                    </div>
                    <div class="user-info">
                        <h2 class="user-name">${post.username}</h2>
                        <span class="post-time">${this.formatRelativeTime(post.dateCreation)}</span>
                    </div>
                </div>
                <img src=${post.mediaFile} alt="Post" class="post-image">
                <div class="post-content">
                    <div class="rating">
                        <div class="stars">${this.renderStars(parseFloat(post.rating))}</div>
                        <span>${post.rating}</span>
                    </div>
                    <div class="restaurant-name">${post.restaurantName}</div>
                    <p class="post-description"><span style="font-weight:600">@${post.username}<span> ${post.caption}</p>
                </div>
                <div class="post-actions">
                    <button class="action-button">
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

document.addEventListener('click', (e) => {
    if (e.target.closest('.action-button')) {
        const button = e.target.closest('.action-button');
        const icon = button.querySelector('i');
        
        if (icon.classList.contains('fa-heart')) {
            icon.classList.toggle('fas');
            icon.classList.toggle('far');
            const countElement = button.querySelector('span');
            let count = parseInt(countElement.textContent);
            countElement.textContent = icon.classList.contains('fas') ? count + 1 : count - 1;
        }
    }
});