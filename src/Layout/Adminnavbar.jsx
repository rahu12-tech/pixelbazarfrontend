import React, { useState } from 'react'
import { Outlet, NavLink } from "react-router-dom";
import { Home, Package, User, Plus, Menu, X, Box } from "lucide-react";

function Adminnavbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="">
      <nav className="bg-gray-900 sticky top-0 z-50 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="text-xl font-bold">
              <NavLink to="dashboard">Admin Panel</NavLink>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6">
              <NavLink to="dashboard" className="flex items-center gap-2 hover:text-blue-400 transition">
                <Home size={18} /> Dashboard
              </NavLink>
              <NavLink to="addproduct" className="flex items-center gap-2 hover:text-blue-400 transition">
                <Plus size={18} /> Add Product
              </NavLink>
              <NavLink to="contact-user" className="flex items-center gap-2 hover:text-blue-400 transition">
                <Package size={18} /> Contact
              </NavLink>
              <NavLink to="users" className="flex items-center gap-2 hover:text-blue-400 transition">
                <User size={18} /> Users
              </NavLink>
              <NavLink to="showproduct" className="flex items-center gap-2 hover:text-blue-400 transition">
                <Box size={18} /> Show Product
              </NavLink>
              <NavLink to="ordertracking" className="flex items-center gap-2 hover:text-blue-400 transition">
                <Package size={18} /> Order Tracking
              </NavLink>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setOpen(!open)}>
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {open && (
          <div className="md:hidden bg-gray-800 px-4 py-3 space-y-3">
            <NavLink to="dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2 hover:text-blue-400 transition">
              <Home size={18} /> Dashboard
            </NavLink>
            <NavLink to="addproduct" onClick={() => setOpen(false)} className="flex items-center gap-2 hover:text-blue-400 transition">
              <Plus size={18} /> Add Product
            </NavLink>
            <NavLink to="orders" onClick={() => setOpen(false)} className="flex items-center gap-2 hover:text-blue-400 transition">
              <Package size={18} /> Orders
            </NavLink>
            <NavLink to="users" onClick={() => setOpen(false)} className="flex items-center gap-2 hover:text-blue-400 transition">
              <User size={18} /> Users
            </NavLink>
            <NavLink to="showproduct" onClick={() => setOpen(false)} className="flex items-center gap-2 hover:text-blue-400 transition">
              <Box size={18} /> Show Product
            </NavLink>
            <NavLink to="ordertracking" onClick={() => setOpen(false)} className="flex items-center gap-2 hover:text-blue-400 transition">
              <Package size={18} /> Order Tracking
            </NavLink>
          </div>
        )}
      </nav>
    </div>
  )
}

export default Adminnavbar;
