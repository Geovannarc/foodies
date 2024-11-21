function createNav() {
    let nav = document.getElementById('nav');

    nav.innerHTML = `<nav class="navbar navbar-light">
        <ul class="navbar-nav d-flex flex-row">
         <li class="nav-item">
          <a class="nav-link" href="https://foodiesapp.com.br/destaques">
           <i class="fas fa-home">
           </i>
          </a>
         </li>
         <li class="nav-item">
          <a class="nav-link" href="https://foodiesapp.com.br/pesquisar">
           <i class="fas fa-search">
           </i>
          </a>
         </li>
         <li class="nav-item">
          <a class="nav-link" href="https://foodiesapp.com.br/criar-post/busca-restaurante">
           <i class="fas fa-plus-square">
           </i>
          </a>
         </li>
         <li class="nav-item">
          <a class="nav-link" href="https://foodiesapp.com.br/perfil/meu-perfil">
           <i class="fas fa-user">
           </i>
          </a>
         </li>
        </ul>
    </nav>`;
}
createNav();