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
  
  let filterText = document.getElementById('search-input');
  filterText.value = "";

  document.getElementById('pokemon-content').scrollIntoView
    ({
    behavior: "smooth",
    block: "end"
    });
}

// filter function in header //
function filterAndShowCurrentPokemon(filterWord) {
  let contentRefAlert = document.getElementById('alert-text');
  let contentRef = document.getElementById("pokemon-content");
  
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
    document.getElementById('pokemon-content').innerHTML = 'No matching Pokémon found.'
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
  modal.focus();
  
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

