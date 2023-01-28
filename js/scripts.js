let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=30";
  let pokemonListElement = $(".pokemon-list");

  // function to add new pokemon
  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  // function returns all of the items in the pokemonList
  function getAll() {
    return pokemonList;
  }

  // function adds pokemon to the list
  function addListItem(pokemon) {
    let listItem = $('<li class="list-group-item"></li>');
    let button = $(
      '<button class="pokemon-button btn btn-info" data-target="#pokemon-modal" data-toggle="modal">' +
        displayString(pokemon.name) +
        "</button>"
    );

    listItem.append(button);
    pokemonListElement.append(listItem);

    button.on("click", function () {
      showDetails(pokemon);
    });
  }

  // function gets pokemon list from pokemonAPI
  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  // function loads details of pokemon
  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = details.types.map((type) => type.type.name);
        item.abilities = details.abilities.map(
          (abilities) => abilities.ability.name
        );
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  function heightDisplay(value) {
    let pokemonMeters = value / 10;
    let inches = Math.floor(pokemonMeters / 0.0254);
    let feet = Math.floor(inches / 12);
    let remainingInches = inches % 12;

    return `${pokemonMeters}m (${feet}' ${remainingInches}")`;
  }

  function displayString(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      showDetailsModal(pokemon);
    });
  }

  // function for Modal
  function showDetailsModal(pokemon) {
    let modalBody = $(".modal-body");
    let modalTitle = $(".modal-title");

    modalBody.empty();
    modalTitle.text(displayString(pokemon.name));

    let height = $("<p>" + "Height: " + heightDisplay(pokemon.height) + "</p>");
    let image = $('<img class="pokemon-img" src="' + pokemon.imageUrl + '" />');
    let types = $(
      "<p>" +
        "Types: " +
        displayString(pokemon.types[0]) +
        ", " +
        pokemon.types[1] +
        "</p>"
    );
    let abilities = $(
      "<p>" +
        "Abilities: " +
        displayString(pokemon.abilities[0]) +
        ", " +
        displayString(pokemon.abilities[1]) +
        "</p>"
    );

    modalBody.append(image);
    modalBody.append(height);
    modalBody.append(types);
    modalBody.append(abilities);
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    showDetailsModal: showDetailsModal,
  };
})();

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
