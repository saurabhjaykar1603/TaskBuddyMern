import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Settings, Zap } from "lucide-react";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const User = user

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    localStorage.removeItem("token");
    navigate("/login");
    onLogout();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 background-blur-md shadow-sm border-b border-gray-200 font-sans">
        <div className=" flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto ">
          {/* LOGO */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 shadow-lg group-hover:shadow-purple-300/50 group-hover:scale-105 transition-all duration-300">
              <Zap className="text-white w-6 h-6" />
              <div className="absolute -bottom-1 -middle-1 w-3 h-3 bg-white rounded-full shadow-sm animate-ping" />
            </div>
            {/* BRAND NAME */}
            <span className="text-2xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent tracking-wide">
              TaskBuddy
            </span>
          </div>
          {/* NAVIGATION */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/profile")}
              className="p-4 text-gray-600 hover:text-purple-500 transition-colors duration-300 hover:bg-purple-50 rounded-full cursor-pointer"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* USER Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={handleToggleMenu}
                className="flex items-center gap-3 px-3 py-2 rounded-full cursor-pointer hover:bg-purple-50 transition-colors duration-300 border-transparent hover:border-purple-200"
              >
                <div className="relative">
                  {User?.avatar ? (
                    <img
                      src={User?.avatar}
                      alt="User Avatar"
                      className="w-9 h-9 rounded-full shadow-sm"
                    />
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white font-semibold shadow-md">
                      {User?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse " />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-gray-700">
                    {User?.name}
                  </p>
                  <p className="text-xs text-gray-500">{User?.email}</p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                    isMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <ul className="absolute top-14  right-0 w-56 bg-white rounded-2xl shadow-xl border border-purple-200 z-50 overflow-hidden  animate-fadeIn">
                  <li className="p-2">
                    <button
                      className="w-full px-4 py-2.5  text-left  hover:bg-purple-50 text-sm  text-gray-700 transition-colors flex items-center gap-3 group cursor-pointer"
                      role="menuitem"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/profile");
                      }}
                    >
                      <Settings className="w-4 h-4 text-gray-700" />
                      Profile Settings
                    </button>
                  </li>

                  <li className="p-2">
                    <button
                      role="menuitem"
                      onClick={handleLogout}
                    className="w-full px-4 py-2.5  text-left  hover:bg-red-50 text-sm  text-red-700 transition-colors flex items-center gap-3 group cursor-pointer">
                      <LogOut className="w-4 h-4 text-gray-700" />
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
