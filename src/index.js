//write your code here


document.addEventListener("DOMContentLoaded", function() {
    const baseUrl = "http://localhost:3000";

    // Function to fetch movie details by ID
    function fetchMovieDetails(id) {
        fetch(`${baseUrl}/films/${id}`)
            .then(response => response.json())
            .then(movie => {
                updateMovieDetails(movie);
            })
            .catch(error => console.error("Error fetching movie details:", error));
    }


    // Function to update the first movie details when the page loads
    
    function updateMovieDetails(movie) {
        const poster = document.getElementById("poster");
        poster.src = movie.poster;
        poster.alt = movie.title;

        document.getElementById("title").textContent = movie.title;
        document.getElementById("runtime").textContent = `${movie.runtime} minutes`;
        document.getElementById("film-info").textContent = movie.description;
        document.getElementById("showtime").textContent = movie.showtime;

        const availableTickets = movie.capacity - movie.tickets_sold; // calculates the number of tickets remaining
        document.getElementById("ticket-num").textContent = `${availableTickets} remaining tickets`;

        const buyButton = document.getElementById("buy-ticket");
        if (availableTickets === 0) {
            buyButton.textContent = "Sold Out";
            buyButton.disabled = true;
        } else {
            buyButton.textContent = "Buy Ticket";
            buyButton.disabled = false;
            buyButton.onclick = () => buyTicket(movie.id, availableTickets);
        }
    }
     // Function to update the first movie details when the page loads
    
     function updateMovieDetails(movie) {
        const poster = document.getElementById("poster");
        poster.src = movie.poster;
        poster.alt = movie.title;

        document.getElementById("title").textContent = movie.title;
        document.getElementById("runtime").textContent = `${movie.runtime} minutes`;
        document.getElementById("film-info").textContent = movie.description;
        document.getElementById("showtime").textContent = movie.showtime;

        const availableTickets = movie.capacity - movie.tickets_sold;
        document.getElementById("ticket-num").textContent = `${availableTickets} remaining tickets`;

        const buyButton = document.getElementById("buy-ticket");
        if (availableTickets === 0) {
            buyButton.textContent = "Sold Out";
            buyButton.disabled = true;
        } else {
            buyButton.textContent = "Buy Ticket";
            buyButton.disabled = false;
            buyButton.onclick = () => buyTicket(movie.id, availableTickets);
        }
    }
     // Function to fetch all movies

     function fetchAllMovies() {
        fetch(`${baseUrl}/films`)
            .then(response => response.json())
            .then(movies => {
                populateMoviesMenu(movies);
                fetchMovieDetails(movies[0].id); // Display details of the first movie by default
            })
            .catch(error => console.error("Error fetching movies:", error));
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
