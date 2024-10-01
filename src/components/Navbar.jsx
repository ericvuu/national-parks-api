import { Link } from "react-router-dom";
import { useState } from "react";
import Logo from "../assets/logo_white.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar np-nav">
      <Link className="navbar-brand" to="/">
        <img alt="National Parks logo" className="np-logo" src={Logo} />
        <p>National Parks</p>
      </Link>
      <button
        aria-controls="navbarToggler"
        aria-expanded={isOpen}
        aria-label="Toggle navigation"
        className="navbar-toggler"
        onClick={toggleNavbar}
        type="button"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className={`navbar-collapse ${isOpen ? "open" : "collapse"}`}
        id="navbarToggler"
      >
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/about">
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/explore">
              Explore
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
