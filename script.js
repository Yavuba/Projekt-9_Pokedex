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
    await getUrlData();
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

// get url-data for first 20 pokemon //
async function getUrlData() {
  try {
    const data = await fetchJson("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20");
    
    data.results.forEach(pokemon => {
      pokeapiArray.push(pokemon.url);
    });

  } catch (error) {
    console.error(error.message);
  }
}

// get Pokemon main-data //
async function getPokemonMainData() {
  let contentRef = document.getElementById('content');
  contentRef.innerHTML = "";

  for (const pokemonUrl of pokeapiArray) {
    try {
        const result = await fetchJson(pokemonUrl);

        pokeMainCache[result.id] = result;
        renderPokemonList(result);
        
    } catch (error) {
      console.error(error.message);
    }
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

// render-function to create pokemon-list in HTML //
function renderPokemonList(result) {
    let contentRef = document.getElementById('content');
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

// filter function in header //
function filterAndShowCurrentPokemon(filterWord) {
  let contentRefAlert = document.getElementById('alert-text');
  let contentRef = document.getElementById("content");
  
  if (filterWord.length < 3 && filterWord.length > 0) {
  contentRefAlert.classList.remove('hidden');
  document.getElementById('alert-text').innerHTML = 'Please enter at least 3 characters!';
  
  } else {
  contentRefAlert.classList.add('hidden');
  contentRef.innerHTML = "";

  currentPokemon = Object.values(pokeMainCache).filter(pokemon =>
  pokemon.name.toLowerCase().includes(filterWord.toLowerCase()));
  currentPokemon.forEach(pokemon => {renderPokemonList(pokemon);});
  checkFilteredPokemon(currentPokemon.length);
  }
}

function checkFilteredPokemon(pokemon) {
  if (pokemon === 0) {
    document.getElementById('content').innerHTML = 'No matching Pokémon found.'
  }
}
// modal functions //

// get data and open modal // 
async function getDataModal(id) {
  currentIndex = id;
  document.body.classList.add('no-scroll');
  let contentRef = document.getElementById('modal');
  let data = pokeMainCache[id];

  contentRef.innerHTML = getModalTemplate(data);
  modal.showModal();
  
  currentSpecies = await getSpeciesData(id);
  currentEvo = await getEvoData(id);

  checkModalWindow(id);
}

function checkModalWindow(id) {
  const section = currentSection;
  renderData(id, section);

  const btn = document.getElementById(`button-${section}-${id}`);
  getBackgroundBtn(id, btn);
}

// get class for formatting buttons background //
function getBackgroundBtn(id, btn) {
  const buttons = ['about', 'stats', 'moves', 'evo'];

  buttons.forEach(name => { const element = document.getElementById(`button-${name}-${id}`);
  element.classList.remove("class-background");});

  btn.classList.add("class-background");
}

function handlePokemonChange(id, section, btn) {
  currentSection = section;
  renderData(id, section);

  getBackgroundBtn(id, btn);
}

// closing modal //
function closeModal() {
  currentSection = 'about';
  document.body.classList.remove('no-scroll');
  modal.close();
}

// moving to previous or next pokemon with arrow-keys //
function modalKeys(event) {
  if (event.key === "ArrowLeft") {
      event.preventDefault();     
      renderFiltered(-1);
      return;                        
  }
  if (event.key === "ArrowRight") {
      event.preventDefault();
      renderFiltered(1);
      return;
  }
}

// change modal-window, prev or next (1 or -1) //
function renderFiltered(direction) {
  currentIndex += direction;
  const total = Object.keys(pokeMainCache).length

  if (currentIndex < 1) {
      currentIndex = total;
  }

  if (currentIndex > total) {
      currentIndex = 1;
  }
  getDataModal(currentIndex);
}

// function for rendering overlay //
function renderData(id, type) {
  const contentRef = document.getElementById('menu-content-' + id)
  const data = pokeMainCache[id];

  const templates = {
    about: () => getAboutTemplate(data, currentSpecies),
    stats: () => getStatsTemplate(data),
    moves: () => getMovesTemplate(data),
    evo: () => getEvoTemplate(data, currentEvo)
  };
  const template = templates[type];
  contentRef.innerHTML = template();
}

// functions for formatting/getting pokemon data - ABOUT //

function convertHeight(value) {
  const totalInches = Math.round(value * 3.937);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  const result = "("+(value * 10)+ " cm)";

  return `${feet}'${inches}" ${result}`;
}

function convertWeight(value) {
  const kg = (value / 10).toFixed(1);
  const lbs = (kg * 2.20462).toFixed(1);
  
  return `${lbs} lbs (${kg} kg)`;
}

function getAbilities(pokemon) {
  return pokemon.abilities
  .map(a => a.ability.name)
  .join(", ");
}

function getSpecies(species) {
  return species.genera.find(g => g.language.name === "en").genus;
}

function getGender(species) {
  const rate = species.gender_rate;

  if (rate === -1) return "Genderless";

  const female = (rate / 8) * 100;
  const male = 100 - female;

  return `${male}% ♂ / ${female}% ♀`;
}

function getEggGroups(species) {
  return species.egg_groups.map(g => g.name).join(", ");
}

function getEggCycle(species) {
  const steps = species.hatch_counter * 255;
  return `${species.hatch_counter} (${steps.toLocaleString('de-DE')} steps)`;
}

// functions for formatting/getting pokemon data - STATS //

function getPercStat(value) {
  const percent = (value / 255) * 100;

  return percent;
}

function getSumBst(pokemon) {
  let total = 0;

  for (const stat of pokemon.stats) {
    total += stat.base_stat;
  }
  return total;
}

function getPercBst(total) {
  const percent = (total / 720) * 100;

  return percent;
}

// functions for getting pokemon data - EVO CHAIN //
function renderEvolutionChain(chain, container = []) {
  if (!chain) return container;

  container.push(chain.species.name);

  for (const evolution of chain.evolves_to) {
    renderEvolutionChain(evolution, container);
  }

  return container;
}

function getEvoImg(name, id) {
  const pokemon = Object.values(pokeMainCache).find(p => p.name === name);

  if (!pokemon) return { src: "", shadow: "" }

  let evoImg = pokemon.sprites.other["official-artwork"].front_default;
  let shadowClass = getShadow(evoImg, id);

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