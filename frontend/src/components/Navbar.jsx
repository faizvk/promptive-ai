import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  FileText,
  Image,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import "./styles/Navbar.css";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveDropdown(null);
  };

  const handleDropdownClick = (index) => {
    if (window.innerWidth < 1024) {
      setActiveDropdown(activeDropdown === index ? null : index);
    }
  };

  const closeAll = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo" onClick={closeAll}>
          Promptive<span>AI</span>
        </Link>
      </div>

      <button
        className="mobile-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <ul className={`navbar-links ${isMobileMenuOpen ? "active" : ""}`}>
        <li className={`nav-item mega ${activeDropdown === 0 ? "open" : ""}`}>
          <div className="nav-link" onClick={() => handleDropdownClick(0)}>
            Products <ChevronDown size={16} className="chevron" />
          </div>

          <div className="mega-menu">
            <div className="mega-column">
              <h4>AI Tools</h4>

              <Link
                to="/image-generate"
                className="mega-link"
                onClick={closeAll}
              >
                <Image size={18} />
                <div>
                  <span>Image Generation</span>
                  <p>Create AI images from prompts</p>
                </div>
              </Link>

              <Link
                to="/content-rewrite"
                className="mega-link"
                onClick={closeAll}
              >
                <FileText size={18} />
                <div>
                  <span>Content Rewrite</span>
                  <p>Rewrite text with AI precision</p>
                </div>
              </Link>
            </div>
          </div>
        </li>

        <li className={`nav-item mega ${activeDropdown === 1 ? "open" : ""}`}>
          <div className="nav-link" onClick={() => handleDropdownClick(1)}>
            Solutions <ChevronDown size={16} className="chevron" />
          </div>

          <div className="mega-menu">
            <div className="mega-column">
              <h4>Use Cases</h4>
              <a className="mega-link" href="#" onClick={closeAll}>
                <div>
                  <span>Marketing Teams</span>
                  <p>Campaigns, ads, visuals</p>
                </div>
              </a>
              <a className="mega-link" href="#" onClick={closeAll}>
                <div>
                  <span>Creators</span>
                  <p>Content & social media</p>
                </div>
              </a>
            </div>
          </div>
        </li>

        <li className={`nav-item mega ${activeDropdown === 2 ? "open" : ""}`}>
          <div className="nav-link" onClick={() => handleDropdownClick(2)}>
            Resources <ChevronDown size={16} className="chevron" />
          </div>

          <div className="mega-menu">
            <div className="mega-column">
              <h4>Learn</h4>
              <a className="mega-link" href="#" onClick={closeAll}>
                <BookOpen size={18} />
                <div>
                  <span>Documentation</span>
                  <p>API & platform guides</p>
                </div>
              </a>
            </div>
          </div>
        </li>

        <li className={`nav-item ${activeDropdown === 3 ? "open" : ""}`}>
          <div className="nav-link" onClick={() => handleDropdownClick(3)}>
            Pricing <ChevronDown size={16} className="chevron" />
          </div>

          <div className="nav-dropdown">
            <a href="#" onClick={closeAll}>
              Free Plan{" "}
            </a>
            <a href="#" onClick={closeAll}>
              Pro Plan
            </a>
            <a href="#" onClick={closeAll}>
              Enterprise
            </a>
          </div>
        </li>
      </ul>

      <div className="navbar-actions">
        <Link to="/login" className="nav-login" onClick={closeAll}>
          Login
        </Link>
        <Link to="/signup" className="nav-cta" onClick={closeAll}>
          Get Started
          <ArrowRight size={15} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
