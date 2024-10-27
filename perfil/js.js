let contentRatings;
let contentLists;
let listasButton = document.getElementById('listas-link');
let avaliacoesButton = document.getElementById('avaliacoes-link');
async function changeContent(type) {
    let container = document.getElementById('content');
    let content = '';
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
            contentRatings = container.getHTML();
            console.log(container.getHTML());
            container.innerHTML = '';
            
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

async function getContentLists() {
    try {
        const response = await fetch('https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/profile/lists');
        if (!response.ok) {
            throw new Error('Erro ao buscar listas');
        }
        let lists = await response.json();
        lists = lists.message;
        for (let i = 0; i < lists.length; i++) {
            let list = lists[i];
            let listContent = '';
            for (let j = 0; j < list.content.length; j++) {
                listContent += `<div class="card">
                <div class="card-body">
                    <h5 class="card-title">${list.content[j].name}</h5>
                    <p class="card-text">${list.content[j].description}</p>
                    <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                </div>`;
            }
        }
        return listContent;
    } catch (error) {
        console.error('Erro ao buscar ou processar as tags:', error);
    }
}