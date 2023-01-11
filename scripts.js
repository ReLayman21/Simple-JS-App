let pokemonRepository = (function () {
  let pokemonList = [
    {
      name: "Bulbasaur",
      height: 0.7,
      type: ["grass", "poison"],
    },
    {
      name: "Ivysaur",
      height: 1.0,
      type: ["grass", "poison"],
    },
    {
      name: "Venusaur",
      height: 2.0,
      type: ["grass", "poison"],
    },
  ];

  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon &&
      "height" in pokemon &&
      "type" in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.log("Pokemon not found");
    }
  }

  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemon) {
    let repository = document.querySelector(".pokemon-list");
    let listPokemon = document.createElement("li");
    let button = document.createElement("button");
    button.innerText = pokemon.name;
    button.classList.add("button-class");
    button.addEventListener("click", (Event) => showDetails(pokemon));
    listPokemon.appendChild(button);
    repository.appendChild(listPokemon);
  }

  function showDetails(pokemon) {
    console.log(pokemon);
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
  };
})();

pokemonRepository.add({
  name: "charmander",
  height: 0.6,
  type: ["fire"],
});

pokemonRepository.getAll().forEach(function (pokemon) {
  pokemonRepository.addListItem(pokemon);
});
