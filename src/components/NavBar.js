// Navigation bar with logo and search input
export function NavBar({ children }) {
    return (
        <nav className="nav-bar">
            <Logo />
            {children}
        </nav>
    );
}

// Logo for the application
function Logo() {
    return (
        <div className="logo">
            <span role="img">🎬</span>
            <h1>Movie Gallery</h1>
        </div>
    );
}
