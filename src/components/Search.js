import { useState } from "react";

// Search form with a query input
export function Search({ query, onSetQuery }) {
    const [input, setInput] = useState(query); // Local state for input

    function handleSubmit(e) {
        e.preventDefault(); // Prevent default form submission
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
