"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, Lock, Eye, EyeOff, Check, Loader2 } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setStatusMessage("Silakan lengkapi email dan kata sandi Anda.");
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    // Simulate login demonstration
    setTimeout(() => {
      setIsLoading(false);
      setStatusMessage("Login berhasil! Mengarahkan ke dashboard...");
    }, 1200);
  };

  return (
    <div className="w-full max-w-[420px] px-6 sm:px-8 py-8 relative z-10">
      {/* Top Logo */}
      <div className="flex items-center gap-3 mb-12 sm:mb-16">
        <div className="relative w-10 h-10 flex-shrink-0">
          <Image
            src="/assets/multiweb.png"
            alt="MultiWeb Logo"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
        </div>
        <span className="text-[26px] font-black tracking-tight font-[family-name:var(--font-outfit)] select-none">
          <span className="text-blue-600">Multi</span>
          <span className="text-slate-900">Web</span>
        </span>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Username
          </label>
          <div className="relative flex items-center rounded-xl border border-slate-200 bg-white shadow-xs transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 hover:border-slate-300">
            <div className="pl-3.5 pr-2 text-slate-400 flex items-center justify-center">
              <User className="w-[18px] h-[18px]" strokeWidth={1.8} />
            </div>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan Username"
              className="w-full py-3 pr-4 text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Password
          </label>
          <div className="relative flex items-center rounded-xl border border-slate-200 bg-white shadow-xs transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 hover:border-slate-300">
            <div className="pl-3.5 pr-2 text-slate-400 flex items-center justify-center">
              <Lock className="w-[18px] h-[18px]" strokeWidth={1.8} />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full py-3 pr-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none tracking-wider"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="pr-3.5 pl-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-[18px] h-[18px]" strokeWidth={1.8} />
              ) : (
                <Eye className="w-[18px] h-[18px]" strokeWidth={1.8} />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="pt-1">
          <label
            htmlFor="remember-me"
            className="flex items-start gap-3 select-none cursor-pointer group"
          >
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="peer sr-only"
              />
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-150 ${rememberMe
                  ? "bg-blue-600 text-white shadow-xs"
                  : "border-2 border-slate-300 bg-white group-hover:border-slate-400"
                  }`}
              >
                {rememberMe && <Check className="w-3.5 h-3.5 stroke-[2.8]" />}
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-slate-900 leading-tight">
                Remember me
              </span>
              <span className="text-xs text-slate-400 mt-0.5">
                Save my login details for next time.
              </span>
            </div>
          </label>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`text-xs p-3 rounded-lg ${statusMessage.includes("berhasil")
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
          >
            {statusMessage}
          </div>
        )}

        {/* Sign In Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-xl shadow-xs transition-all duration-200 flex items-center justify-center text-sm cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed hover:shadow-md"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Sign in"
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative bg-white px-4">
            <span className="text-xs text-slate-400">or</span>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center text-xs text-slate-500 pt-1">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            className="font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}
