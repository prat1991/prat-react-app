import { useEffect, useState } from 'react'
// React Hooks API:
// - useState: Enables state management in functional components
// - useEffect: Handles component lifecycle events and side effects

import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx'
// Component Imports:
// Implements modular design pattern with specialized UI components
// Each component has a single responsibility (SRP principle)

import { useDebounce } from 'react-use'
// Custom Hook Import:
// - Optimizes user input handling by preventing excessive API calls
// - Part of react-use library which provides ready-made custom hooks

import { getTrendingMovies, updateSearchCount } from './appwrite.js'
// Backend Integration:
// - Appwrite functions for database operations
// - Separates external service interactions from component logic

// API Configuration Constants:
// Centralizes all external API connection details
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Add this line to check if your API_KEY is loaded correctly
console.log("API_KEY loaded:", API_KEY ? "Yes (first few chars: " + API_KEY.substring(0, 3) + "...)" : "No");

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}
// Environment variables provide security by keeping sensitive values out of code

const App = () => {
  // Advanced State Management:
  // Each state variable has a specific purpose in the application data flow
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('') // Optimized search input
  const [searchTerm, setSearchTerm] = useState('');                  // Raw user input
  const [movieList, setMovieList] = useState([]);                    // API results
  const [errorMessage, setErrorMessage] = useState('');              // Error handling
  const [isLoading, setIsLoading] = useState(false);                 // Loading state
  const [trendingMovies, setTrendingMovies] = useState([]);          // Trending movies from Appwrite

  // Performance Optimization Pattern:
  // Debounce implementation prevents excessive API calls during rapid typing
  // Waits for 500ms of inactivity before triggering search
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])
  
  // Data Fetching Function:
  // Dual-purpose function that handles both discovery and search queries
  const fetchMovies = async (query = '') => {
    // State Reset Pattern:
    // Clear previous state before new data fetch
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Dynamic Endpoint Selection:
      // Changes API endpoint based on whether user is searching or browsing
      const endpoint = query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      // Asynchronous Data Fetching:
      // Modern async/await pattern for cleaner promise handling
      const response = await fetch(endpoint, API_OPTIONS);
      
      // Response Validation:
      // Error detection before attempting to parse response
      if(!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      
      // Response Processing:
      // Parse JSON response body into JavaScript object
      const data = await response.json();
      
      // Error Format Check (Note: TMDB doesn't use this format, legacy from OMDB)
      if(data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }
      
      // State Update:
      // Updates UI with fetched data
      setMovieList(data.results || []);
      
      // Analytics/Persistence Logic:
      // Records successful searches to backend database
      // Only runs when search has results
      if(query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      // Error Handling:
      // Provides both developer and user-friendly error information
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      // Request Completion:
      // Always resets loading state regardless of outcome
      setIsLoading(false);
    }
  }
  
  // Database Integration Function:
  // Fetches trending movies from Appwrite backend
  const loadTrendingMovies = async () => {
    try {
      // Database Query:
      // Gets trending data from custom backend
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      // Silent Error Handling:
      // Logs error but doesn't display to user since this is secondary content
      console.error(`Error fetching trending movies: ${error}`);
    }
  }
  
  // Reactive Data Fetching:
  // Runs search whenever debounced search term changes
  // This creates automatic search as user types
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);
  
  // Initial Data Loading:
  // Fetches trending movies once when component mounts
  useEffect(() => {
    loadTrendingMovies();
  }, []);
  
  // Component Rendering:
  return (
    <main>
      <div className="pattern"/>
      <div className="wrapper">
        {/* Header Section */}
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Hello Ava,<br/> Find <span className="text-gradient">Movies You'll Enjoy</span></h1>
          {/* Search Component:
              Implements controlled component pattern with bidirectional data flow */}
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        
        {/* Conditional Rendering Pattern:
            Only renders trending section when data is available */}
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {/* List Rendering with Index:
                  Uses array index for display purposes (showing ranking number)
                  Uses unique database ID as React key for reconciliation */}
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}
        
        {/* Main Content Section */}
        <section className="all-movies">
          <h2>All Movies</h2>
          {/* State-Based UI Rendering:
              Progressive disclosure pattern with three distinct states:
              1. Loading: Shows spinner during data fetch
              2. Error: Shows error message if fetch fails
              3. Success: Renders movie list with data */}
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {/* Component-Based List Rendering:
                  Maps data array to component instances
                  Uses movie.id as React key for stable element identity */}
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
