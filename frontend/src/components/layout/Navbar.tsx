import React from "react"
import { Link, useLocation } from "react-router-dom"

const Navbar: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-primary shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl font-bold">
              Personal Finance Tracker
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/")
                  ? "bg-blue-700 text-white"
                  : "text-white hover:bg-blue-600"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/summary"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/summary")
                  ? "bg-blue-700 text-white"
                  : "text-white hover:bg-blue-600"
              }`}
            >
              Summary
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
