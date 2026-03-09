"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SelectRole() {

  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [course, setCourse] = useState("");
  const [institution, setInstitution] = useState("");

  const [showTeacherInput, setShowTeacherInput] = useState(false);
  const [teacherCode, setTeacherCode] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  /* ---------- REGISTER ROLE ---------- */

  const registerRoleInDB = async (role) => {

    const res = await fetch("/api/user/register-role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role,
        course,
        institution
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Role registration failed");
    }
  };

  /* ---------- STUDENT FLOW ---------- */

  const handleStudent = async () => {

    if (!course || !institution) {
      setError("Please enter institution and course");
      return;
    }

    try {

      setLoading(true);
      setError("");

      await user.update({
        unsafeMetadata: {
          role: "student",
          course,
          institution
        }
      });

      await registerRoleInDB("student");

      await user.reload();

      router.replace("/student/dashboard");

    } catch (err) {

      console.error(err);
      setError("Something went wrong. Please try again.");

    } finally {

      setLoading(false);

    }
  };

  /* ---------- TEACHER FLOW ---------- */

  const handleTeacherVerify = async () => {

    const VALID_TEACHER_CODE = "TEACH123";

    if (!course || !institution) {
      setError("Please enter institution and course");
      return;
    }

    if (teacherCode !== VALID_TEACHER_CODE) {
      setError("Invalid Teacher Code");
      return;
    }

    try {

      setLoading(true);
      setError("");

      await user.update({
        unsafeMetadata: {
          role: "teacher",
          course,
          institution
        }
      });

      await registerRoleInDB("teacher");

      await user.reload();

      router.replace("/teacher/dashboard");

    } catch (err) {

      console.error(err);
      setError("Something went wrong. Please try again.");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop')",
      }}
    >

      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-indigo-900/60 to-black/80"></div>

      <div
        className="relative z-10 bg-white/15 backdrop-blur-2xl
        p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]
        max-w-md w-full text-center border border-white/20"
      >

        <h1
          className="text-4xl font-extrabold mb-3
          bg-gradient-to-r from-white to-gray-300
          bg-clip-text text-transparent drop-shadow"
        >
          Choose Your Role
        </h1>

        <p className="text-gray-200 mb-6">
          Select how you want to continue
        </p>

        {/* Institution input */}

        <input
          list="institutions"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          placeholder="Enter or select institution"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/80 text-gray-900"
        />

        <datalist id="institutions">
          <option value="GLA University" />
          <option value="IIT Delhi" />
          <option value="Delhi University" />
          <option value="BHU" />
        </datalist>

        {/* Course input instead of dropdown */}

        <input
          type="text"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          placeholder="Enter Course (Example: B.Tech, BCA, MCA)"
          className="w-full mb-6 px-4 py-3 rounded-xl bg-white/80 text-gray-900"
        />

        {!showTeacherInput ? (

          <div className="space-y-4">

            <button
              onClick={handleStudent}
              disabled={loading}
              className="w-full py-3 rounded-xl
              bg-gradient-to-r from-indigo-500 to-purple-600
              hover:scale-105 transition-transform
              text-white font-semibold shadow-lg"
            >
              {loading ? "Processing..." : "🎓 Continue as Student"}
            </button>

            <button
              onClick={() => setShowTeacherInput(true)}
              className="w-full py-3 rounded-xl
              bg-gradient-to-r from-orange-500 to-red-500
              hover:scale-105 transition-transform
              text-white font-semibold shadow-lg"
            >
              👨‍🏫 Continue as Teacher
            </button>

          </div>

        ) : (

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Enter Teacher Unique Code"
              value={teacherCode}
              onChange={(e) => setTeacherCode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl
              bg-white/80 outline-none
              focus:ring-2 focus:ring-indigo-400
              text-gray-900"
            />

            {error && (
              <p className="text-red-400 text-sm">
                {error}
              </p>
            )}

            <button
              onClick={handleTeacherVerify}
              disabled={loading}
              className="w-full py-3 rounded-xl
              bg-gradient-to-r from-emerald-500 to-green-600
              hover:scale-105 transition-transform
              text-white font-semibold shadow-lg"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            <button
              onClick={() => {
                setShowTeacherInput(false);
                setTeacherCode("");
                setError("");
              }}
              className="text-sm text-gray-300 hover:underline"
            >
              ← Back
            </button>

          </div>

        )}

      </div>
    </div>
  );
}