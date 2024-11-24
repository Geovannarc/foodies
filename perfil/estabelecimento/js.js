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
            //document.getElementById('reviews').textContent = data.message.number_rating;
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    } else {
        console.error('ID não fornecido na URL');
    }
});

function back() {
    window.history.back();
}
