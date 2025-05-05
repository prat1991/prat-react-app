import React from 'react'
// We need React to create our component

// Search box component:
// This is the search bar that users type into to find movies
// It receives two things from the parent App component:
// 1. searchTerm - the current text in the search box
// 2. setSearchTerm - a function to update the text when user types
const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className="search">
        <div>
            {/* Magnifying glass icon */}
            <img src="/search.svg" alt="search" />
            
            {/* The actual search input box:
                This is a "controlled input" which means React manages what's in it.
                When someone types, we don't directly change the text in the box.
                Instead, we:
                1. Tell the parent App what the user typed
                2. The parent App updates its memory (state)
                3. The updated text flows back down to this box
                
                This loop (Child → Parent → Child) keeps everything in sync.
            */}
            <input 
                type="text" 
                placeholder="Search through thousands of movies"
                // Connect this input to the text stored in the parent
                value={searchTerm}
                
                // When someone types:
                // 1. React detects the typing (onChange event)
                // 2. We get what they typed (event.target.value)
                // 3. We tell the parent App about it (setSearchTerm)
                // 4. The parent updates what it remembers
                // 5. The updated text comes back to this box
                onChange={(event) => setSearchTerm(event.target.value)}
            />
        </div>
    </div>
  )
}

export default Search