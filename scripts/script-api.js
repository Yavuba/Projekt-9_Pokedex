// variables //
let pokeapiArray = [];
let pokeTypesArray = [];
let currentPokemon = [];

let pokeMainCache = {};
let pokeSpeciesCache = {};
let pokeEvoCache = {};

let currentSpecies = null;
let currentEvo = null;
let currentIndex = 0;
let currentSection = 'about';

let modal = document.getElementById("modal");

// init function for calling api-data //
async function init() {
    await getAllPokemonTypesfromApi();  
    await getUrlData("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20");
    await getPokemonMainData();
}

// reusable fetch function // 
async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return await response.json();
}

// get all pokemon types of poke-api for defining classes//
async function getAllPokemonTypesfromApi () {
  try {
    const data = await fetchJson("https://pokeapi.co/api/v2/type/");

    data.results.forEach(pokemon => {
      pokeTypesArray.push(pokemon.name);
    });

  } catch (error) {
    console.error(error.message);
  }
}

// get url-data for loading pokemon //
async function getUrlData(url) {
  try {
    const data = await fetchJson(url);
  
    data.results.forEach(pokemon => {
      pokeapiArray.push(pokemon.url);
    });

  } catch (error) {
    console.error(error.message);
  }
}

// get Pokemon main-data //
async function getPokemonMainData() {
  let contentRef = document.getElementById('pokemon-content');
  contentRef.innerHTML = "";

  showLoadingSpinner();

  try {
    for (const pokemonUrl of pokeapiArray) {
      const result = await fetchJson(pokemonUrl);

      pokeMainCache[result.id] = result;
      renderPokemonList(result);
    }

  } catch (error) {
    console.error(error.message);

  } finally {
    hideLoadingSpinner();
  }
}

// fetch data for species //
async function getSpeciesData(id) {
    if (pokeSpeciesCache[id]) {
        return pokeSpeciesCache[id];
      }
  
    try {
      const url = pokeMainCache[id].species.url;
      const data = await fetchJson(url);
  
      pokeSpeciesCache[id] = data;
      return data;
  
    } catch (error) {
      console.error(error.message);
    }
  }
  
  // fetch data for evo chain //
  async function getEvoData(id) {
    if (pokeEvoCache[id]) {
        return pokeEvoCache[id];
      }
  
    try {
      const url = pokeSpeciesCache[id].evolution_chain.url;
      const data = await fetchJson(url);
  
      pokeEvoCache[id] = data;
      return data;
  
    } catch (error) {
      console.error(error.message);
    }
  }
  
  async function getEvolutionData(evoChain, resultId) {
    const evolutions = renderEvolutionChain(evoChain);
  
    const evoData = await Promise.all(
      evolutions.map(async (name) => { const evoImg = await getEvoImg(name, resultId);
        return {
          name,
          src: evoImg.src,
          shadow: evoImg.shadow
        };
      })
    );
  
    return evoData;
  }
  
  // render-function to create pokemon-list in HTML //
  function renderPokemonList(result) {
      let contentRef = document.getElementById('pokemon-content');
      contentRef.innerHTML += getPokemonListTemplate(result);
  }
  
  // get all type-information for pokemon //
  function getPokemonTypes(pokemon) {
    let text = "";
    for (let i = 0; i < pokemon.types.length; i++) {
        text += getPokemonTypesTemplate(pokemon, i);
    }
    return text;
  }
  
  // loading next 20 pokemon via button "Add more pokemon" //
  async function loadMorePokemon() {
    filterAndShowCurrentPokemon(""); 
    showLoadingSpinner();
  
    let offset = pokeapiArray.length;
    let newUrl = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=20`;
    
    try {
      const data = await fetchJson(newUrl);
  
      for (const pokemon of data.results) {
        pokeapiArray.push(pokemon.url);
        const result = await fetchJson(pokemon.url);
  
        pokeMainCache[result.id] = result;
        renderPokemonList(result);
      }
  
    } catch (error) {
      console.error(error.message);
  
    } finally {
      hideLoadingSpinner();
      moveSpinner();
    }
  }

  // functions for getting pokemon data - EVO CHAIN //

async function getPokemonByName(name) {
    const cached = Object.values(pokeMainCache)
      .find(pokemon => pokemon.name === name);
  
    if (cached) {
      return cached;
    }
    const data = await fetchJson(
      `https://pokeapi.co/api/v2/pokemon/${name}`
    );
  
    pokeMainCache[data.id] = data;
    return data;
  }
  
  function renderEvolutionChain(chain, container = []) {
    if (!chain) return container;
  
    container.push(chain.species.name);
  
    for (const evolution of chain.evolves_to) {
      renderEvolutionChain(evolution, container);
    }
  
    return container;
  }
  
  async function getEvoImg(name, id) {
    const pokemon = await getPokemonByName(name);
  
    if (!pokemon) {
      return { src: "", shadow: "" };
    }
  
    const evoImg = pokemon.sprites.other["official-artwork"].front_default;
    const shadowClass = getShadow(evoImg, id);
  
    return {
      src: evoImg,
      shadow: shadowClass
    };
  }
  
  function getShadow(src, id) {
    let modalImg = document.getElementById(`modal-img-${id}`);
    
    if (src === modalImg.src) {
      return "shadow";
    }
    return "";
  }

  // function for rendering overlay //
async function renderData(id, type) {
    const contentRef = document.getElementById('menu-content-' + id);
    const data = pokeMainCache[id];
  
    const templates = {
      about: async () => getAboutTemplate(data, currentSpecies),
      stats: async () => getStatsTemplate(data),
      moves: async () => getMovesTemplate(data),
      evo: async () => {
        const evoData = await getEvolutionData(currentEvo.chain, data.id);
        return getEvoTemplate(data, evoData);
      }
    };
  
    const template = templates[type];
    contentRef.innerHTML = await template();
  }