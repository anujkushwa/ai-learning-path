"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="relative min-h-screen bg-[url('/auth-bg.jpg')] bg-cover bg-center">
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/95" />

      {/* Navbar */}
      <nav className="relative z-10 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-10 py-4 text-white gap-2 sm:gap-0">
        <h1 className="text-lg sm:text-xl font-semibold tracking-wide text-center sm:text-left">
          AI Path Generator
        </h1>
        <span className="text-xs sm:text-sm text-slate-400 text-center sm:text-right">
          Learn smarter. Grow faster.
        </span>
      </nav>

      {/* Main Section */}
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-14 px-4 sm:px-6 md:px-8">

        {/* LEFT SECTION */}
        <div className="text-white text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Personalized <br />
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              AI Learning Paths
            </span>
          </h2>

          <p className="mt-4 sm:mt-6 max-w-xl mx-auto md:mx-0 text-slate-300 text-base sm:text-lg">
            AI Path Generator analyzes your current knowledge and learning goals
            to create a structured, step-by-step roadmap — so you always know
            what to learn next.
          </p>

          {/* Cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                title: "Skill Analysis",
                desc: "Understand strengths & gaps",
              },
              {
                title: "Smart Roadmap",
                desc: "Clear learning sequence",
              },
              {
                title: "Focused Growth",
                desc: "Learn with direction",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-md"
              >
                <h4 className="text-base sm:text-lg font-semibold">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 sm:mt-10 text-xs sm:text-sm text-slate-400">
            Built for students, freshers, and self-learners <br />
            also for teachers and mentors.
          </p>
        </div>

        {/* RIGHT: SIGN IN */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm sm:max-w-md rounded-2xl border border-white/15 bg-white/10 p-5 sm:p-8 shadow-2xl backdrop-blur-xl">
            
            <div className="mb-4 sm:mb-6 text-center text-white">
              <h3 className="text-xl sm:text-2xl font-semibold">
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
                    "bg-white/90 hover:bg-white text-black",
                  formButtonPrimary:
                    "bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-90 text-sm",
                  footerActionText: "text-slate-400",
                  footerActionLink:
                    "text-cyan-400 hover:text-cyan-300",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}