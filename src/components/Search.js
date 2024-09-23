import { useRef, useState } from "react";
import { useKey } from "../hooks/useKey";

// Search form with a query input
export function Search({ query, onSetQuery }) {
    const [input, setInput] = useState(query); // Local state for input
    const inputElement = useRef(null); // Ref to access the input DOM element directly

    // Custom hook to handle keyboard events and auto-focus on the input field
    useKey("Enter", function () {
        // Check if the input element is currently focused, if so, do nothing
        if (document.activeElement === inputElement) return;

        inputElement.current.focus();
    });

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
                ref={inputElement}
            />
            <button className="search-btn" type="submit">
                Search
            </button>
        </form>
    );
}
