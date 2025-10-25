import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Home, Package, User, Plus, Menu, X, Box } from "lucide-react";
import Adminnavbar from "./Adminnavbar";

const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="">
      {/* Navbar */}

      <Adminnavbar />
      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet /> {/* Nested admin routes */}
      </main>
    </div>
  );
};

export default AdminLayout;
