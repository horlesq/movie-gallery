import { useEffect } from "react";

export function useKey(key, action) {
    // Effect to handle specific key press
    useEffect(
        function () {
            // Callback function that will run when a key is pressed
            function callback(event) {
                // Check if the pressed key matches the specified key
                if (event.code.toLowerCase() === key.toLowerCase()) {
                    action(); // Call the provided action function if the key matches
                }
            }

            // Add a "keydown" event listener to detect key presses
            document.addEventListener("keydown", callback); // Add event listener

            // Cleanup function to remove the event listener when component unmounts
            return function () {
                document.removeEventListener("keydown", callback);
            };
        },
        [key, action] // Re-run the effect if the key or action changes
    );
}
