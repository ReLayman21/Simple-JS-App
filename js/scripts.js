let pokemonRepository = (function () {
  let pokemonList = [];
  let printedList = document.querySelector(".pokemon-list");
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=30";
  let inputField = document.querySelector(".search");
  let pokemonModal = document.querySelector(".modal-dialog");

  // function to add loading spinner
  function showLoadingSpinner(spinnerLocation) {
    let spinnerContainer = document.createElement("div");
    spinnerContainer.classList.add("text-center");

    let loadingSpinner = document.createElement("div");
    loadingSpinner.classList.add("spinner-border");
    loadingSpinner.setAttribute("role", "status");

    let spinnerText = document.createElement("div");
    spinnerText.classList.add("sr-only");
    spinnerText.innerText = "Finding Pokemon...";

    loadingSpinner.appendChild(spinnerText);
    spinnerContainer.appendChild(loadingSpinner);
    spinnerLocation.appendChild(spinnerContainer);
  }

  function hideLoadingSpinner(spinnerLocation) {
    spinnerLocation.removeChild(spinnerLocation.lastChild);
  }

  // function to add new pokemon
  function add(pokemon) {
    // makes sure to have correct input types of name and detailsUrl
    if (
      typeof pokemon === "object" &&
      Object.keys(pokemon).includes("name" && "detailsUrl")
    ) {
      pokemonList.push(pokemon);
    } else {
      console.error("Add pokemon using correct format: {name:, detailsUrl:}");
    }
  }

  // will be called if there is a loading error when searching
  function removeList() {
    printedList.innerHTML = "";
  }

  // will be called in there is a loading error and also manually hiding modal
  function hideModal() {
    pokemonModal.classList.add("hidden");
  }

  // error message
  function showErrorMessage(message) {
    let errorMessage = document.createElement("p");
    errorMessage.classList.add("error-message");
    errorMessage.classList.add("col-6");
    errorMessage.innerText = message;

    printedList.appendChild(errorMessage);
  }

  // function gets pokemon list from pokemonAPI
  function loadList() {
    let spinnerLocation = document.querySelector(".main");
    showLoadingSpinner(spinnerLocation);

    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        hideLoadingSpinner(spinnerLocation);
        pokemonArray = json.results;
        pokemonArray.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        hideLoadingSpinner(spinnerLocation);
        removeList();
        hideModal();
        showErrorMessage(
          "The Pokemon are not around right now. Please try again later."
        );
        console.error(e);
      });
  }

  // function returns all of the items in the pokemonList
  function getAll() {
    return pokemonList;
  }

  // function adds pokemon to the list
  function addListItem(pokemon) {
    loadDetails(pokemon).then(function () {
      let listItem = document.createElement("li");
      listItem.classList.add("col");

      let button = document.createElement("button");
      let buttonText = document.createElement("h2");
      button.appendChild(buttonText);
      // Capitalize first letter
      buttonText.innerText =
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
      button.classList.add("pokemon-button");
      button.setAttribute("data-toggle", "modal");
      button.setAttribute("data-target", ".modal");

      let pokemonImage = document.createElement("img");
      pokemonImage.src = pokemon.ImageUrl;
      button.appendChild(listItem);

      button.addEventListener("click", function () {
        showDetails(pokemon);
      });
    });
  }

  // Search box functionality
  function filterPokemon(query) {
    return pokemonList.filter(function (pokemon) {
      let pokemonLowerCase = pokemon.name.toLowerCase();
      let queryLowerCase = query.toLowerCase();
      return pokemonLowerCase.startsWith(queryLowerCase);
    });
  }
  inputField.addEventListener("input", function () {
    let query = inputField.value;
    let filteredList = filterPokemon(query);
    removeList();
    if (filteredList.length === 0) {
      showErrorMessage("No pokemon match your criteria. ");
    } else {
      filteredList.forEach(addListItem);
    }
  });

  // function loads details of pokemon
  function loadDetails(item) {
    let spinnerLocation = document.querySelector(".modal-body");
    showLoadingSpinner(spinnerLocation);

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

  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      let modalTitle = document.querySelector(".modal-title");
      let modalBody = document.querySelector(".modal-body");

      modalTitle.innerHTML = "";
      modalBody.innerHTML = "";

      let nameElement = document.querySelector(".modal-title");
      nameElement.innerText =
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

      let imageElement = document.createElement("img");
      imageElement.classList.add("modal-img");
      imageElement.src = pokemon.imageUrl;

      let modalText = document.createElement("div");
      modalText.classList.add("modal-text");

      let heightElement = document.createElement("p");
      heightElement.innerText = "Height: " + pokemon.height / 10 + "m";

      let typesElement = document.createElement("p");
      typesElement.innerText = "Types: " + pokemon.types;

      let abilitiesElement = document.createElement("p");
      abilitiesElement.innerText = "Abilities: " + pokemon.abilities;

      modalBody.append(imageElement);
      modalBody.append(heightElement);
      modalBody.append(typesElement);
      modalBody.append(abilitiesElement);
    });
  }

  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      hideModal();
    }
  });

  return {
    showLoadingSpinner: showLoadingSpinner,
    hideLoadingSpinner: hideLoadingSpinner,
    add: add,
    removeList: removeList,
    hideModal: hideModal,
    showErrorMessage: showErrorMessage,
    loadList: loadList,
    getAll: getAll,
    addListItem: addListItem,
    filterPokemon: filterPokemon,
    loadDetails: loadDetails,
    showDetails: showDetails,
  };
})();

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
