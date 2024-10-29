import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Plus, LayoutDashboard, LogIn, Menu, X } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl">PropComm</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/submit"
              className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${
                location.pathname === '/submit'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Plus className="h-5 w-5" />
              <span>Submit</span>
            </Link>

            <Link
              to="/admin"
              className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${
                location.pathname === '/admin'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Admin</span>
            </Link>

            <Link
              to="/login"
              className="flex items-center space-x-1 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </Link>
          </div>
        </div>

        {/* Mobile navigation */}
        <div
          className={`lg:hidden ${
            isMenuOpen ? 'block' : 'hidden'
          } border-t border-gray-100 py-4 space-y-2`}
        >
          <Link
            to="/submit"
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg w-full ${
              location.pathname === '/submit'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Plus className="h-5 w-5" />
            <span>Submit Community</span>
          </Link>

          <Link
            to="/admin"
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg w-full ${
              location.pathname === '/admin'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Admin Dashboard</span>
          </Link>

          <Link
            to="/login"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center space-x-2 px-4 py-3 rounded-lg w-full text-gray-600 hover:bg-gray-100"
          >
            <LogIn className="h-5 w-5" />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}