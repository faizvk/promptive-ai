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

const navItem =
  "relative w-full group/item lg:w-auto lg:after:content-[''] lg:after:absolute lg:after:top-full lg:after:left-0 lg:after:w-full lg:after:h-3";

const navItemMega =
  "relative w-full group/item lg:w-auto lg:after:content-[''] lg:after:absolute lg:after:top-full lg:after:left-[-40%] lg:after:w-[180%] lg:after:h-4";

const navLink =
  "text-sm text-white cursor-pointer flex items-center gap-1.5 px-6 py-4 justify-between border-b border-white/5 lg:px-1.5 lg:py-2 lg:justify-start lg:border-b-0 lg:hover:opacity-85";

const chevron =
  "transition-transform duration-200 group-[.open]/item:rotate-180 lg:group-[.open]/item:!rotate-0";

const dropdown =
  "hidden w-full bg-black/20 m-0 px-6 py-4 rounded-none group-[.open]/item:block " +
  "lg:!flex lg:flex-col lg:gap-1.5 lg:absolute lg:top-full lg:mt-2 lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-0 lg:min-w-[220px] lg:p-3 lg:bg-[#ffe492e2] lg:rounded-xl lg:shadow-[0_20px_40px_rgba(0,0,0,0.25)] lg:opacity-0 lg:invisible lg:pointer-events-none lg:transition-[opacity,transform] lg:duration-150 lg:z-30 " +
  "lg:group-hover/item:opacity-100 lg:group-hover/item:visible lg:group-hover/item:pointer-events-auto lg:group-hover/item:translate-y-1.5";

const dropdownLink =
  "text-sm text-white no-underline px-0 py-3 transition-colors lg:text-text-primary lg:px-2.5 lg:py-2 lg:rounded-lg lg:hover:bg-bg-soft lg:hover:text-brand-primary";

const megaMenu =
  "hidden w-full bg-black/20 m-0 px-6 py-4 rounded-none group-[.open]/item:block " +
  "lg:!grid lg:gap-8 lg:absolute lg:top-full lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-0 lg:mt-3.5 lg:w-[680px] lg:p-7 lg:bg-[#ffe492e1] lg:rounded-[18px] lg:shadow-[0_40px_80px_rgba(0,0,0,0.3)] lg:opacity-0 lg:invisible lg:pointer-events-none lg:transition-[opacity,transform] lg:duration-200 lg:z-40 " +
  "lg:[grid-template-columns:repeat(auto-fit,minmax(240px,1fr))] " +
  "lg:group-hover/item:opacity-100 lg:group-hover/item:visible lg:group-hover/item:pointer-events-auto lg:group-hover/item:translate-y-2";

const megaLink =
  "flex items-start gap-3 p-3 rounded-2xl no-underline transition-[background-color,transform] duration-150 hover:opacity-70 hover:translate-x-0.5";

const megaTitle =
  "font-semibold text-[0.95rem] text-white lg:text-[#111827]";

const megaSub =
  "text-[0.8rem] text-white/80 lg:text-[#6b7280] mt-0.5";

const megaSvg = "shrink-0 text-white lg:text-[#111827]";

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
    <nav className="sticky top-0 z-[100] w-full bg-brand-primary/95 backdrop-blur-md border-b border-white/[0.08] py-3 px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-2">
      <div>
        <Link
          to="/"
          className="text-[1.35rem] font-extrabold text-white no-underline tracking-[-0.02em]"
          onClick={closeAll}
        >
          Promptive
          <span className="bg-gradient-to-r from-btn-secondary to-[#fff5cf] bg-clip-text text-transparent">
            AI
          </span>
        </Link>
      </div>

      <button
        className="block bg-transparent border-0 text-white cursor-pointer p-2 order-3 lg:hidden"
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <ul
        className={[
          "list-none flex-col gap-0 absolute top-full left-0 w-full bg-brand-primary py-4 max-h-[85vh] overflow-y-auto",
          isMobileMenuOpen ? "flex" : "hidden",
          "lg:!flex lg:flex-row lg:gap-8 lg:static lg:bg-transparent lg:p-0 lg:max-h-none lg:overflow-visible lg:w-auto",
        ].join(" ")}
      >
        <li className={`${navItemMega} ${activeDropdown === 0 ? "open" : ""}`}>
          <div className={navLink} onClick={() => handleDropdownClick(0)}>
            Products <ChevronDown size={16} className={chevron} />
          </div>

          <div className={megaMenu}>
            <div>
              <h4 className="text-xs font-bold text-[#6b7280] mb-3 uppercase tracking-[0.08em]">
                AI Tools
              </h4>

              <Link
                to="/image-generate"
                className={megaLink}
                onClick={closeAll}
              >
                <Image size={18} className={megaSvg} />
                <div>
                  <span className={megaTitle}>Image Generation</span>
                  <p className={megaSub}>Create AI images from prompts</p>
                </div>
              </Link>

              <Link
                to="/content-rewrite"
                className={megaLink}
                onClick={closeAll}
              >
                <FileText size={18} className={megaSvg} />
                <div>
                  <span className={megaTitle}>Content Rewrite</span>
                  <p className={megaSub}>Rewrite text with AI precision</p>
                </div>
              </Link>
            </div>
          </div>
        </li>

        <li className={`${navItemMega} ${activeDropdown === 1 ? "open" : ""}`}>
          <div className={navLink} onClick={() => handleDropdownClick(1)}>
            Solutions <ChevronDown size={16} className={chevron} />
          </div>

          <div className={megaMenu}>
            <div>
              <h4 className="text-xs font-bold text-[#6b7280] mb-3 uppercase tracking-[0.08em]">
                Use Cases
              </h4>
              <a className={megaLink} href="#" onClick={closeAll}>
                <div>
                  <span className={megaTitle}>Marketing Teams</span>
                  <p className={megaSub}>Campaigns, ads, visuals</p>
                </div>
              </a>
              <a className={megaLink} href="#" onClick={closeAll}>
                <div>
                  <span className={megaTitle}>Creators</span>
                  <p className={megaSub}>Content & social media</p>
                </div>
              </a>
            </div>
          </div>
        </li>

        <li className={`${navItemMega} ${activeDropdown === 2 ? "open" : ""}`}>
          <div className={navLink} onClick={() => handleDropdownClick(2)}>
            Resources <ChevronDown size={16} className={chevron} />
          </div>

          <div className={megaMenu}>
            <div>
              <h4 className="text-xs font-bold text-[#6b7280] mb-3 uppercase tracking-[0.08em]">
                Learn
              </h4>
              <a className={megaLink} href="#" onClick={closeAll}>
                <BookOpen size={18} className={megaSvg} />
                <div>
                  <span className={megaTitle}>Documentation</span>
                  <p className={megaSub}>API & platform guides</p>
                </div>
              </a>
            </div>
          </div>
        </li>

        <li className={`${navItem} ${activeDropdown === 3 ? "open" : ""}`}>
          <div className={navLink} onClick={() => handleDropdownClick(3)}>
            Pricing <ChevronDown size={16} className={chevron} />
          </div>

          <div className={dropdown}>
            <a href="#" className={dropdownLink} onClick={closeAll}>
              Free Plan{" "}
            </a>
            <a href="#" className={dropdownLink} onClick={closeAll}>
              Pro Plan
            </a>
            <a href="#" className={dropdownLink} onClick={closeAll}>
              Enterprise
            </a>
          </div>
        </li>
      </ul>

      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mr-0 lg:mr-[70px]">
        <Link
          to="/login"
          className="text-sm font-medium text-white/85 no-underline px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors max-[480px]:hidden"
          onClick={closeAll}
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="group flex px-3.5 sm:px-5 lg:px-6 py-2 sm:py-2.5 rounded-xl bg-btn-primary hover:bg-[#3b8de8] text-white text-xs sm:text-sm font-semibold justify-center gap-1.5 sm:gap-2 items-center no-underline transition-colors whitespace-nowrap"
          onClick={closeAll}
        >
          Get Started
          <ArrowRight
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
