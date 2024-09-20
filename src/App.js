import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const OMBD_KEY = "bb07e4d";

export default function App() {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [watched, setWatched] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    function handlesetQuery(input) {
        setQuery(input);
    }

    function handleSelectMovie(id) {
        setSelectedId((selectedId) => (id === selectedId ? null : id));
    }

    function handleUnselectMovie() {
        setSelectedId(null);
    }

    function handleAddWatched(movie) {
        setWatched((watched) => [...watched, movie]);
    }

    function handleRemoveWatched(id) {
        setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    }

    useEffect(
        function () {
            async function fetchMovies() {
                try {
                    setIsLoading(true);
                    setError("");

                    const result = await fetch(
                        `http://www.omdbapi.com/?apikey=${OMBD_KEY}&s=${query}`
                    );
                    if (!result.ok)
                        throw new Error(
                            "Something went wrong with fetching movies!"
                        );

                    const data = await result.json();
                    if (data.Response === "False")
                        throw new Error("Movie not found!");

                    setMovies(data.Search);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            }

            if (!query.length) {
                setMovies([]);
                setError("");
                return;
            }

            fetchMovies();
        },
        [query]
    );

    return (
        <>
            <NavBar>
                <Search query={query} onSetQuery={handlesetQuery} />
            </NavBar>
            <Main>
                <Box>
                    {isLoading && <Loader />}
                    {!isLoading && !error && (
                        <>
                            <SearchResult movies={movies} query={query} />{" "}
                            <MovieList
                                movies={movies}
                                onSelectMovie={handleSelectMovie}
                            />
                        </>
                    )}
                    {query && error && <ErrorMessage message={error} />}
                </Box>
                <Box>
                    {selectedId ? (
                        <MovieDetails
                            selectedId={selectedId}
                            onUnselectMovie={handleUnselectMovie}
                            onAddWatched={handleAddWatched}
                            watched={watched}
                            key={selectedId}
                        />
                    ) : (
                        <>
                            <WatchedSummary watched={watched} />
                            <WatchedMoviesList
                                watched={watched}
                                onRemoveWatched={handleRemoveWatched}
                            />
                        </>
                    )}
                </Box>
            </Main>
        </>
    );
}

function Loader() {
    return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
    return (
        <p className="error">
            <span>⚠️ </span>
            {message}
            <span> ⚠️</span>
        </p>
    );
}

function NavBar({ children }) {
    return (
        <nav className="nav-bar">
            <Logo />
            {children}
        </nav>
    );
}

function Logo() {
    return (
        <div className="logo">
            <span role="img">🎬</span>
            <h1>Movie Gallery</h1>
        </div>
    );
}

function Search({ query, onSetQuery }) {
    const [input, setInput] = useState(query);

    function handleSubmit(e) {
        e.preventDefault();
        onSetQuery(input); // Set the query only on submit
    }

    return (
        <form className="search-form" onSubmit={handleSubmit}>
            <input
                className="search"
                type="text"
                placeholder="Enter a movie title..."
                value={input}
                onChange={(e) => setInput(e.target.value)} // Update local state
            />
            <button className="search-btn" type="submit">
                Search
            </button>
        </form>
    );
}

function Main({ children }) {
    return <main className="main">{children}</main>;
}

function Box({ children }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="box">
            <button
                className="btn-toggle"
                onClick={() => setIsOpen((open) => !open)}
            >
                {isOpen ? "–" : "+"}
            </button>
            {isOpen && children}
        </div>
    );
}

function SearchResult({ movies, query }) {
    return (
        <div className="summary">
            {query ? (
                <>
                    <h2>
                        Found <strong>{movies.length}</strong> results for:
                    </h2>
                    <div>
                        <p>
                            <span>⏯</span>
                            <span>{query.toUpperCase()}</span>
                        </p>
                    </div>
                </>
            ) : (
                <h2>
                    Start by searching for a movie title ⏸️ <br /> <br />
                </h2>
            )}
        </div>
    );
}

function MovieList({ movies, onSelectMovie }) {
    return (
        <ul className="list list-movies">
            {movies?.map((movie) => (
                <Movie
                    movie={movie}
                    key={movie.imdbID}
                    onSelectMovie={onSelectMovie}
                />
            ))}
        </ul>
    );
}

function Movie({ movie, onSelectMovie }) {
    return (
        <li onClick={() => onSelectMovie(movie.imdbID)}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>🗓</span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>
    );
}

function MovieDetails({ selectedId, onUnselectMovie, onAddWatched, watched }) {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState("");

    const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
    const wathedUserRating = watched.find(
        (movie) => movie.imdbID === selectedId
    )?.userRating;

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

    useEffect(
        function () {
            async function getMovieDetails() {
                setIsLoading(true);
                const result = await fetch(
                    `http://www.omdbapi.com/?apikey=${OMBD_KEY}&i=${selectedId}`
                );

                const data = await result.json();
                setMovie(data);
                setIsLoading(false);
            }
            getMovieDetails();
        },
        [selectedId]
    );

    return (
        <div className="details">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <header>
                        <button className="btn-back" onClick={onUnselectMovie}>
                            &lt;
                        </button>
                        <img
                            src={movie.Poster}
                            alt={`Poster of ${movie.Title} movie`}
                        />
                        <div className="details-overview">
                            <h2>{movie.Title}</h2>
                            <p>
                                {movie.Released} &bull; {movie.Runtime}
                            </p>
                            <p>{movie.Genre}</p>
                            <p>
                                <span>⭐</span>
                                {movie.imdbRating} IMDb Rating
                            </p>
                        </div>
                    </header>

                    <section>
                        <div className="rating">
                            {!isWatched ? (
                                <>
                                    <StarRating
                                        maxRating={10}
                                        size={24}
                                        onSetRating={setUserRating}
                                        diplayText={false}
                                    ></StarRating>
                                    {userRating > 0 && (
                                        <button
                                            className="btn-add"
                                            onClick={handleAdd}
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
                                    Movie added to watched list{" ▸  "}
                                    {wathedUserRating}
                                    <span>🌟</span>
                                </h3>
                            )}
                        </div>
                        <p>
                            <em>{movie.Plot}</em>
                        </p>
                        <p>Starring {movie.Actors}</p>
                        <p>Directed by {movie.Director}</p>
                    </section>
                </>
            )}
        </div>
    );
}

function WatchedSummary({ watched }) {
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgRuntime = average(watched.map((movie) => movie.runtime));

    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                </p>
                <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                </p>
            </div>
        </div>
    );
}

function WatchedMoviesList({ watched, onRemoveWatched }) {
    return (
        <ul className="list">
            {watched.map((movie) => (
                <WatchedMovie
                    movie={movie}
                    key={movie.imdbID}
                    onRemoveWatched={onRemoveWatched}
                />
            ))}
        </ul>
    );
}

function WatchedMovie({ movie, onRemoveWatched }) {
    return (
        <li>
            <img src={movie.poster} alt={`${movie.title} poster`} />
            <h3>{movie.title}</h3>
            <div>
                <p>
                    <span>⭐️</span>
                    <span>{movie.imdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{movie.userRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{movie.runtime} min</span>
                </p>

                <button
                    className="btn-remove"
                    onClick={() => onRemoveWatched(movie.imdbID)}
                >
                    X
                </button>
            </div>
        </li>
    );
}
