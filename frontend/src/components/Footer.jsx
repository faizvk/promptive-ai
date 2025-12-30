import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin, Youtube } from "lucide-react";
import "./styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* =======================
         TOP SECTION
      ======================= */}
      <div className="footer-inner">
        {/* BRAND */}
        <div className="footer-brand">
          <h2 className="footer-logo">
            Promptive<span>AI</span>
          </h2>
          <p>
            Build faster with AI-powered tools for image generation and content
            creation.
          </p>
        </div>

        {/* PRODUCT */}
        <div className="footer-col">
          <h4>Product</h4>
          <Link to="/image-generate">Image Generation</Link>
          <Link to="/content-rewrite">Content Rewrite</Link>
          <Link to="/history">History</Link>
        </div>

        {/* COMPANY */}
        <div className="footer-col">
          <h4>Company</h4>
          <a href="#">About</a>
          <a href="#">Careers</a>
          <a href="#">Contact</a>
        </div>

        {/* RESOURCES */}
        <div className="footer-col">
          <h4>Resources</h4>
          <a href="#">Documentation</a>
          <a href="#">Blog</a>
          <a href="#">Support</a>
        </div>
      </div>

      {/* =======================
         BOTTOM BAR
      ======================= */}
      <div className="footer-bottom">
        {/* SOCIAL ICONS */}
        <div className="footer-socials">
          <a href="#" aria-label="Twitter">
            <Twitter size={18} />
          </a>
          <a href="#" aria-label="GitHub">
            <Github size={18} />
          </a>
          <a href="#" aria-label="LinkedIn">
            <Linkedin size={18} />
          </a>
          <a href="#" aria-label="YouTube">
            <Youtube size={18} />
          </a>
        </div>
        <p>© {new Date().getFullYear()} Promptive AI. All rights reserved.</p>

        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
          <a href="#">Security</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
