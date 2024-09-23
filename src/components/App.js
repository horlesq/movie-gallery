import { useCallback, useEffect, useState } from "react";
import { NavBar } from "./NavBar";
import { Search } from "./Search";
import { MovieList } from "./MovieList";
import { MovieDetails } from "./MovieDetails";
import { WatchedSummary } from "./WatchedSummary";
import { WatchedMoviesList } from "./WatchedMoviesList";
import { SearchResult } from "./SearchResult";
import { Loader } from "./Loader";
import { ErrorMessage } from "./ErrorMessage";
import { useMovies } from "../hooks/useMovies";

export default function App() {
    // State management
    const [query, setQuery] = useState(""); // Search query for movies
    const [selectedId, setSelectedId] = useState(null); // Currently selected movie ID
    const [watched, setWatched] = useState(function () {
        const storedValue = localStorage.getItem("watched");
        return storedValue ? JSON.parse(storedValue) : []; // Fallback to empty array if null
    }); // List of watched movies - get data from local storage at initial render

    // Unselect the current movie
    const handleUnselectMovie = useCallback(() => {
        setSelectedId(null);
    }, []);

    // Custom Hook for fething movies based on the search query
    const { movies, isLoading, error } = useMovies(query, handleUnselectMovie);

    // Handle search query input and update state
    function handleQueryChange(input) {
        setQuery(input);
    }

    // Select a movie by its ID; deselect if clicked twice
    function handleSelectMovie(id) {
        setSelectedId((selectedId) => (id === selectedId ? null : id));
    }

    // Add a movie to the watched list
    function handleAddWatched(movie) {
        setWatched((watched) => [...watched, movie]);
    }

    // Remove a movie from the watched list by its ID
    function handleRemoveWatched(id) {
        setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    }

    // Persist watched movies to local storage
    useEffect(
        function () {
            localStorage.setItem("watched", JSON.stringify(watched));
        },
        [watched]
    );

    return (
        <>
            {/* Navigation bar with search input */}
            <NavBar>
                <Search query={query} onSetQuery={handleQueryChange} />
            </NavBar>

            {/* Main content area */}
            <Main>
                {/* Movie search results or loader */}
                <Box>
                    {isLoading && <Loader />} {/* Show loader while fetching */}
                    {!isLoading && !error && (
                        <>
                            {/* If movies are successfully fetched, show results */}
                            <SearchResult movies={movies} query={query} />{" "}
                            <MovieList
                                movies={movies}
                                onSelectMovie={handleSelectMovie}
                            />
                        </>
                    )}
                    {/* Show error message */}
                    {query && error && <ErrorMessage message={error} />}{" "}
                </Box>

                {/* Watched movies or detailed view */}
                <Box>
                    {selectedId ? (
                        <MovieDetails
                            selectedId={selectedId} // Movie ID to fetch details
                            onUnselectMovie={handleUnselectMovie} // Callback to unselect movie
                            onAddWatched={handleAddWatched} // Callback to add movie to watched list
                            watched={watched} // List of watched movies
                            key={selectedId} // Ensure component re-renders when selectedId changes
                        />
                    ) : (
                        <>
                            {/* Show watched movie summary */}
                            <WatchedSummary watched={watched} />
                            <WatchedMoviesList
                                watched={watched}
                                onRemoveWatched={handleRemoveWatched} // Callback to remove movie from watched list
                            />
                        </>
                    )}
                </Box>
            </Main>
        </>
    );
}

// Main layout for content sections
function Main({ children }) {
    return <main className="main">{children}</main>;
}

// Container box that can be toggled open/closed
function Box({ children }) {
    const [isOpen, setIsOpen] = useState(true); // Toggle state for open/close

    return (
        <div className="box">
            {/* Toggle button to open/close the box */}
            <button
                className="btn-toggle"
                onClick={() => setIsOpen((open) => !open)}
            >
                {isOpen ? "–" : "+"}
            </button>
            {isOpen && children} {/* Render content if box is open */}
        </div>
    );
}
