document.addEventListener('DOMContentLoaded', () => {
    const baseURL = 'http://localhost:3000'

    // Function to make GET request to retrieve film/movie data
    const fetchFilmData = (id) => {
        return fetch(`${baseURL}/films/${id}`)
            .then(response => response.json());
        
    };

    // Function to make PATCH request to update tickets_sold
    const updateTicketsSold = (id, ticketsSold) => {
        return fetch(`${baseURL}/films/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tickets_sold: ticketsSold })
        });
    }

    

    // Function to update the UI with film details
    const updateFilmDetails = (filmId) => {
        fetchFilmData(filmId)
            .then(filmData => {
                const remainingTickets = filmData.capacity - filmData.tickets_sold; // this calculates the remaining tickets
                const buyTicketButton = document.getElementById('buy-ticket');
                const ticketNumSpan = document.getElementById('ticket-num');

                document.getElementById('title').textContent = filmData.title;
                document.getElementById('runtime').textContent = `${filmData.runtime} minutes`
                document.getElementById('film-info').textContent = filmData.description
                document.getElementById('showtime').textContent = filmData.showtime
                document.getElementById('poster').src = filmData.poster

                ticketNumSpan.textContent = remainingTickets
                if (remainingTickets <= 0) {
                    buyTicketButton.textContent = 'Sold Out'
                    buyTicketButton.disabled = true
                } else {
                    buyTicketButton.textContent = 'Buy Ticket'
                    buyTicketButton.disabled = false
                }

                // Add event listener to buy ticket button
                buyTicketButton.addEventListener('click', () => {
                    if (remainingTickets > 0) {
                        const updatedTicketsSold = filmData.tickets_sold + 1
                        updateTicketsSold(filmId, updatedTicketsSold)
                            .then(() => updateFilmDetails(filmId))
                    }
                });
            });
    };

    // Function to populate film/movie menu
    const populateFilmMenu = () => {
        const filmsList = document.getElementById('films');
        filmsList.innerHTML = ''; // Clear existing list items

        fetch(`${baseURL}/films`)
            .then(response => response.json())
            .then(films => {
                films.forEach(film => {
                    const filmItem = document.createElement('li');
                    filmItem.textContent = film.title;

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.classList.add('delete-button');
                    deleteButton.addEventListener('click', () => {
                        deleteFilm(film.id)
                            .then(() => filmItem.remove());
                    });

                    filmItem.appendChild(deleteButton);
                    filmItem.classList.add('film', 'item');
                    filmItem.addEventListener('click', () => updateFilmDetails(film.id));
                    filmsList.appendChild(filmItem);
                });
            });
    };

    // startup that loads the movie contents
    populateFilmMenu();
    updateFilmDetails(1); // Show details of the first film when page loads
});
