import { useEffect, useState } from "react";

export const OMBD_KEY = "bb07e4d";

/**
 * Custom hook for fetching movies based on a search query.
 *
 * @param {string} query - The search query for fetching movies.
 * @param {function} callback - Optional callback to execute when the effect runs.
 * @returns {{ movies: Array, isLoading: boolean, error: string }} - Returns an object containing movies, loading state, and error message.
 */
export function useMovies(query, callback) {
    const [movies, setMovies] = useState([]); // List of movies returned by the API
    const [isLoading, setIsLoading] = useState(false); // Loading state for API requests
    const [error, setError] = useState(""); // Error message state

    useEffect(
        function () {
            // Execute the callback if provided
            callback?.();

            const controller = new AbortController(); // To abort fetch requests if needed

            // Function to fetch movies from the API
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

            // handleUnselectMovie(); // Unselect movie when making a new search
            fetchMovies(); // Fetch movies

            return function () {
                controller.abort(); // Abort fetch if component unmounts or query changes
            };
        },
        [query, callback] // Re-run effect whenever the query changes
    );

    return { movies, isLoading, error };
}
