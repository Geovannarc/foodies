document.addEventListener('DOMContentLoaded', async function () {
    const cuisineCheckboxesContainer = document.getElementById('cuisineCheckboxesContainer');

    try {
        const response = await fetch('https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/tag/listAll');
        if (!response.ok) {
            throw new Error('Erro ao buscar tags');
        }

        let tags = await response.json();
        tags = tags.message;

        cuisineCheckboxesContainer.innerHTML = '';

        tags.forEach(tag => {
            const checkboxWrapper = document.createElement('div');
            checkboxWrapper.classList.add(
                'btn',
                'btn-tags',
                'btn-cuisine',
                'mb-2',
                'align-items-center',
                'justify-content-center'
            );
        
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `tag-${tag.id}`;
            checkbox.value = tag.id;
            checkbox.style.display = 'none';
        
            const label = document.createElement('label');
            label.htmlFor = `tag-${tag.id}`;
            label.textContent = tag.name;
            label.classList.add('form-check-label', 'cursor-pointer', 'm-0');
        
            checkboxWrapper.addEventListener('click', function (event) {
                event.preventDefault();
                checkbox.checked = !checkbox.checked;

                this.classList.toggle('active', checkbox.checked);
        
                this.blur();
            });
        
            checkboxWrapper.appendChild(checkbox);
            checkboxWrapper.appendChild(label);
        
            cuisineCheckboxesContainer.appendChild(checkboxWrapper);
        });

    } catch (error) {
        console.error('Erro ao buscar ou processar as tags:', error);
    }
});
const saveButton = document.querySelector('.btn-advance');
saveButton.addEventListener('click', async function (event) {
    event.preventDefault()
    const selectedTags = Array.from(cuisineCheckboxesContainer.querySelectorAll('input[type="checkbox"]:checked'));
    const tagIds = selectedTags.map(checkbox => {
        return { id: checkbox.value };
    });

    if (tagIds.length > 0) {
        try {
            const username = localStorage.getItem('username');
            const jwtToken = localStorage.getItem(`jwtToken`);
        
            const saveResponse = await fetch(`https://cd0xq19jl6.execute-api.us-east-2.amazonaws.com/tag/add-user-tag?username=${encodeURIComponent(username)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwtToken
                },
                body: JSON.stringify(tagIds)
            });
        
            console.log('Status da resposta:', saveResponse.status);
        
            if (saveResponse.ok) {
                window.location.href = '../destaques/';
            } else {
                showError('Ocorreu um erro ao salvar as tags. Tente novamente.');
            }
        } catch (error) {
            console.error(error);
            showError('Ocorreu um erro ao salvar as tags. Tente novamente.');
        }
    } else {
        showError('Por favor, selecione ao menos uma tag');
    }
});

