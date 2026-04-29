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


