export default function DashboardFooter() {
  return (
    <footer className="mt-20 sm:mt-24 bg-gradient-to-br from-slate-50 via-white to-emerald-50 border-t">

      {/* TOP FOOTER */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 
                      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
                      gap-10 sm:gap-12 text-sm">

        {/* BRAND */}
        <div className="text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-extrabold 
                         bg-gradient-to-r from-emerald-600 to-teal-600 
                         bg-clip-text text-transparent mb-4">
            AI Path Generator
          </h3>

          <p className="text-slate-600 leading-relaxed max-w-sm mx-auto sm:mx-0">
            An AI-powered education platform helping students and teachers
            build structured, personalized learning journeys using smart
            performance insights.
          </p>
        </div>

        {/* EDUCATOR TOOLS */}
        <div className="text-center sm:text-left">
          <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-700 mb-4 sm:mb-5">
            Educator Tools
          </h4>

          <ul className="space-y-2 sm:space-y-3 text-slate-600">
            <li className="hover:text-emerald-600 transition cursor-pointer">
              Student performance insights
            </li>
            <li className="hover:text-emerald-600 transition cursor-pointer">
              Topic-wise analytics
            </li>
            <li className="hover:text-emerald-600 transition cursor-pointer">
              AI-generated study paths
            </li>
            <li className="hover:text-emerald-600 transition cursor-pointer">
              Smart assessments & feedback
            </li>
          </ul>
        </div>

        {/* RESOURCES */}
        <div className="text-center sm:text-left">
          <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-700 mb-4 sm:mb-5">
            Resources
          </h4>

          <ul className="space-y-2 sm:space-y-3 text-slate-600">
            <li className="hover:text-emerald-600 transition cursor-pointer">
              Help Center
            </li>
            <li className="hover:text-emerald-600 transition cursor-pointer">
              Documentation
            </li>
            <li className="hover:text-emerald-600 transition cursor-pointer">
              Privacy Policy
            </li>
            <li className="hover:text-emerald-600 transition cursor-pointer">
              Terms & Conditions
            </li>
          </ul>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-5 
                        flex flex-col sm:flex-row 
                        items-center justify-between 
                        gap-2 sm:gap-0 
                        text-xs sm:text-sm text-slate-500 text-center sm:text-left">

          <span>
            © {new Date().getFullYear()} AI Path Generator
          </span>

          <span>
            Teacher & Student Dashboard
          </span>

        </div>
      </div>

    </footer>
  );
}