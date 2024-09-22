// Display search result summary
export function SearchResult({ movies, query }) {
    return (
        <div className="summary">
            {query ? (
                <>
                    {/* Display count of movies found */}
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
