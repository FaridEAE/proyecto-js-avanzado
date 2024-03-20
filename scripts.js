// scripts.js
document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById('searchInput');
    const pokemonContainer = document.getElementById('pokemonContainer');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementsByClassName('close')[0];
    const pokemonDetails = document.getElementById('pokemonDetails');

    let allPokemons = []; // Variable para mantener una referencia a todos los Pokémon

    // Fetch Pokemon data from PokeAPI
    fetch('https://pokeapi.co/api/v2/pokemon')
    .then(response => response.json())
    .then(data => {
        allPokemons = data.results;
        displayPokemons(allPokemons);
        addEventListenerToCards(allPokemons);
    });

    // Display Pokemons
    function displayPokemons(pokemons) {
        pokemonContainer.innerHTML = '';
        pokemons.forEach(pokemon => {
            const card = document.createElement('div');
            card.classList.add('pokemon-card');
            const pokemonId = pokemon.url.split('/')[6]; // Extracting Pokemon ID from URL
            card.innerHTML = `
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" class="pokemon-image">
                <div>
                    <h3>${pokemon.name}</h3>
                    <p>ID: ${pokemonId}</p>            
                    </div>
            `;
            pokemonContainer.appendChild(card);
        });
    }

    // Add event listener to display details on click
    function addEventListenerToCards(pokemons) {
        const cards = document.querySelectorAll('.pokemon-card');
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                const pokemonId = index + 1; // Index starts from 0, Pokemon ID starts from 1
                fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
                .then(response => response.json())
                .then(pokemon => {
                    displayPokemonDetails(pokemon);
                    modal.style.display = 'block';
                });
            });
        });
    }

      // Display Pokemon details in modal
      function displayPokemonDetails(pokemon) {
        const abilities = pokemon.abilities.map(ability => ability.ability.name);
        const types = pokemon.types.map(types => types.type.name);
        const abilitiesHtml = abilities.length > 0 ? abilities.join(', ') : 'N/A';
        const moves = pokemon.moves.map(move => move.move.name);
        const movesHtml = moves.length > 0 ? moves.join(', ') : 'N/A';
        pokemonDetails.innerHTML = `
            <h2>${pokemon.name}</h2>
            <p>Tipo: ${types}</p>
            <p>Peso: ${pokemon.weight} KG</p>
            <p>Altura: ${pokemon.height} M</p>
            <p>Habilidades: ${abilitiesHtml}</p>
            <p>Movimientos: ${movesHtml}</p>
        `;
    }

    // Close modal
    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    // Close modal when clicking outside the modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredPokemons = allPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));
        displayPokemons(filteredPokemons);
        addEventListenerToCards(filteredPokemons);
    });
});
