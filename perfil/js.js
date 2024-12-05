let contentRatings = document.getElementById('content').getHTML();
let contentLists;
let listasButton = document.getElementById('listas-link');
let avaliacoesButton = document.getElementById('avaliacoes-link');
let container = document.getElementById('content');
async function changeContent(type) {
    if (type === 'listas') {
        try {
            let listContent;
            listasButton.classList.add('active');
            avaliacoesButton.classList.remove('active');
            if (!contentLists) {
                listContent = getContentLists();
            } else {
                listContent = contentLists;
            }
            container.innerHTML = listContent;
        } catch (error) {
            console.error('Erro ao buscar ou processar as tags:', error);
        }
    
    } else if (type === 'avaliacoes') {
        listasButton.classList.remove('active');
        avaliacoesButton.classList.add('active');
        contentLists = container.getHTML();
        if(contentRatings) {
            container.innerHTML = contentRatings;
        } else {
            container.innerHTML = '';
        }
    }
}

function getContentLists() {
    try {
        //const response = await fetch('https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/profile/lists');
        //if (!response.ok) {
          //  throw new Error('Erro ao buscar listas');
        //}
        //let lists = await response.json();
        //lists = lists.message;
        contentRatings = container.getHTML();
        let lists = [
            {
                name: 'Lista 1',
                id: 123
            },
            {
                name: 'Lista 2',
                id: 12345
            }
        ]
        let listContent = `
        <div class="lists-container">
            <div class="lists-grid">
                <div class="list-card add-list-card" id="addListCard">
                    <i class="fas fa-2x fa-plus-circle"></i>
                </div>
        `;
        for (let i = 0; i < lists.length; i++) {
                listContent += `<div class="list-card">
            <div class="list-preview">
                <i class="far fa-2x fa-bookmark"></i>
                <p>${lists[i].name}</p>
            </div>
            </div>`;
        }
        listContent += '</div></div>';
        return listContent;
    } catch (error) {
        console.error('Erro ao buscar ou processar as tags:', error);
    }
}

async function likePost(id) {
    const button = document.querySelector(`.action-button[data-id="${id}"]`);
    const icon = button.querySelector('i');
    if(icon.classList.contains('far')) {
        try {
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
    const countElement = button.querySelector('span');
    let count = parseInt(countElement.textContent);
    countElement.textContent = icon.classList.contains('fas') ? count + 1 : count - 1;
}