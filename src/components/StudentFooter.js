export default function StudentFooter() {
  return (
    <footer className="bg-gradient-to-br from-slate-50 via-white to-indigo-50 border-t mt-20 sm:mt-24">

      {/* TOP */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 
                      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
                      gap-10 sm:gap-12 text-sm">

        {/* BRAND */}
        <div className="text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-extrabold 
                         bg-gradient-to-r from-red-400 to-purple-600 
                         bg-clip-text text-transparent mb-4">
            AI Learning Path
          </h3>

          <p className="text-slate-600 leading-relaxed max-w-sm mx-auto sm:mx-0">
            Your personal AI-powered learning companion. Practice smarter,
            track progress, and follow a customized roadmap to master skills.
          </p>
        </div>

        {/* STUDENT TOOLS */}
        <div className="text-center sm:text-left">
          <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-700 mb-4 sm:mb-5">
            Student Tools
          </h4>

          <ul className="space-y-2 sm:space-y-3 text-slate-600">
            <li className="hover:text-indigo-600 transition cursor-pointer">
              Practice Tests
            </li>
            <li className="hover:text-indigo-600 transition cursor-pointer">
              Progress Tracking
            </li>
            <li className="hover:text-indigo-600 transition cursor-pointer">
              AI Feedback
            </li>
            <li className="hover:text-indigo-600 transition cursor-pointer">
              Personalized Roadmaps
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div className="text-center sm:text-left">
          <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-700 mb-4 sm:mb-5">
            Support
          </h4>

          <ul className="space-y-2 sm:space-y-3 text-slate-600">
            <li className="hover:text-indigo-600 transition cursor-pointer">
              Help Center
            </li>
            <li className="hover:text-indigo-600 transition cursor-pointer">
              FAQs
            </li>
            <li className="hover:text-indigo-600 transition cursor-pointer">
              Privacy Policy
            </li>
            <li className="hover:text-indigo-600 transition cursor-pointer">
              Terms & Conditions
            </li>
          </ul>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-5 
                        flex flex-col sm:flex-row 
                        items-center justify-between 
                        gap-2 sm:gap-0 
                        text-xs sm:text-sm text-slate-500 text-center sm:text-left">

          <span>
            © {new Date().getFullYear()} AI Learning Path
          </span>

          <span>
            Student Dashboard
          </span>

        </div>
      </div>

    </footer>
  );
}