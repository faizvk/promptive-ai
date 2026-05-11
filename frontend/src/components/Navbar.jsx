import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  FileText,
  Image,
  MessageSquare,
  Mic,
  Menu,
  X,
} from "lucide-react";

const navItemMega =
  "relative w-full group/item lg:w-auto lg:after:content-[''] lg:after:absolute lg:after:top-full lg:after:left-[-25%] lg:after:w-[150%] lg:after:h-3";

const navLink =
  "text-sm text-white cursor-pointer flex items-center gap-1.5 px-6 py-4 justify-between border-b border-white/5 lg:px-1.5 lg:py-2 lg:justify-start lg:border-b-0 lg:hover:opacity-85";

const chevron =
  "transition-transform duration-200 group-[.open]/item:rotate-180 lg:group-[.open]/item:!rotate-0";

const megaMenu =
  "hidden w-full bg-black/15 m-0 px-6 py-4 rounded-none group-[.open]/item:block " +
  "lg:!flex lg:flex-col lg:gap-1 lg:absolute lg:top-full lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-0 lg:mt-2.5 lg:w-[280px] lg:p-1.5 lg:bg-white lg:border lg:border-border-soft lg:rounded-xl lg:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)] lg:opacity-0 lg:invisible lg:pointer-events-none lg:transition-[opacity,transform] lg:duration-150 lg:z-40 " +
  "lg:group-hover/item:opacity-100 lg:group-hover/item:visible lg:group-hover/item:pointer-events-auto lg:group-hover/item:translate-y-1";

const megaLink =
  "group/link flex items-start gap-2.5 p-3 rounded-lg no-underline transition-colors duration-150 hover:bg-white/5 lg:hover:bg-bg-soft";

const megaTitle =
  "font-semibold text-[0.92rem] text-white lg:text-text-primary block";

const megaSub =
  "text-[0.78rem] text-white/70 lg:text-text-muted mt-0.5 leading-snug";

const megaIconWrap =
  "shrink-0 w-9 h-9 rounded-lg bg-white/10 lg:bg-brand-primary/10 text-white lg:text-brand-primary flex items-center justify-center mt-0.5 transition-colors duration-150 group-hover/link:bg-brand-primary group-hover/link:text-white";

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
          className="text-[1.25rem] font-extrabold text-white no-underline tracking-[-0.02em]"
          onClick={closeAll}
        >
          Promptive
          <span className="text-btn-secondary">AI</span>
        </Link>
      </div>

      <button
        className="block bg-transparent border-0 text-white cursor-pointer p-2 order-3 lg:hidden"
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation"
      >
        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <ul
        className={[
          "list-none flex-col gap-0 absolute top-full left-0 w-full bg-brand-primary py-4 max-h-[85vh] overflow-y-auto",
          isMobileMenuOpen ? "flex" : "hidden",
          "lg:!flex lg:flex-row lg:items-center lg:gap-6 lg:static lg:bg-transparent lg:p-0 lg:max-h-none lg:overflow-visible lg:w-auto",
        ].join(" ")}
      >
        <li className={`${navItemMega} ${activeDropdown === 0 ? "open" : ""}`}>
          <div className={navLink} onClick={() => handleDropdownClick(0)}>
            Products <ChevronDown size={14} className={chevron} />
          </div>

          <div className={megaMenu}>
            <Link to="/image-generate" className={megaLink} onClick={closeAll}>
              <span className={megaIconWrap}>
                <Image size={16} />
              </span>
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
              <span className={megaIconWrap}>
                <FileText size={16} />
              </span>
              <div>
                <span className={megaTitle}>Content Rewrite</span>
                <p className={megaSub}>Rewrite text in any tone</p>
              </div>
            </Link>

            <Link to="/chat" className={megaLink} onClick={closeAll}>
              <span className={megaIconWrap}>
                <MessageSquare size={16} />
              </span>
              <div>
                <span className={megaTitle}>AI Chat</span>
                <p className={megaSub}>GPT, Claude, Gemini, Llama</p>
              </div>
            </Link>

            <Link to="/voice" className={megaLink} onClick={closeAll}>
              <span className={megaIconWrap}>
                <Mic size={16} />
              </span>
              <div>
                <span className={megaTitle}>Voice Synthesis</span>
                <p className={megaSub}>Studio-grade voices, MP3 output</p>
              </div>
            </Link>
          </div>
        </li>

        <li className="lg:relative">
          <Link
            to="/pricing"
            className={`${navLink} lg:!justify-start`}
            onClick={closeAll}
          >
            Pricing
          </Link>
        </li>
      </ul>

      <div className="flex items-center gap-2 sm:gap-3 mr-0 lg:mr-[60px]">
        <Link
          to="/login"
          className="text-sm font-medium text-white/85 no-underline px-3 sm:px-4 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors max-[480px]:hidden"
          onClick={closeAll}
        >
          Sign in
        </Link>
        <Link
          to="/signup"
          className="group flex px-3.5 sm:px-4 py-2 rounded-lg bg-white text-brand-primary text-xs sm:text-sm font-semibold items-center gap-1.5 no-underline hover:bg-bg-soft transition-[transform,background-color] duration-200 hover:-translate-y-0.5 whitespace-nowrap"
          onClick={closeAll}
        >
          Get started
          <ArrowRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
