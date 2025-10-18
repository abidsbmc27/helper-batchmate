import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const Logo: React.FC = () => (
    <svg width="42" height="42" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4ADE80" />
                <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
        </defs>
        <rect width="120" height="120" rx="20" fill="url(#logoGrad)"/>
        <path d="M25 30H45V90H25V30Z" fill="white"/>
        <path d="M25 52.5H70V67.5H25V52.5Z" fill="white"/>
        <path d="M70 30C55 30 45 40 45 52.5V67.5C45 80 55 90 70 90C90 90 100 80 100 75V45C100 40 90 30 70 30ZM85 72C85 75 78 78 70 78C62 78 55 75 55 72V68H85V72ZM85 52H55V48C55 45 62 42 70 42C78 42 85 45 85 48V52Z" fill="white"/>
    </svg>
);

const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-green-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const MenuIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const Header: React.FC = () => {
  const { currentUser, logout } = useAppContext();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `font-semibold transition duration-300 text-lg ${
      isActive ? 'text-green-400' : 'text-gray-300 hover:text-green-400'
    }`;
    
  const mobileNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `font-semibold transition duration-300 text-3xl py-2 ${
      isActive ? 'text-green-400' : 'text-gray-300 hover:text-green-400'
    }`;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg shadow-lg border-b border-gray-700/50">
        <nav className="mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsMenuOpen(false)}>
              <Logo />
              <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-400">
                Helper BatchMate
              </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {currentUser ? (
              <>
                <NavLink to="/" className={navLinkClassName} end>কমিউনিটি</NavLink>
                <NavLink to="/leaderboard" className={navLinkClassName}>লিডারবোর্ড</NavLink>
                <Link
                    to="/new-post"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg transition duration-300"
                >
                    প্রবলেম পোস্ট
                </Link>
                <Link to="/profile" className="flex flex-col items-center text-center group">
                    <UserIcon />
                    <span className="text-xs text-gray-400 group-hover:text-green-300 transition-colors mt-0.5">{currentUser.fullName.split(' ')[0]}</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="border border-red-600 text-red-400 hover:bg-red-600/20 font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    লগআউট
                </button>
              </>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-gray-300 hover:text-green-400 font-semibold">লগইন</Link>
                <Link
                  to="/register"
                  className="border border-orange-500 text-orange-400 hover:bg-orange-500/20 font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  রেজিস্টার
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            {currentUser && (
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white">
                    <MenuIcon />
                </button>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed top-0 left-0 w-full h-full bg-gray-900 z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4 pt-6">
             <button onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-white">
                <CloseIcon />
            </button>
        </div>
        <div className="flex flex-col items-center justify-center h-full space-y-8 -mt-16">
          <NavLink to="/" className={mobileNavLinkClassName} onClick={() => setIsMenuOpen(false)} end>কমিউনিটি</NavLink>
          <NavLink to="/leaderboard" className={mobileNavLinkClassName} onClick={() => setIsMenuOpen(false)}>লিডারবোর্ড</NavLink>
          <NavLink to="/profile" className={mobileNavLinkClassName} onClick={() => setIsMenuOpen(false)}>প্রোফাইল</NavLink>
          <Link
              to="/new-post"
              onClick={() => setIsMenuOpen(false)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 text-2xl"
          >
              প্রবলেম পোস্ট
          </Link>
          <button
              onClick={handleLogout}
              className="border border-red-600 text-red-400 hover:bg-red-600/20 font-bold py-3 px-8 rounded-lg transition duration-300 text-2xl"
          >
              লগআউট
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;