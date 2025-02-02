import React from "react";
import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Navbar/Sidebar";

function Layout() {
  return (
    <>
      <Navbar />
      <div className="sm:flex flex-none">
        <div className="text-white">
          <Sidebar />
        </div>
        <div className="sm:flex-1">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
