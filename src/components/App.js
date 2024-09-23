import { useEffect, useState } from "react";
import { NavBar } from "./NavBar";
import { Search } from "./Search";
import { MovieList } from "./MovieList";
import { MovieDetails } from "./MovieDetails";
import { WatchedSummary } from "./WatchedSummary";
import { WatchedMoviesList } from "./WatchedMoviesList";
import { SearchResult } from "./SearchResult";
import { Loader } from "./Loader";
import { ErrorMessage } from "./ErrorMessage";

export const OMBD_KEY = "bb07e4d";

export default function App() {
    // State management
    const [query, setQuery] = useState(""); // Search query for movies
    const [movies, setMovies] = useState([]); // List of movies returned by the API
    const [watched, setWatched] = useState(function () {
        const storedValue = localStorage.getItem("watched");
        return JSON.parse(storedValue);
    }); // List of watched movies - get data from local storage at initial render
    const [isLoading, setIsLoading] = useState(false); // Loading state for API requests
    const [error, setError] = useState(""); // Error message state
    const [selectedId, setSelectedId] = useState(null); // Currently selected movie ID

    // Handle search query input and update state
    function handleQueryChange(input) {
        setQuery(input);
    }

    // Select a movie by its ID; deselect if clicked twice
    function handleSelectMovie(id) {
        setSelectedId((selectedId) => (id === selectedId ? null : id));
    }

    // Unselect the current movie
    function handleUnselectMovie() {
        setSelectedId(null);
    }

    // Add a movie to the watched list
    function handleAddWatched(movie) {
        setWatched((watched) => [...watched, movie]);
    }

    // Remove a movie from the watched list by its ID
    function handleRemoveWatched(id) {
        setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    }

    useEffect(
        function () {
            localStorage.setItem("watched", JSON.stringify(watched));
        },
        [watched]
    );

    // Effect to fetch movies based on the search query
    useEffect(
        function () {
            const controller = new AbortController(); // To abort fetch requests if needed

            async function fetchMovies() {
                try {
                    setIsLoading(true); // Set loading state to true
                    setError(""); // Clear previous error messages

                    // Fetch movies from OMDB API using the search query
                    const result = await fetch(
                        `http://www.omdbapi.com/?apikey=${OMBD_KEY}&s=${query}`,
                        { signal: controller.signal } // Use signal for aborting fetch
                    );
                    if (!result.ok)
                        throw new Error(
                            "Something went wrong with fetching movies!"
                        );

                    const data = await result.json();
                    if (data.Response === "False")
                        throw new Error("Movie not found!");

                    setMovies(data.Search); // Update movies state with API data
                    setError(""); // Clear any error if fetch is successful
                } catch (err) {
                    // If the error isn't caused by the abort, set error state
                    if (err.name !== "AbortError") {
                        setError(err.message);
                    }
                } finally {
                    setIsLoading(false); // Set loading state to false
                }
            }

            // If the query is empty, reset movies and errors
            if (!query.length) {
                setMovies([]);
                setError("");
                return;
            }

            handleUnselectMovie(); // Unselect movie when making a new search
            fetchMovies(); // Fetch movies

            return function () {
                controller.abort(); // Abort fetch if component unmounts or query changes
            };
        },
        [query] // Re-run effect whenever the query changes
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
