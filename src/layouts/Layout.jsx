import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-gray-50">
        <Outlet />
      </main>

      <footer className="bg-white text-center text-sm text-gray-500 py-4 shadow-inner">
        © {new Date().getFullYear()} CrowdSpark. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;