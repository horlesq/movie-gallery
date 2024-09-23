import { useEffect, useRef, useState } from "react";

// Search form with a query input
export function Search({ query, onSetQuery }) {
    const [input, setInput] = useState(query); // Local state for input
    const inputElement = useRef(null); // Ref to access the input DOM element directly

    // useEffect to handle keyboard events and auto-focus on the input field
    useEffect(function () {
        function callback(event) {
            // Check if the input element is currently focused, if so, do nothing
            if (document.activeElement === inputElement) return;

            // Focus on the input element when the "Enter" key is pressed and input is not focused
            if (event.code === "Enter") {
                inputElement.current.focus();
            }
        }

        // Add the keydown event listener to the document
        document.addEventListener("keydown", callback);
        // Set the initial focus to the input field when the component mounts
        inputElement.current.focus();
        // Cleanup function: remove the keydown event listener when the component unmounts
        return () => document.addEventListener("keydown", callback);
    }, []);

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
