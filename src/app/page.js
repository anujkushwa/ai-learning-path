import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserButton,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <SignedIn>
       {/* NAVBAR */}
<nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/70 border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

    {/* LOGO */}
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
        AI
      </div>
      <h1 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
         Learning Path
      </h1>
    </div>

    {/* NAV LINKS */}
    <div className="flex items-center gap-8">

      <a
        href="/select-role"
        className="relative text-gray-700 font-medium hover:text-indigo-600 transition
        after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0
        after:bg-indigo-600 hover:after:w-full after:transition-all"
      >
        Dashboard
      </a>

      {/* CLERK PROFILE */}
      <div className="ml-2">
        <UserButton afterSignOutUrl="/" />
      </div>

    </div>
  </div>
</nav>

{/* MAIN CONTENT */}
<div className="relative pt-28 min-h-screen flex items-center justify-center px-4 overflow-hidden">

  {/* BACKGROUND DECORATION */}
  <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-purple-300 rounded-full blur-[120px] opacity-40"></div>
  <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] bg-indigo-300 rounded-full blur-[120px] opacity-40"></div>

  <div className="relative max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">

    {/* LEFT CONTENT */}
    <div>

     <h1
  className="relative text-5xl font-extrabold leading-tight mb-6
  bg-gradient-to-r from-black to-gray-800
  bg-clip-text text-transparent"
>
  AI-Based Learning Path Generator
</h1>


      <p className="text-gray-600 text-lg mb-8">
        Personalized learning made simple. Analyze performance,
        identify weak topics, and follow a structured weekly roadmap.
      </p>

      {/* BENEFITS */}
      <div className="grid sm:grid-cols-2 gap-5 mb-10">

        <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-white shadow-lg hover:shadow-xl transition">
          <h3 className="font-semibold text-lg mb-1">
            🎯 Personalized Learning
          </h3>
          <p className="text-sm text-gray-600">
            Each student gets a custom learning path based on test performance.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-white shadow-lg hover:shadow-xl transition">
          <h3 className="font-semibold text-lg mb-1">
            📊 Performance Analytics
          </h3>
          <p className="text-sm text-gray-600">
            Teachers can track topic-wise progress using graphs and insights.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-white shadow-lg hover:shadow-xl transition">
          <h3 className="font-semibold text-lg mb-1">
            🤖 AI-Driven Feedback
          </h3>
          <p className="text-sm text-gray-600">
            Smart feedback and weekly learning plans generated automatically.
          </p>
        </div>

      </div>

      {/* CTA */}
      <a
        href="/select-role"
        className="inline-flex items-center gap-2 px-10 py-4
        rounded-xl font-semibold text-white
        bg-gradient-to-r from-indigo-600 to-purple-600
        hover:scale-105 transition-transform shadow-lg shadow-indigo-300"
      >
        Continue →
      </a>

    </div>

    {/* RIGHT INFO CARD */}
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white shadow-2xl p-10">

      <h2 className="text-2xl font-bold mb-5 text-gray-800">
        Why this platform?
      </h2>

      <ul className="space-y-4 text-gray-700">
        <li>✔ Identifies weak concepts automatically</li>
        <li>✔ Saves teacher evaluation time</li>
        <li>✔ Improves student confidence</li>
        <li>✔ Data-driven learning approach</li>
      </ul>

      <div className="mt-8 p-5 bg-indigo-100/70 rounded-xl">
        <p className="text-sm text-indigo-700 font-medium">
          Designed for modern classrooms and smart education systems.
        </p>
      </div>

    </div>

  </div>
</div>

      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
