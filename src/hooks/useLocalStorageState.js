import { useEffect, useState } from "react";

/**
 * Custom hook for managing state that is synchronized with localStorage.
 *
 * @param {any} initialState - The initial state value if nothing is stored in localStorage.
 * @param {string} key - The key used to store the state in localStorage.
 * @returns {[any, Function]} - Returns the current state and a function to update it.
 */
export function useLocalStorageState(initialState, key) {
    // State variable to hold the value, initialized from localStorage or set to initialState
    const [value, setValue] = useState(function () {
        // Get the stored value from localStorage
        const storedValue = localStorage.getItem(key);
        // Parse and return the stored value or fallback to initialState
        return storedValue ? JSON.parse(storedValue) : initialState;
    });

    useEffect(
        function () {
            // Update localStorage whenever the value changes
            localStorage.setItem(key, JSON.stringify(value));
        },
        [value, key] // Re-run effect if value or key changes
    );

    // Return the current value and the function to update it
    return [value, setValue];
}
