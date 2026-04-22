// variables //
let pokeapiArray = [];

// init function for calling api-data //
async function init() {
    await getUrlData();
    await getPokemonMainData();
}

// get url-data for first 20 pokemon //
async function getUrlData() {
  const url = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    result.results.forEach(pokemon => {
    pokeapiArray.push(pokemon.url);
    });

  } catch (error) {
    console.error(error.message);
  }
}

// get Pokemon main-data //
async function getPokemonMainData() {
  let contentRef = document.getElementById('contentRow');
  contentRef.innerHTML = "";

  for (const pokemonUrl of pokeapiArray) {
    try {
        const response = await fetch(pokemonUrl);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        renderPokemonList(result);
        
    } catch (error) {
      console.error(error.message);
    }
  }
}

// render-function to create pokemon-list in HTML //
function renderPokemonList(result) {
    let contentRef = document.getElementById('contentRow');
    contentRef.innerHTML += getPokemonListTemplate(result);
}

// get all type-information for pokemon //
function getPokemonTypes(pokemon) {
  const types = [];

  for (let index = 0; index < pokemon.types.length; index++) {
      types.push(pokemon.types[index].type.name);
  }
  return types;
}

