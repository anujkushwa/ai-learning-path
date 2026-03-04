"use client";

import { UserButton } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { Plus, Menu, X } from "lucide-react";
import { useState } from "react";

export default function TeacherNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = (path) =>
    `relative px-3 py-2 transition text-sm
     ${
       pathname === path
         ? "text-emerald-700 font-semibold after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-emerald-600"
         : "text-gray-600 hover:text-emerald-600"
     }`;

  const mobileLinkClass = (path) =>
    `block px-4 py-3 rounded-lg text-sm transition
     ${
       pathname === path
         ? "bg-emerald-100 text-emerald-700 font-semibold"
         : "text-gray-700 hover:bg-emerald-50"
     }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/80 border-b border-emerald-200 shadow-sm">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-6">

          {/* LOGO */}
          <div
            onClick={() => router.push("/teacher/dashboard")}
            className="cursor-pointer flex items-center gap-2"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <span className="text-base sm:text-lg font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Learning Path
            </span>
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-6 font-medium">

            <button
              onClick={() => router.push("/teacher/dashboard")}
              className={linkClass("/teacher/dashboard")}
            >
              Dashboard
            </button>

            <button
              onClick={() => router.push("/teacher/learners")}
              className={linkClass("/teacher/learners")}
            >
              Learners
            </button>

            <button
              onClick={() => router.push("/teacher/reports")}
              className={linkClass("/teacher/reports")}
            >
              Reports
            </button>

          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 sm:gap-5">

          {/* DESKTOP CREATE TEST */}
          <button
            onClick={() => router.push("/teacher/create-test")}
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm
              bg-gradient-to-r from-emerald-600 to-teal-600
              hover:from-emerald-700 hover:to-teal-700
              text-white rounded-lg shadow-md transition"
          >
            <Plus size={16} />
            Create Test
          </button>

          {/* DESKTOP LABEL */}
          <span className="hidden md:block text-sm text-gray-500">
            Teacher Panel
          </span>

          {/* PROFILE */}
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
        <div className="md:hidden bg-white border-t border-emerald-100 shadow-lg animate-slideDown">

          <div className="px-4 py-4 space-y-2">

            <button
              onClick={() => {
                router.push("/teacher/dashboard");
                setMobileOpen(false);
              }}
              className={mobileLinkClass("/teacher/dashboard")}
            >
              Dashboard
            </button>

            <button
              onClick={() => {
                router.push("/teacher/learners");
                setMobileOpen(false);
              }}
              className={mobileLinkClass("/teacher/learners")}
            >
              Learners
            </button>

            <button
              onClick={() => {
                router.push("/teacher/reports");
                setMobileOpen(false);
              }}
              className={mobileLinkClass("/teacher/reports")}
            >
              Reports
            </button>

            <button
              onClick={() => {
                router.push("/teacher/create-test");
                setMobileOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-3 text-sm
                bg-gradient-to-r from-emerald-600 to-teal-600
                text-white rounded-lg"
            >
              <Plus size={16} />
              Create Test
            </button>

          </div>
        </div>
      )}
    </nav>
  );
}