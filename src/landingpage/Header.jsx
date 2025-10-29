export default function Header() {

  return (
    <header>
      <nav className="landing-container">
        <a href="#" className="logo">PathFinder</a>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="menu-toggle">☰</div>
      </nav>
    </header>
  );
}
