async function fetchUserPosts(username) {
    const token = localStorage.getItem('jwtToken');
    try {
        const response = await fetch(`https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/post/getByUsername?username=${encodeURIComponent(username)}`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Erro ao buscar posts: ${response.statusText}`);
        }
        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error("Erro ao buscar posts:", error);
        return []; 
    }
}

function renderPosts(posts) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = ''; 

    for (let i = 0; i < posts.length; i += 4) {
        const row = document.createElement('div');
        row.className = 'row';

        posts.slice(i, i + 4).forEach(post => {
            const col = document.createElement('div');
            col.className = 'col-3 fill';

            const link = document.createElement('a');
            link.href = `../post/${post.postId}`;

            const img = document.createElement('img');
            img.className = 'w-100';
            img.src = post.mediaFile;
            img.alt = `Post ID: ${post.postId}`;
            img.title = `Post ID: ${post.postId}`;
            link.appendChild(img);
            col.appendChild(link);
            row.appendChild(col);
        });

        contentDiv.appendChild(row);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const username = localStorage.getItem('username'); 
    if (!username) {
        console.error("Usuário não está logado.");
        return;
    }

    const posts = await fetchUserPosts(username);
    renderPosts(posts);
});