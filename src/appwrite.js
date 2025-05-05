import { Client, Databases, ID, Query } from 'appwrite'
// Import tools from Appwrite:
// - Client: Connects to Appwrite services
// - Databases: Helps work with Appwrite database
// - ID: Generates unique IDs for new records
// - Query: Helps search and filter database records

// Secret information our app needs:
// These values come from environment variables to keep them secure
// They tell our app which Appwrite project and database to use
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

// Set up connection to Appwrite:
// 1. Create a new client connection
// 2. Tell it where the Appwrite server is
// 3. Tell it which project we're using
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(PROJECT_ID)

// Create a database helper using our connection
const database = new Databases(client);

// Function to track what people search for:
// When someone searches for a movie, we either:
// - Add 1 to the count if someone searched for it before
// - Or create a new record if it's the first time
export const updateSearchCount = async (searchTerm, movie) => {
  try {
    // Step 1: Check if this search term exists in our database
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('searchTerm', searchTerm),
    ])

    // Step 2: If we found it (search exists in database)
    if(result.documents.length > 0) {
      // Get the existing record
      const doc = result.documents[0];

      // Add 1 to its count
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      })
    // Step 3: If it's a new search (not in database yet)
    } else {
      // Create a new record with:
      // - The search term
      // - Count starting at 1
      // - Information about the first movie result
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      })
    }
  } catch (error) {
    // If anything goes wrong, show the error in console
    console.error(error);
  }
}

// Function to get popular searches:
// Gets the top 5 most-searched terms from our database
export const getTrendingMovies = async () => {
  try {
    // Get records from database:
    // 1. Limit to just 5 results
    // 2. Sort by count (highest first)
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count")
    ])

    // Return the list of trending movies
    return result.documents;
  } catch (error) {
    // If anything goes wrong, show the error in console
    console.error(error);
  }
}