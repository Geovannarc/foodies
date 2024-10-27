const API = {
    async searchRestaurants(term) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const restaurants = [
                    { id: 1, name: 'Restaurante Italiano', rating: 4.5 },
                    { id: 2, name: 'Sushi Bar', rating: 4.8 },
                    { id: 3, name: 'Churrascaria', rating: 4.2 },
                    { id: 4, name: 'Retaurante ABC', rating: 4.8 },
                    { id: 5, name: 'Sushi AKDCN', rating: 4.8 },
                    { id: 6, name: 'Bar KADJFSJ', rating: 4.2 },
                    { id: 7, name: 'Pizzaria Italia', rating: 4.6 },
                    { id: 8, name: 'Café Paris', rating: 4.3 },
                    { id: 9, name: 'Hamburgueria', rating: 4.7 },
                    { id: 10, name: 'Bar KADJFSJ', rating: 4.2 },
                    { id: 11, name: 'Pizzaria Italia', rating: 4.6 },
                    { id: 12, name: 'Café Paris', rating: 4.3 },
                    { id: 13, name: 'Hamburgueria', rating: 4.7 }
                ].filter(r => r.name.toLowerCase().includes(term.toLowerCase()));
                resolve(restaurants);
            }, 500);
        });
    },

    async searchUsers(term) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = [
                    { id: 1, name: 'Ana Silva', reviews: 42, followers: 156 },
                    { id: 2, name: 'João Santos', reviews: 28, followers: 89 },
                    { id: 3, name: 'Maria Oliveira', reviews: 65, followers: 231 },
                    { id: 4, name: 'Pedro Lima', reviews: 37, followers: 142 },
                    { id: 5, name: 'Clara Rocha', reviews: 51, followers: 198 },
                    { id: 6, name: 'Lucas Mendes', reviews: 23, followers: 76 },
                    { id: 7, name: 'Julia Costa', reviews: 45, followers: 167 },
                    { id: 8, name: 'Clara Rocha', reviews: 51, followers: 198 },
                    { id: 9, name: 'Lucas Mendes', reviews: 23, followers: 76 },
                    { id: 10, name: 'Julia Costa', reviews: 45, followers: 167 }
                ].filter(u => u.name.toLowerCase().includes(term.toLowerCase()));
                resolve(users);
            }, 700);
        });
    }
};

class SearchManager {
constructor() {
    this.currentSearchTerm = '';
    this.allRestaurants = [];
    this.allUsers = [];
    this.displayedRestaurants = 0;
    this.displayedUsers = 0;
    this.itemsPerPage = 6;
    this.isLoadingMore = false;
    this.showingOnlyRestaurants = false;

    this.setupInfiniteScroll();
    this.setUpClickEvents();
}

setupInfiniteScroll() {
    window.addEventListener('scroll', () => {
        if (this.isLoadingMore) return;
        
        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.documentElement.offsetHeight;
        
        if (scrollPosition >= documentHeight - 100) {
            this.loadMore();
        }
    });
    window.addEventListener('touchmove', () => {
        if (this.isLoadingMore) return;
        
        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.documentElement.offsetHeight;
        
        if (scrollPosition >= documentHeight - 100) {
            this.loadMore();
        }
    });
}

displayOnlyRestaurants = () => {
    this.showingOnlyRestaurants = true;
    this.showingOnlyUsers = false;
    this.displayedRestaurants = 6;
    this.displayedUsers = 0;
    this.renderResults();
}

displayOnlyUsers = () => {
    this.showingOnlyRestaurants = false;
    this.showingOnlyUsers = true;
    this.displayedRestaurants = 0;
    this.displayedUsers = 6;
    this.renderResults();
}

async handleSearch(searchTerm) {
    this.currentSearchTerm = searchTerm;
    this.showingOnlyRestaurants = false;
    this.showingOnlyUsers = false;
    this.displayedRestaurants = 0;
    this.displayedUsers = 0;
    
    try {
        resultsContainer.innerHTML = this.showSkeletonLoading();
        [this.allRestaurants, this.allUsers] = await Promise.all([
            API.searchRestaurants(searchTerm),
            API.searchUsers(searchTerm)
        ]);
        if (this.allRestaurants.length === 0 && this.allUsers.length === 0) {
            resultsContainer.innerHTML = '<div class="error-message">Nenhum resultado encontrado</div>';
            return;
        }
        this.renderResults();
    } catch (error) {
        resultsContainer.innerHTML = `
            <div class="error-message">
                Ocorreu um erro ao buscar os resultados. Por favor, tente novamente.
            </div>
        `;
        console.error('Erro na busca:', error);
    }
}

async loadMore() {
    if (this.isLoadingMore) return;
    if (!this.showingOnlyRestaurants && !this.showingOnlyUsers > 0) return;
    if (this.showingOnlyRestaurants) {
        if (this.displayedRestaurants >= this.allRestaurants.length) return;
    } else if (this.showingOnlyUsers) {
        if (this.displayedRestaurants >= this.allRestaurants.length && this.displayedUsers >= this.allUsers.length) return;
    }
    this.isLoadingMore = true;
    document.getElementById('loading-more').style.display = 'block';
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (this.showingOnlyRestaurants) {
        this.displayedRestaurants += this.itemsPerPage;
    } else {
        this.displayedRestaurants += this.itemsPerPage;
        this.displayedUsers += this.itemsPerPage;
    }
    
    this.renderResults();
    this.isLoadingMore = false;
    document.getElementById('loading-more').style.display = 'none';
}

showSkeletonLoading() {
    return `
        <div class="results-section">
            <div class="section-title">
                <span>Restaurantes</span>
                <span class="count skeleton">Carregando...</span>
            </div>
            <div class="restaurants-grid">
                ${Array(6).fill('').map(() => `
                    <div class="restaurant-card">
                        <div class="restaurant-image skeleton"></div>
                        <div class="restaurant-name skeleton">Nome Restaurante</div>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="results-section">
            <div class="section-title">
                <span>Usuários</span>
                <span class="count skeleton">Carregando...</span>
            </div>
            <div class="users-list">
                ${Array(3).fill('').map(() => `
                    <div class="user-card">
                        <div class="user-avatar skeleton"></div>
                        <div class="user-info">
                            <div class="user-name skeleton">Nome do Usuário</div>
                            <div class="user-stats skeleton">Carregando...</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

setUpClickEvents() {
    let onlyRestaurants = document.getElementById("onlyRestaurants");
    if (onlyRestaurants) {
        onlyRestaurants.addEventListener("click", this.displayOnlyRestaurants);
    }
    let onlyUsers = document.getElementById("onlyUsers");
    if (onlyUsers) {
        onlyUsers.addEventListener("click", this.displayOnlyUsers);
    }
}

renderResults() {
    const displayRestaurants = this.showingOnlyUsers ? [] : this.allRestaurants.slice(0, this.displayedRestaurants + this.itemsPerPage);
    const displayUsers = this.showingOnlyRestaurants ? [] : this.allUsers.slice(0, this.displayedUsers + this.itemsPerPage);

    let html = '';
    if (!this.showingOnlyUsers) {
        html += `
            <div class="results-section">
                <div class="section-title">
                    <span>Restaurantes</span>
                    <span id="onlyRestaurants" class="count">${this.allRestaurants.length} encontrados</span>
                </div>
        `;

        if (displayRestaurants.length > 0) {
        html += `
            <div class="restaurants-grid">
                ${displayRestaurants.map(restaurant => `
                    <div class="restaurant-card" data-id="${restaurant.id}">
                        <div class="restaurant-image"></div>
                        <div class="restaurant-name">${restaurant.name}</div>
                    </div>
                `).join('')}
            </div>
        `;
        } else {
            html += '<div class="no-results">Nenhum restaurante encontrado</div>';
        }
        html += '</div>';
    }

    if (displayUsers.length > 0) {
        html += `
            <div class="results-section">
                <div class="section-title">
                    <span>Usuários</span>
                    <span id="onlyUsers">${this.allUsers.length} encontrados</span>
                </div>
        `;

        if (displayUsers.length > 0) {
            html += `
                <div class="users-list">
                    ${displayUsers.map(user => `
                        <div class="user-card" data-id="${user.id}">
                            <div class="user-avatar"></div>
                            <div class="user-info">
                                <div class="user-name">${user.name}</div>
                                <div class="user-stats">${user.reviews} avaliações • ${user.followers} seguidores</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            html += '<div class="no-results">Nenhum usuário encontrado</div>';
        }
        html += '</div>';
    }

    resultsContainer.innerHTML = html;
    this.setUpClickEvents();
}

}

const searchManager = new SearchManager();
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');

let searchTimeout;
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => searchManager.handleSearch(searchTerm), 300);
});

searchManager.handleSearch('');

resultsContainer.addEventListener('click', (e) => {
    const restaurantCard = e.target.closest('.restaurant-card');
    const userCard = e.target.closest('.user-card');

    if (restaurantCard) {
        const id = restaurantCard.dataset.id;
        console.log('Restaurante clicado:', id);
    } else if (userCard) {
        const id = userCard.dataset.id;
        console.log('Usuário clicado:', id);
    }
});

function back() {
    window.location.reload();
}