//write your code here
document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/films/1') //loads and displays the first movie
      .then(response => response.json())
      .then(movie => updateMovie(movie))
      .catch(error => console.error(error));
  });

  const showing = document.querySelector('#showing .card'); // class for movie details section
  const poster = document.getElementById('poster');
  const title = document.getElementById('title');
  const runtime = document.getElementById('runtime');
  const filmInfo = document.getElementById('film-info');
  const showtime = document.getElementById('showtime');
  const ticketNum = document.getElementById('ticket-num');
  
  function updateMovie(movie) {
    poster.src = movie.poster;
    title.textContent = movie.title;
    runtime.textContent = `${movie.runtime} minutes`;
    filmInfo.textContent = movie.description;
    showtime.textContent = movie.showtime;
    ticketNum.textContent = `${movie.capacity - movie.tickets_sold} remaining`;
  }
  
fetchMovies();
