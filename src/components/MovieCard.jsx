import React from 'react'
// We need React to create our component

// Movie Card component:
// This component creates a nice display card for each movie
// It shows the movie poster, title, rating, language, and year
const MovieCard = ({ movie:
  // We get specific pieces of information about each movie
  // Instead of using movie.title, movie.poster_path, etc. throughout our code,
  // we extract just what we need right at the beginning
  { title, vote_average, poster_path, release_date, original_language }
}) => {
  return (
    // The main card container
    <div className="movie-card">
      {/* Movie poster image:
          If the movie has a poster, we show it
          If not, we show a placeholder image
          We set the alt text to the movie title for accessibility
      */}
      <img
        src={poster_path ?
          `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'}
        alt={title}
      />

      {/* Text content area below the poster */}
      <div className="mt-4">
        {/* Movie title */}
        <h3>{title}</h3>

        {/* Movie details row */}
        <div className="content">
          {/* Star rating:
              Shows the movie's score out of 10
              If no rating exists, shows "N/A"
              The toFixed(1) keeps it to one decimal place (like 7.8)
          */}
          <div className="rating">
            <img src="star.svg" alt="Star Icon" />
            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
          </div>

          {/* Bullet point separator */}
          <span>•</span>
          
          {/* Language code (like "en" for English) */}
          <p className="lang">{original_language}</p>

          {/* Another bullet point separator */}
          <span>•</span>
          
          {/* Release year:
              We take the full date (like "2023-05-25") 
              and just keep the year part ("2023")
              If no date exists, we show "N/A"
          */}
          <p className="year">
            {release_date ? release_date.split('-')[0] : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MovieCard