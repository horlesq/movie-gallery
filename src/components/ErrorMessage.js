// Error message component to display API errors
export function ErrorMessage({ message }) {
    return (
        <p className="error">
            <span>⚠️ </span>
            {message}
            <span> ⚠️</span>
        </p>
    );
}
