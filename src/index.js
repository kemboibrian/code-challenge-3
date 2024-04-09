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
})

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
