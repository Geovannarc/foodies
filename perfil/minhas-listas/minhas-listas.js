document.addEventListener('DOMContentLoaded', function() {
    fetchLists();
});

async function fetchLists() {
    try {
        const response = await fetch('/listas');
        const lists = await response.json();
        displayLists(lists);
    } catch (error) {
        console.error('Error fetching lists:', error);
    }
}

function displayLists(lists) {
    const container = document.getElementById('listsContainer');
    lists.forEach(list => {
        const listElement = document.createElement('a');
        listElement.href = `/list/${list.id}`;
        listElement.className = 'list-item';
        listElement.innerHTML = `
            <div class="list-image"></div>
            <div>${list.name}</div>
        `;
        container.appendChild(listElement);
    });
}