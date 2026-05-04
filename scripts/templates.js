// creating list of pokemons in main //
function getPokemonListTemplate(result) {
    return `
            <button id="pokemon-${result.id}" class="${result.types[0].type.name} section-pokemon" onclick="openModal(${result.id})">
                <div id="card-layout-${result.id}" class="layout-card">
                    <figure id="figure-${result.id}">
                        <img id="img-${result.id}" class="pokemon-img" src="${result.sprites.other["official-artwork"].front_default}" alt="pokemon-img">
                        <figcaption id="id-${result.id}" class="id">#${result.id}</figcaption>
                        <figcaption id="name-${result.id}" class="name">${result.name}</figcaption>
                    </figure>
                    <div id="type-${result.id}" class="type">${getPokemonTypes(result)}</div>
                </div>
            </button>
            `
}

// rendering modal-window for each pokemon //
function openModal(id) {
    return `
            <dialog id="myModal-${id}" class="modal" tabindex="0" aria-labelledby="caption" onclick="closeModal()" onkeydown="modalKeys(event)">
                <section id="header-modal-${id}" class="header-modal" onclick="event.stopPropagation()"> 
                    <button id="close-button-icon-${id}" class="close-icon" aria-label="closing dialog" onclick="closeModal()"></button>
                    <h2 id="caption-pokemon-${id}" class="title-modal"></h2>
                    <span id="modal-id-${id}" class="id"></span>
                    <div id="type-modal-${id}" class="type"></div>
                </section>
                <img id="modal-img-${id}" class="modal-pokemon-img" onclick="event.stopPropagation()">
                <section id="modal-content-${id}" class="content-modal" onclick="event.stopPropagation()">
                    <div id="pokemon-modal-menu-${id}" class="pokemon-menu">
                        <Button id="button-about-${id}">About</Button>
                        <Button id="button-stats-${id}">Stats</Button>
                        <Button id="button-moves-${id}">Moves</Button>
                        <Button id="button-evo-${id}">Evo Chain</Button>
                    </div>
                    <div id="menu-content-${id}" class="pokemon-data"></div>
                    <div id="change-pokemon-${id}"
                        <button id="prev-${id}" class="left" aria-label="go to previous gallery picture" onclick="renderFiltered(-1)"></button> 
                        <button id="next-${id}" class="right" aria-label="go to next gallery picture" onclick="renderFiltered(1)"></button>
                    </div>
                </section>
            </dialog>
            `
}

