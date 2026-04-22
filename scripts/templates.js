// creating list of pokemons in main //
function getPokemonListTemplate(result) {
    return `
            <section id="pokemon-${result.id}" class="section-pokemon">
                <div id="card-layout-${result.id}">
                    <figure id="figure-${result.id}" class="figure" >
                        <figcaption id="id-${result.id}" class="id">#${result.id}</figcaption>    
                        <figcaption id="name-${result.id}" class="name">${result.name}</figcaption>
                        <img id="img-${result.id}" class="pokemon-img" src="${result.sprites.other["official-artwork"].front_default}" alt="pokemon-img">
                    </figure>
                    <ul id="type-${result.id}" class="type">${getPokemonTypes(result)}</ul>
                </div>
            </section>
            `
}


