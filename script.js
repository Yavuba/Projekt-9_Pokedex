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
  let contentRef = document.getElementById('content');
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

// functions for loading spinner //
function showLoadingSpinner() {
  const spinner = document.getElementById('spinner');
  spinner.style.display = "flex";

  document.body.classList.add('no-scroll');
  document.querySelector('main').classList.add('blurred');
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('spinner');
    spinner.style.display = "none";

    document.body.classList.remove('no-scroll');
    document.querySelector('main').classList.remove('blurred');
}

function moveSpinner() {
  const spinner = document.getElementById('spinner');
  spinner.classList.add('move-spinner');
  
  let filterText = document.getElementById('input-text');
  filterText.value = "";

  document.getElementById('content').scrollIntoView
    ({
    behavior: "smooth",
    block: "end"
    });
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

  await checkModalWindow(id);
}

async function checkModalWindow(id) {
  const section = currentSection;

  await renderData(id, section);

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

async function handlePokemonChange(id, section, btn) {
  currentSection = section;

  await renderData(id, section);

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

  const loadedIds = pokeapiArray.map(url => {
    return Number(url.split("/").filter(Boolean).pop());
  });

  let currentPosition = loadedIds.indexOf(currentIndex);
  currentPosition += direction;

  if (currentPosition < 0) {
    currentPosition = loadedIds.length - 1;
  }

  if (currentPosition >= loadedIds.length) {
    currentPosition = 0;
  }

  currentIndex = loadedIds[currentPosition];
  getDataModal(currentIndex);
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