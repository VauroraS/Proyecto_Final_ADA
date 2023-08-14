
const characterList = document.querySelector('.characterList');
const genderFilter = document.getElementById('genderFilter');
const currentPageElement = document.getElementById('currentPage');
const totalPagesElement = document.getElementById('totalPages');
const firstPageButton = document.getElementById('firstPage');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
const lastPageButton = document.getElementById('lastPage');
const goToPageInput = document.getElementById('goToPage');
const goToPageButton = document.getElementById('goToPageButton');

let currentPage = 1;

function fetchData(page = 1, gender = '') {
  const apiUrl = `https://rickandmortyapi.com/api/character/?page=${page}&gender=${gender}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      currentPage = page;
      currentPageElement.textContent = currentPage;
      totalPagesElement.textContent = data.info.pages;

      characterList.innerHTML = '';
      data.results.forEach((character) => {
        const characterCard = document.createElement('div');
        characterCard.classList.add('characterCard');
        characterCard.innerHTML = `
          <h3>${character.name}</h3>
          <img src="${character.image}" alt="${character.name}">
        `;
        characterList.appendChild(characterCard);

        characterCard.addEventListener('click', () => {
          fetchCharacterInfo(character.id, characterCard);
        });
      });

      updatePaginationButtons();
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}
function updatePaginationButtons() {
  firstPageButton.disabled = currentPage === 1;
  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === parseInt(totalPagesElement.textContent);
  lastPageButton.disabled = currentPage === parseInt(totalPagesElement.textContent);
}

genderFilter.addEventListener('change', () => {
  fetchData(1, genderFilter.value);
});
//Paginacion
firstPageButton.addEventListener('click', () => {
  fetchData(1, genderFilter.value);
});

prevPageButton.addEventListener('click', () => {
  fetchData(currentPage - 1, genderFilter.value);
});

nextPageButton.addEventListener('click', () => {
  fetchData(currentPage + 1, genderFilter.value);
});

lastPageButton.addEventListener('click', () => {
  fetchData(parseInt(totalPagesElement.textContent), genderFilter.value);
});

goToPageButton.addEventListener('click', () => {
  const pageNumber = parseInt(goToPageInput.value);
  if (pageNumber >= 1 && pageNumber <= parseInt(totalPagesElement.textContent)) {
    fetchData(pageNumber, genderFilter.value);
  } else {
    alert('Número de página inválido!');
  }
});

function fetchCharacterInfo(characterId, characterCard) {
  const apiUrl = `https://rickandmortyapi.com/api/character/${characterId}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((character) => {
      const characterInfo = `
        <h3>${character.name}</h3>
        <img src="${character.image}" alt="${character.name}">
        <p>Gender: ${character.gender}</p>
        <p>Species: ${character.species}</p>
        <p>Status: ${character.status}</p>
        <p>Origin: ${character.origin.name}</p>
        <p>Location: ${character.location.name}</p>
        <p>Episodes: ${character.episode.length}</p>
      `;

      // Reemplazar el contenido de la tarjeta del personaje con la información detallada
      characterCard.innerHTML = characterInfo;
    })
    .catch((error) => {
      console.error('Error fetching character info:', error);
    });
}

// Obtener datos iniciales (primera página) al cargar la página
fetchData();

