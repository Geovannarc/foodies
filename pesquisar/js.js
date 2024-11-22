const filterContainer = document.getElementById('filters');
const content = `<div class="row">
                <div class="col-6 filter">
                    <button class="btn btn-primary pd-3" id="near-me-filter">
                        <i class="fas fa-2x fa-map-marker-alt"></i>
                        <p class="mt-1 mb-0">Perto de mim</p>
                    </button>
                </div>
                <div class="col-6 filter">
                    <button class="btn btn-primary pd-3" id="rating-filter">
                        <i class="far fa-2x fa-star"></i>
                        <p class="mt-1 mb-0">Bem avaliados</p>
                    </button>
                </div>
            </div>
            <div class="row">
                <div class="col-6 filter">
                    <button class="btn btn-primary pd-3 category-filter" id="3">
                        <i class="fas fa-2x fa-beer"></i>
                        <p class="mt-1 mb-0">Bares</p>
                    </button>
                </div>
                <div class="col-6 filter">
                    <button class="btn btn-primary pd-3 category-filter" id="4">
                        <i class="far fa-2x fa-heart"></i>
                        <p class="mt-1 mb-0">Ótimo para encontros</p>
                    </button>
                </div>
            </div>
            <div class="row">
                <div class="col-6 filter">
                    <button class="btn btn-primary pd-3 category-filter" id="5">
                        <i class="fas fa-2x fa-seedling"></i>
                        <p class="mt-1 mb-0">Vegetariano</p>
                    </button>
                </div>
                <div class="col-6 filter">
                    <button class="btn btn-primary pd-3 category-filter" id="6">
                        <i class="fas fa-2x fa-ice-cream"></i>
                        <p class="mt-1 mb-0">Doces</p>
                    </button>
                </div>
            </div>`
filterContainer.innerHTML = content;



let resultsContainer = document.getElementById('results-container');
const API = {
    async searchRestaurants(term) {
        try {
            const response = await fetch(`https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/establishment/find?name=${encodeURIComponent(term)}`);
            if (!response.ok) {
                throw new Error(`Erro ao buscar restaurantes: ${response.statusText}`);
            }
            const data = await response.json();
            return Array.from(data.message); 
        } catch (error) {
            console.error("Erro ao buscar restaurantes:", error);
            return []; 
        }
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
    },

    async getRestaurantsByLocation(latitude, longitude) {
        try {
            const response = await fetch(`https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/establishment/find?latitude=${latitude}&longitude=${longitude}`)
            if (!response.ok) {
                throw new Error(`Erro ao buscar restaurantes: ${response.statusText}`);
            }
            const data = await response.json();
            return Array.from(data.message); 
        } catch (error) {
            console.error("Erro ao buscar restaurantes:", error);
            return []; 
        }
    },

    async filterByRating() {
        try {
            const response = await fetch(`https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/establishment/find/rating`)
            if (!response.ok) {
                throw new Error(`Erro ao buscar restaurantes: ${response.statusText}`);
            }
            const data = await response.json();
            return Array.from(data.message); 
        } catch (error) {
            console.error("Erro ao buscar restaurantes:", error);
            return []; 
        }
    },

    async filterByCategory(category) {
        try {
            const response = await fetch(`https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/establishment/find/category?category=${category}`)
            if (!response.ok) {
                throw new Error(`Erro ao buscar restaurantes: ${response.statusText}`);
            }
            const data = await response.json();
            return Array.from(data.message); 
        } catch (error) {
            console.error("Erro ao buscar restaurantes:", error);
            return []; 
        }
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
        this.setupSearchInput();
        this.setupNearMeFilter();
        this.setUpRatingFilter();
        this.setUpCategoryFilter();
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
    }

    setupSearchInput() {
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (event) => {
            this.handleSearch(event.target.value);
        });
    }

    setupNearMeFilter() {
        const nearMeFilter = document.getElementById('near-me-filter');
        nearMeFilter.addEventListener('click', () => {
            this.setupFilterNearMe();
        });
    }

    setUpRatingFilter() {
        const ratingFilter = document.getElementById('rating-filter');
        ratingFilter.addEventListener('click', () => {
            this.filterByRating();
        });
    }

    setUpCategoryFilter() {
        const categoryFilter = document.querySelectorAll('.category-filter');
        categoryFilter.forEach((element) => {
            element.addEventListener('click', (event) => {
                this.filterByCategory(event);
            });
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
        if (searchTerm === '') {
            filterContainer.innerHTML = content;
            resultsContainer.innerHTML = '';
            return;
        } else {
            filterContainer.innerHTML = '';
        }
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
            
            this.renderResults();
        } catch (error) {
            filterContainer.innerHTML = '';
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
        if (!this.showingOnlyRestaurants && !this.showingOnlyUsers) return;
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

    renderResults() {
        const displayRestaurants = this.allRestaurants.slice(0, this.displayedRestaurants + this.itemsPerPage);
        const displayUsers = this.showingOnlyRestaurants ? [] : this.allUsers.slice(0, this.displayedUsers + this.itemsPerPage);
    
        let html = '';
        html += `
            <div class="results-section">
                <div class="section-title">
                    <span>Restaurantes</span>
                    <span id="onlyRestaurants" class="count" onclick="searchManager.displayOnlyRestaurants()">${this.allRestaurants.length} encontrados</span>
                </div>
        `;
    
        if (displayRestaurants.length > 0) {
            html += `
                <div class="restaurants-grid">
                    ${displayRestaurants.map(restaurant => `
                        <div class="restaurant-card" data-id="${restaurant.id}">
                            <div class="restaurant-image" onclick="window.location.href='../perfil/estabelecimento/index.html?id=${encodeURIComponent(restaurant.id)}'"></div>
                            <div class="restaurant-name" onclick="window.location.href='../perfil/estabelecimento/index.htmlid=${encodeURIComponent(restaurant.id)}'">${restaurant.name}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            html += '<div class="no-results">Nenhum restaurante encontrado</div>';
        }
        html += '</div>';
    
        if (displayUsers.length > 0) {
            html += `
                <div class="results-section">
                    <div class="section-title">
                        <span>Usuários</span>
                        <span id="onlyUsers" class="count" onclick="searchManager.displayOnlyUsers()">${this.allUsers.length} encontrados</span>
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
    }

    setupFilterNearMe() {
        let latitude, longitude;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        latitude = position.coords.latitude;
                        longitude = position.coords.longitude;
                        const result = API.getRestaurantsByLocation(latitude, longitude);
                        this.allRestaurants = Array.from(result);
                        this.displayOnlyRestaurants();
                    },
                    (error) => {
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                console.error("Permissão de geolocalização negada pelo usuário.");
                                break;
                            case error.POSITION_UNAVAILABLE:
                                console.error("Informações de localização indisponíveis.");
                                break;
                            case error.TIMEOUT:
                                console.error("O tempo para obter a localização expirou.");
                                break;
                            default:
                                console.error("Ocorreu um erro desconhecido.");
                        }
                    }
                );
            } else {
                output.textContent = "Geolocalização não é suportada neste navegador.";
            }
    }

    filterByRating() {
        const result = API.filterByRating();
        this.allRestaurants = result;
        this.displayOnlyRestaurants();
    }

    filterByCategory(event) {
        const category = event.target.id;
        const result = API.filterByCategory(category);
        this.allRestaurants = result;
        this.displayOnlyRestaurants();
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
}

const searchManager = new SearchManager();