export function TopNav() {
  return (
    <header className="top-nav">
      <div className="brand">Alquila</div>

      <label className="search-wrap" htmlFor="city-search">
        <span className="search-icon">⌕</span>
        <input id="city-search" defaultValue="Berlin" aria-label="Buscar ciudad" />
      </label>

      <nav className="top-links" aria-label="Navegación principal">
        <a href="#">Buy</a>
        <a href="#">Rent</a>
        <a href="#">Sell</a>
        <a href="#">Mortgage</a>
      </nav>

      <button type="button" className="btn-auth">
        Join / Sign in
      </button>
    </header>
  );
}
