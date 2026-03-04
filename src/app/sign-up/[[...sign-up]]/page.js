"use client";

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="relative min-h-screen bg-[url('/auth-bg.jpg')] bg-cover bg-center">

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/95" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-10 py-5 text-white">
        <h1 className="text-xl font-semibold tracking-wide">
          AI Path Generator
        </h1>
        <span className="text-sm text-slate-400">
          Start your learning journey
        </span>
      </nav>

      {/* Main Section */}
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl grid-cols-1 items-center gap-14 px-8 md:grid-cols-2">

        {/* LEFT CONTENT */}
        <div className="text-white">
          <h2 className="text-5xl font-bold leading-tight">
            Build your <br />
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Personalized Learning Path
            </span>
          </h2>

          <p className="mt-6 max-w-xl text-slate-300 text-lg">
            Create your account to receive AI-generated learning roadmaps
            tailored to your skills, goals, and progress.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: "Skill Mapping",
                desc: "Understand where you stand",
              },
              {
                title: "Guided Learning",
                desc: "Clear step-by-step roadmap",
              },
              {
                title: "Track Growth",
                desc: "Monitor progress over time",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
              >
                <h4 className="text-lg font-semibold">
                  {item.title}
                </h4>
                <p className="mt-1 text-sm text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-sm text-slate-400">
            Designed for students, freshers, and self-learners
          </p>
        </div>

        {/* RIGHT SIGNUP CARD */}
        <div className="flex justify-center">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">

            <div className="mb-6 text-center text-white">
              <h3 className="text-2xl font-semibold">
                Create your account
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Begin your personalized learning experience
              </p>
            </div>

            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"

              /* 🔑 IMPORTANT REDIRECT */
              afterSignUpUrl="/select-role"
              afterSignInUrl="/select-role"

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