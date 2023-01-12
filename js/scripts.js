let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=20";

  function add(pokemon) {
    if (typeof pokemon === "object" && "name" in pokemon) {
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

  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = details.types;
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      console.log(pokemon);
    });
  }

  let modalContainer = document.querySelector("#modal-container");

  function showModal(title, text) {
    modalContainer.innerHTML = "";
    let modal = document.createElement("div");
    modal.classList.add("modal");

    let closeButtonElement = document.createElement("button");
    closeButtonElement.classList.add("modal-close");
    closeButtonElement.innerText = "Close";
    closeButtonElement.addEventListener("click", hideModal);

    let titleElement = document.createElement("h1");
    titleElement.innerText = title;

    let textElement = document.createElement("p");
    textElement.innerText = text;

    modal.appendChild(closeButtonElement);
    modal.appendChild(titleElement);
    modal.appendChild(textElement);
    modalContainer.appendChild(modal);

    modalContainer.classList.add("is-visible");
  }

  let dialogPromiseReject;

  function hideModal() {
    let modalContainer = document.querySelector("#model-container");
    modalContainer.classList.remove("is-visible");

    if (dialogPromiseReject) {
      dialogPromiseReject();
      dialogPromiseReject = null;
    }
  }

  function showDialog(title, text) {
    showModal(title, text);

    let modal = modalContainer.querySelector(".modal");

    let confirmButton = document.createElement("button");
    confirmButton.classList.add("modal-confirm");
    confirmButton.innerText = "Confirm";

    let cancelButton = document.createElement("button");
    cancelButton.classList.add("modal-cancel");
    cancelButton.innerText = "Cancel";

    modal.appendChild(confirmButton);
    modal.appendChild(cancelButton);

    confirmButton.focus();

    return new Promise((resolve, reject) => {
      cancelButton.addEventListener("click", hideModal);
      confirmButton.addEventListener("click", () => {
        dialogPromiseReject = null;
        hideModal();
        reject();
      });
      dialogPromiseReject = reject;
    });
  }

  document.querySelector("#show-dialog").addEventListener("click", () => {
    showDialog("Confirm action", "Are you sure you want to do this?").then(
      function () {
        alert("Confirmed!");
      },
      () => {
        alert("Not confirmed");
      }
    );
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalContainer.classList.contains("is-visible")) {
      hideModal();
    }
  });

  modalContainer.addEventListener("click", (e) => {
    let target = e.target;
    if (target === modalContainer) {
      hideModal();
    }
  });

  document.querySelector("#show-modal").addEventListener("click", () => {
    showModal("Model title", "This is the modal content!");
  });

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
  };
})();

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
