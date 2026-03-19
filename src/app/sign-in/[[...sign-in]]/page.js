"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[url('/auth-bg.jpg')] bg-cover bg-center bg-no-repeat">
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/85 to-slate-950/95" />

      {/* Navbar */}
      <nav className="relative z-10 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 gap-2">
        <h1 className="text-base sm:text-lg md:text-xl font-semibold text-white text-center sm:text-left">
          AI Path Generator
        </h1>
        <span className="text-[11px] sm:text-xs md:text-sm text-slate-400 text-center sm:text-right">
          Learn smarter. Grow faster.
        </span>
      </nav>

      {/* Main */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* LEFT */}
        <div className="text-white text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Personalized <br />
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              AI Learning Paths
            </span>
          </h2>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-slate-300 max-w-xl mx-auto md:mx-0">
            AI Path Generator analyzes your current knowledge and learning goals
            to create a structured roadmap — so you always know what to learn next.
          </p>

          {/* Cards */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[
              { title: "Skill Analysis", desc: "Understand strengths & gaps" },
              { title: "Smart Roadmap", desc: "Clear learning sequence" },
              { title: "Focused Growth", desc: "Learn with direction" },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md hover:bg-white/10 transition"
              >
                <h4 className="text-sm sm:text-base font-semibold">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 sm:mt-8 text-[11px] sm:text-xs md:text-sm text-slate-400">
            Built for students, freshers, and self-learners <br />
            also for teachers and mentors.
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex justify-center items-center">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-md rounded-2xl border border-white/15 bg-white/10 p-4 sm:p-6 md:p-8 shadow-2xl backdrop-blur-xl">

            <div className="mb-4 sm:mb-6 text-center text-white">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">
                Welcome back
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Continue your learning journey
              </p>
            </div>

            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              afterSignInUrl="/select-role"
              afterSignUpUrl="/select-role"
              appearance={{
                elements: {
                  card: "bg-transparent shadow-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "bg-white/90 hover:bg-white text-black text-sm",
                  formButtonPrimary:
                    "bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-90 text-sm",
                  footerActionText: "text-slate-400 text-xs",
                  footerActionLink:
                    "text-cyan-400 hover:text-cyan-300 text-xs",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}