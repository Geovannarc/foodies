class FeedManager {
    constructor() {
        this.page = 1;
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
            
            if (posts.length === 0) {
                this.hasMore = false;
            } else {
                this.renderPosts(posts);
                this.page++;
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
        return new Promise((resolve) => {
            setTimeout(() => {
                const posts = Array.from({ length: 10 }, (_, i) => ({
                    id: (this.page - 1) * 10 + i + 1,
                    user: {
                        name: `Usuário ${Math.floor(Math.random() * 100)}`,
                        avatar: null
                    },
                    restaurant: `Restaurante ${Math.floor(Math.random() * 50)}`,
                    rating: (Math.random() * 2 + 3).toFixed(0),
                    description: `Uma experiência incrível no ${this.page}º lote de posts! A comida estava excepcional e o ambiente muito agradável. ${Math.random().toString(36).substring(7)}`,
                    image: `../img/restaurante${Math.floor(Math.random() * 6)}.jpg`,
                    time: this.getRandomTime(),
                    likes: Math.floor(Math.random() * 100),
                    comments: Math.floor(Math.random() * 20)
                }));

                resolve(this.page <= 5 ? posts : []);
            }, 1000);
        });
    }

    getRandomTime() {
        const hours = Math.floor(Math.random() * 72);
        if (hours < 1) return 'Agora';
        if (hours < 24) return `${hours}h atrás`;
        const days = Math.floor(hours / 24);
        return `${days}d atrás`;
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
                    <div class="user-avatar"></div>
                    <div class="user-info">
                        <h2 class="user-name">${post.user.name}</h2>
                        <span class="post-time">${post.time}</span>
                    </div>
                </div>
                <img src=${post.image} alt="Post" class="post-image">
                <div class="post-content">
                    <div class="rating">
                        <div class="stars">${this.renderStars(parseFloat(post.rating))}</div>
                        <span>${post.rating}</span>
                    </div>
                    <div class="restaurant-name">${post.restaurant}</div>
                    <p class="post-description">${post.description}</p>
                </div>
                <div class="post-actions">
                    <button class="action-button">
                        <i class="far fa-heart"></i>
                        <span>${post.likes}</span>
                    </button>
                    <button class="action-button">
                        <i class="far fa-comment"></i>
                        <span>${post.comments}</span>
                    </button>
                </div>
            </div>
        `).join('');

        if (this.page === 1) {
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