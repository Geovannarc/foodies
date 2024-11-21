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