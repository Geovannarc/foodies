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

};

class SearchManager {
constructor() {
    this.currentSearchTerm = '';
    this.allRestaurants = [];
    this.displayedRestaurants = 0;
    this.itemsPerPage = 12;
    this.isLoadingMore = false;
    this.loadingElement = document.getElementById('loading');
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
        <div id="loading" class="loading">
            <div class="loading-spinner"></div>
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
                    <span id="onlyRestaurants" class="count" onclick="searchManager.displayOnlyRestaurants()">${this.allRestaurants.length} encontrados</span>
                </div>
        `;
    
        if (displayRestaurants.length > 0) {
            html += `
                    <div class="users-list">
                        ${displayRestaurants.map(restaurant => `
                            <div class="user-card" data-id="${restaurant.id}" onclick="window.location.href='../?id=${encodeURIComponent(restaurant.id)}'">
                                <i class="fa fa-store" style="color: #40D9A1"></i>
                                <div class="user-info">
                                    <div class="user-name">${restaurant.name}</div>
                                    <div class="user-stats">${restaurant.number_rating} avaliações • ${restaurant.rating} ★</div>
                                </div>
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


resultsContainer.addEventListener('click', (e) => {
    const restaurantCard = e.target.closest('.restaurant-card');
    if (restaurantCard) {
        const id = restaurantCard.dataset.id;
        window.location.href = `../?id=${encodeURIComponent(id)}`;
    } 
});