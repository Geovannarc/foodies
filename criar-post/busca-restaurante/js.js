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

};

class SearchManager {
constructor() {
    this.currentSearchTerm = '';
    this.allRestaurants = [];
    this.displayedRestaurants = 0;
    this.itemsPerPage = 12;
    this.isLoadingMore = false;

    this.setupInfiniteScroll();
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

async handleSearch(searchTerm) {
    this.currentSearchTerm = searchTerm;
    this.displayedRestaurants = 0;
    
    try {
        resultsContainer.innerHTML = this.showSkeletonLoading();
        this.allRestaurants = await Promise.resolve(
            API.searchRestaurants(searchTerm)
        );
        if (this.allRestaurants.length === 0) {
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
    if (this.displayedRestaurants >= this.allRestaurants.length) return;
    this.isLoadingMore = true;
    document.getElementById('loading-more').style.display = 'block';
    
    await new Promise(resolve => setTimeout(resolve, 500));

    this.displayedRestaurants += this.itemsPerPage;
    
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
                ${Array(12).fill('').map(() => `
                    <div class="restaurant-card">
                        <div class="restaurant-image skeleton"></div>
                        <div class="restaurant-name skeleton">Nome Restaurante</div>
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
    const displayRestaurants = this.allRestaurants.slice(0, this.displayedRestaurants + this.itemsPerPage);

    let html = '';
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

    resultsContainer.innerHTML = html;
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
    if (restaurantCard) {
        const id = restaurantCard.dataset.id;
        window.location.href = `../?id=${encodeURIComponent(id)}`;
    } 
});