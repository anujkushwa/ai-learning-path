"use client";

import { UserButton } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, BarChart3, Menu, X } from "lucide-react";
import { useState } from "react";

export default function StudentNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItem = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm
     ${
       pathname === path
         ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
         : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
     }`;

  const mobileNavItem = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm
     ${
       pathname === path
         ? "bg-blue-100 text-blue-700 font-semibold"
         : "text-gray-700 hover:bg-blue-50"
     }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200 shadow-sm">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <div
          onClick={() => router.push("/student/dashboard")}
          className="cursor-pointer text-base sm:text-xl font-extrabold 
                     bg-gradient-to-r from-blue-600 to-cyan-500 
                     bg-clip-text text-transparent"
        >
          AI Learning Path
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-3">

          <button
            onClick={() => router.push("/student/dashboard")}
            className={navItem("/student/dashboard")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            onClick={() => router.push("/student/test")}
            className={navItem("/student/test")}
          >
            <ClipboardList size={18} />
            Tests
          </button>

          <button
            onClick={() => router.push("/student/progress")}
            className={navItem("/student/progress")}
          >
            <BarChart3 size={18} />
            Progress
          </button>

        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3 sm:gap-4">

          <span className="hidden sm:block text-sm font-medium text-gray-500">
            Student Panel
          </span>

          <UserButton afterSignOutUrl="/" />

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">

          <div className="px-4 py-4 space-y-2">

            <button
              onClick={() => {
                router.push("/student/dashboard");
                setMobileOpen(false);
              }}
              className={mobileNavItem("/student/dashboard")}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>

            <button
              onClick={() => {
                router.push("/student/test");
                setMobileOpen(false);
              }}
              className={mobileNavItem("/student/test")}
            >
              <ClipboardList size={18} />
              Tests
            </button>

            <button
              onClick={() => {
                router.push("/student/progress");
                setMobileOpen(false);
              }}
              className={mobileNavItem("/student/progress")}
            >
              <BarChart3 size={18} />
              Progress
            </button>

          </div>
        </div>
      )}
    </nav>
  );
}