import { useState, useEffect } from "react";
import { OMBD_KEY } from "../hooks/useMovies";
import { Loader } from "./Loader";
import StarRating from "./StarRating";
import { useKey } from "../hooks/useKey";

// Movie details section for the selected movie
export function MovieDetails({
    selectedId,
    onUnselectMovie,
    onAddWatched,
    watched,
}) {
    const [movie, setMovie] = useState({}); // State to hold movie details
    const [isLoading, setIsLoading] = useState(false); // Loading state for movie details
    const [userRating, setUserRating] = useState(""); // User rating for the movie

    // Check if the selected movie is already in the watched list
    const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

    // Find the user rating for the watched movie, if it exists
    const wathedUserRating = watched.find(
        (movie) => movie.imdbID === selectedId
    )?.userRating;

    // Function to add the movie to the watched list
    function handleAdd() {
        const watchedMovie = {
            imdbID: selectedId,
            title: movie.Title,
            year: movie.Year,
            poster: movie.Poster,
            imdbRating: Number(movie.imdbRating),
            userRating,
            runtime: Number(movie.Runtime.split(" ").at(0)),
        };
        onAddWatched(watchedMovie);
        onUnselectMovie();
    }

    // Custom hook to handle keyboard event
    useKey("Escape", onUnselectMovie);

    // Effect to fetch movie details based on selectedId
    useEffect(
        function () {
            async function getMovieDetails() {
                setIsLoading(true); // Set loading state to true
                const result = await fetch(
                    `http://www.omdbapi.com/?apikey=${OMBD_KEY}&i=${selectedId}`
                );

                const data = await result.json(); // Parse the response JSON
                setMovie(data); // Set the movie details in state
                setIsLoading(false); // Set loading state to false
            }
            getMovieDetails(); // Fetch the movie details
        },
        [selectedId] // Effect runs whenever the selectedId changes
    );

    // Effect to update the document title with the movie's title
    useEffect(
        function () {
            if (!movie.Title) return; // If movie details aren't loaded yet, do nothing
            document.title = `Movie: ${movie.Title}`; // Set document title to movie's title

            // Cleanup function to reset document title when component unmounts
            return function () {
                document.title = "Movie Gallery";
            };
        },
        [movie.Title] // Effect runs whenever the movie title changes
    );

    return (
        <div className="details">
            {isLoading ? (
                <Loader /> // Show loader if movie details are still loading
            ) : (
                <>
                    <header>
                        <button className="btn-back" onClick={onUnselectMovie}>
                            &lt; {/* Button to go back/unselect movie */}
                        </button>
                        <img
                            src={movie.Poster}
                            alt={`Poster of ${movie.Title} movie`}
                        />
                        <div className="details-overview">
                            <h2>{movie.Title}</h2>
                            <p>
                                {movie.Released} &bull; {movie.Runtime}
                                {/* Movie release date and runtime */}
                            </p>
                            <p>{movie.Genre}</p>
                            <p>
                                <span>⭐</span>
                                {movie.imdbRating} IMDb Rating
                                {/* Movie IMDb rating */}
                            </p>
                        </div>
                    </header>

                    <section>
                        <div className="rating">
                            {!isWatched ? ( // If movie is not watched yet
                                <>
                                    <StarRating
                                        maxRating={10}
                                        size={24}
                                        onSetRating={setUserRating}
                                        diplayText={false}
                                    ></StarRating>
                                    {userRating > 0 && ( // Show "Add" button if user has rated the movie
                                        <button
                                            className="btn-add"
                                            onClick={handleAdd} // Add movie to watched list on click
                                        >
                                            <svg
                                                width="24"
                                                height="24"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="ipc-icon ipc-icon--watchlist ipc-btn__icon ipc-btn__icon--pre"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                role="presentation"
                                            >
                                                <path
                                                    d="M17 3c1.05 0 1.918.82 1.994 1.851L19 5v16l-7-3-7 3V5c0-1.05.82-1.918 1.851-1.994L7 3h10zm-4 4h-2v3H8v2h3v3h2v-3h3v-2h-3V7z"
                                                    fill="currentColor"
                                                ></path>
                                            </svg>
                                        </button>
                                    )}
                                </>
                            ) : (
                                <h3>
                                    Movie added to watched list{" ▸  "}{" "}
                                    {/* Display user's rating if movie was watched */}
                                    {wathedUserRating}
                                    <span>🌟</span>
                                </h3>
                            )}
                        </div>
                        <p>
                            <em>{movie.Plot}</em>{" "}
                            {/* Display the movie's plot */}
                        </p>
                        <p>Starring {movie.Actors}</p> {/* Display actors */}
                        <p>Directed by {movie.Director}</p>{" "}
                        {/* Display director */}
                    </section>
                </>
            )}
        </div>
    );
}
