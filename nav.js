function createNav() {
    let nav = document.getElementById('nav');

    nav.innerHTML = `<nav class="navbar navbar-light">
        <ul class="navbar-nav d-flex flex-row">
         <li class="nav-item">
          <a class="nav-link" href="https://geovannarc.github.io/foodies/destaques">
           <i class="fas fa-home">
           </i>
          </a>
         </li>
         <li class="nav-item">
          <a class="nav-link" href="https://geovannarc.github.io/foodies/pesquisar">
           <i class="fas fa-search">
           </i>
          </a>
         </li>
         <li class="nav-item">
          <a class="nav-link" href="https://geovannarc.github.io/foodies/criar-post/busca-restaurante">
           <i class="fas fa-plus-square">
           </i>
          </a>
         </li>
         <li class="nav-item">
          <a class="nav-link" href="https://geovannarc.github.io/foodies/perfil/meu-perfil">
           <i class="fas fa-user">
           </i>
          </a>
         </li>
        </ul>
    </nav>`;
}
createNav();