import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl no-underline font-bold tracking-wide text-white hover:text-blue-400 transition duration-300"
        >
          Automated Market Research and Trigger Finder
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" label="Enter Your Product" />
          <NavLink to="/team" label="Team" />
        </div>

        {/* Mobile Hamburger Icon */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none text-white hover:text-blue-400 transition duration-300"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-gray-800 text-white absolute top-0 left-0 w-full h-screen transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="px-4 py-6">
          <button
            onClick={toggleMenu}
            className="absolute top-4 right-4 text-white hover:text-blue-400 transition duration-300"
          >
            <X size={28} />
          </button>
          <div className="flex flex-col space-y-6 mt-10">
            <NavLink to="/" label="Home" onClick={toggleMenu} />
            <NavLink to="/profiles" label="Profiles" onClick={toggleMenu} />
            <NavLink
              to="/team"
              label="Team"
              onClick={toggleMenu}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

// Reusable NavLink Component
const NavLink = ({ to, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    // className="mt-1.5 w-7.5 hover:scale-110 duration-200 hover:stroke-blue-500">
    className="text-lg font-medium hover:scale-105 hover:text-blue-400 transition duration-300"
  >
    {label}
  </Link>
);

export default Navbar;
