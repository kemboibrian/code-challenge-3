// Your code here
document.addEventListener('DOMContentLoaded', () => {
    const baseURL = 'http://localhost:3000';

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
    };
    
 // Function to update the UI with the first film/movie details
    const updateFilmDetails = (filmId) => {
        fetchFilmData(filmId)
            .then(filmData => {
                const remainingTickets = filmData.capacity - filmData.tickets_sold; // this calculates the remaining tickets
                const buyTicketButton = document.getElementById('buy-ticket');
                const ticketNumSpan = document.getElementById('ticket-num');

                document.getElementById('title').textContent = filmData.title;
                document.getElementById('runtime').textContent = `${filmData.runtime} minutes`;
                document.getElementById('film-info').textContent = filmData.description;
                document.getElementById('showtime').textContent = filmData.showtime;
                document.getElementById('poster').src = filmData.poster;

                ticketNumSpan.textContent = remainingTickets;
                if (remainingTickets <= 0) {
                    buyTicketButton.textContent = 'Sold Out';
                    buyTicketButton.disabled = true;
                } else {
                    buyTicketButton.textContent = 'Buy Ticket';
                    buyTicketButton.disabled = false;
                }

                // Add event listener to buy ticket button
                buyTicketButton.addEventListener('click', () => {
                    if (remainingTickets > 0) {
                        const updatedTicketsSold = filmData.tickets_sold + 1;
                        updateTicketsSold(filmId, updatedTicketsSold)
                            .then(() => updateFilmDetails(filmId));
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

    }
 // Function to buy a ticket

 function buyTicket(movieId, availableTickets) {
    const numberOfTickets = 1; // For simplicity, buying one ticket at a time
    if (availableTickets === 0) {
        alert("This movie is sold out.");
        return;
    }

    const newAvailableTickets = availableTickets - numberOfTickets;

    fetch(`${baseUrl}/films/${movieId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            tickets_sold: newAvailableTickets
        })
    })
        .then(response => response.json())
        .then(updatedMovie => {
            updateMovieDetails(updatedMovie);
            persistTicketSale(movieId, numberOfTickets);
        })
        .catch(error => console.error("Error buying ticket:", error));
}
 // Function to persist ticket sale
 function persistTicketSale(movieId, numberOfTickets) {
    fetch(`${baseUrl}/tickets`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            film_id: movieId,
            number_of_tickets: numberOfTickets
        })
    })
        .then(response => response.json())
        .then(ticket => console.log("Ticket purchased:", ticket))
        .catch(error => console.error("Error persisting ticket sale:", error));
}

 // Function to populate the movies menu with delete functionality
 function populateMoviesMenu(movies) {
    const filmsList = document.getElementById("films");
    filmsList.innerHTML = ""; // Clear existing list

    movies.forEach(movie => {
        const listItem = document.createElement("li");
        listItem.textContent = movie.title;
        listItem.className = "film item";

        // Adding a delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteMovie(movie.id, listItem);
        listItem.appendChild(deleteButton);

        listItem.addEventListener("click", () => fetchMovieDetails(movie.id));
        filmsList.appendChild(listItem);
    });
}

// Function to delete a movie
function deleteMovie(movieId, listItem) {
    fetch(`${baseUrl}/films/${movieId}`, {
        method: "DELETE"
    })
        .then(response => {
            if (response.ok) {
                listItem.remove();
                console.log("Movie deleted successfully.");
            } else {
                throw new Error("Failed to delete movie.");
            }
        })
        .catch(error => console.error("Error deleting movie:", error));
}

// Call function to fetch all movies when the DOM content is loaded
fetchAllMovies();
});
