// creating list of pokemons in main //
function getPokemonListTemplate(result) {
    return `
            <button id="pokemon-${result.id}" class="${result.types[0].type.name} section-pokemon" onclick="getDataModal(${result.id})">
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

// rendering pokemon types //
function getPokemonTypesTemplate(pokemon, index) {
    return `
            <li id="type-${pokemon.id}-${index}" class="${pokemon.types[index].type.name}">${pokemon.types[index].type.name}
            </li>
            `
}

// rendering modal-window for each pokemon //
function getModalTemplate(result) {
    return `
            <div id="modal-pokemon-${result.id}" class="modal-class ${result.types[0].type.name}">
                <section id="header-modal-${result.id}" class="header-modal" onclick="event.stopPropagation()"> 
                    <button id="close-button-icon-${result.id}" class="close-icon" aria-label="closing dialog" onclick="closeModal()"></button>
                    <h2 id="caption-pokemon-${result.id}" class="name name-modal">${result.name}</h2>
                    <span id="modal-id-${result.id}" class="id id-modal">#${result.id}</span>
                    <figure id="figure-modal-${result.id}" class="div-figure">
                        <figcaption id="type-modal-${result.id}" class="type type-modal">${getPokemonTypes(result)}</figcaption>
                        <img id="modal-img-${result.id}" class="pokemon-img modal-img" src="${result.sprites.other["official-artwork"].front_default}" alt="pokemon-img" onclick="event.stopPropagation()">
                    </figure>
                </section>
                <section id="modal-content-${result.id}" class="content-modal" onclick="event.stopPropagation()">
                    <div id="pokemon-modal-menu-${result.id}" class="pokemon-menu">
                        <button id="button-about-${result.id}" class="class-background" onclick="renderData(${result.id}, 'about'); getBackgroundBtn(${result.id}, this);">About</Button>
                        <button id="button-stats-${result.id}" onclick="renderData(${result.id}, 'stats'); getBackgroundBtn(${result.id}, this);">Stats</Button>
                        <button id="button-moves-${result.id}" onclick="renderData(${result.id}, 'moves'); getBackgroundBtn(${result.id}, this);">Moves</Button>
                        <button id="button-evo-${result.id}" onclick="renderData(${result.id}, 'evo'); getBackgroundBtn(${result.id}, this);">Evo Chain</Button>
                    </div>
                    <div id="menu-content-${result.id}" class="pokemon-data">

                    </div>
                    <div id="change-pokemon-${result.id}" class="change-pokemon">
                        <button id="prev-${result.id}" class="left" aria-label="go to previous gallery picture" onclick="renderFiltered(-1)"></button> 
                        <button id="next-${result.id}" class="right" aria-label="go to next gallery picture" onclick="renderFiltered(1)"></button>
                    </div>
                </section>
            </div>
            `
}

// rendering template for "About" Data //
function getAboutTemplate(result, species) {
    return `
            <table id="data-about-${result.id}" class="table">
                    <tr>
                        <td style="width: 27%;"><strong>Species</strong></td>
                        <td style="width: 73%;">${getSpecies(species)}</td>
                    </tr>
                    <tr>
                        <td><strong>Height</strong></td>
                        <td>${convertHeight(result.height)}</td>
                    </tr>
                    <tr>
                        <td><strong>Weight</strong></td>
                        <td>${convertWeight(result.weight)}</td>
                    </tr>
                    <tr>
                        <td><strong>Abilities</strong></td>
                        <td class="class-capitalize">${getAbilities(result)}</td>
                    </tr>
                    <tr>
                        <td class="breeding-class">Breeding</td>
                    </tr>
                    <tr>
                        <td class="gender-class">Gender</td>
                        <td class="gender-class">${getGender(species)}</td>
                    </tr>
                    <tr>
                        <td>Egg Groups</td>
                        <td class="class-capitalize">${getEggGroups(species)}</td>
                    </tr>
                    <tr>
                        <td>Egg Cycle</td>
                        <td>${getEggCycle(species)}</td>
                    </tr>
            </table>
            `
}

// rendering template for "Stats" Data //
function getStatsTemplate(result) {
    return `
            <div class="stats-bar">
                ${result.stats.map(s => `
                    <div class="light-grey">
                        <span class="name-stats">${s.stat.name}</span>
                        <div class="bar-wrapper">
                            <div class="container ${result.types[0].type.name}" style="width:${getPercStat(s.base_stat)}%">
                                <span class="stat">${s.base_stat}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
                <div class="light-grey stat-total">
                        <span class="name-stats"><strong>Base Stat Total</strong></span>
                        <div class="bar-wrapper">
                            <div class="container ${result.types[0].type.name}" style="width:${getPercBst(getSumBst(result))}%">
                                <span class="stat">${getSumBst(result)}</span>
                            </div>
                        </div>
                </div>
            </div>
            `
}

// rendering template for "Moves" Data //
function getMovesTemplate(result) {
    return `
            <div id="data-moves-${result.id}" class="table">
                    <div class="title-move">
                        <div style="width: 27%;"><strong>Moves</strong></div>
                        <div style="width: 73%;"></div>
                    </div>
                    <div class="moves-wrapper">
                        ${result.moves
                            .slice(0, 20)
                            .map(m => `
                            <div class="moves">
                                ${m.move.name}
                            </div>
                        `).join('')}    
                    </div>
            </div>
            `
}

// rendering template for "Evo Chain" Data //
function getEvoTemplate(result, evo) {
    return `
            <div id="evo-chain-${result.id}">
                ${renderEvolutionChain(evo.chain).map(name => `
                    <div class="class-evo">${name}</div>
                `).join("")}
            </div>
            `
}