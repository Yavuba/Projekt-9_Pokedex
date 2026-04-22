// creating list of pokemons in main //
function getPokemonListTemplate(result) {
    return `
            <section id="pokemon-${result.id}">
                <div id="card-layout-${result.id}">
                    <figure id="figure-${result.id}">
                        <img id="img-${result.id}" class="pokemon-img" src="${result.sprites.other["official-artwork"].front_default}" alt="pokemon-img">
                        <figcaption id="name-${result.id}" class="name">${result.name}</figcaption>
                        <figcaption id="id-${result.id}" class="id">#${result.id}</figcaption>
                    </figure>
                    <div id="type-${result.id}" class="type">${getPokemonTypes(result)}</div>
                </div>
            </section>
            `
}


