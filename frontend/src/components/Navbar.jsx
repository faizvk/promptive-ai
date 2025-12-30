import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  LayoutGrid,
  FileText,
  Image,
  BookOpen,
} from "lucide-react";
import "./styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* LEFT: LOGO */}
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          Promptive<span>AI</span>
        </Link>
      </div>

      {/* CENTER: LINKS */}
      <ul className="navbar-links">
        {/* PRODUCTS MEGA MENU */}
        <li className="nav-item mega">
          <span className="nav-link">
            Products <ChevronDown size={16} />
          </span>

          <div className="mega-menu">
            <div className="mega-column">
              <h4>AI Tools</h4>

              <Link to="/image-generate" className="mega-link">
                <Image size={18} />
                <div>
                  <span>Image Generation</span>
                  <p>Create AI images from prompts</p>
                </div>
              </Link>

              <Link to="/content-rewrite" className="mega-link">
                <FileText size={18} />
                <div>
                  <span>Content Rewrite</span>
                  <p>Rewrite text with AI precision</p>
                </div>
              </Link>
            </div>

            <div className="mega-column">
              <h4>Workspace</h4>

              <Link to="/history" className="mega-link">
                <LayoutGrid size={18} />
                <div>
                  <span>History</span>
                  <p>Manage generated content</p>
                </div>
              </Link>
            </div>
          </div>
        </li>

        {/* SOLUTIONS */}
        <li className="nav-item mega">
          <span className="nav-link">
            Solutions <ChevronDown size={16} />
          </span>

          <div className="mega-menu">
            <div className="mega-column">
              <h4>Use Cases</h4>
              <a className="mega-link" href="#">
                <div>
                  <span>Marketing Teams</span>
                  <p>Campaigns, ads, visuals</p>
                </div>
              </a>
              <a className="mega-link" href="#">
                <div>
                  <span>Creators</span>
                  <p>Content & social media</p>
                </div>
              </a>
            </div>
          </div>
        </li>

        {/* RESOURCES */}
        <li className="nav-item mega">
          <span className="nav-link">
            Resources <ChevronDown size={16} />
          </span>

          <div className="mega-menu">
            <div className="mega-column">
              <h4>Learn</h4>
              <a className="mega-link" href="#">
                <BookOpen size={18} />
                <div>
                  <span>Documentation</span>
                  <p>API & platform guides</p>
                </div>
              </a>
            </div>
          </div>
        </li>

        <li className="nav-item">
          <span className="nav-link">
            Pricing <ChevronDown size={16} />
          </span>

          <div className="nav-dropdown">
            <a href="#">Free Plan </a>
            <a href="#">Pro Plan</a>
            <a href="#">Enterprise</a>
          </div>
        </li>
      </ul>

      {/* RIGHT: ACTIONS */}
      <div className="navbar-actions">
        <Link to="/login" className="nav-login">
          Login
        </Link>
        <Link to="/signup" className="nav-cta">
          Get Started
          <ArrowRight size={15} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
