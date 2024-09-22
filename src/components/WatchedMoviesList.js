export function WatchedMoviesList({ watched, onRemoveWatched }) {
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
