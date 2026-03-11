import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { Box, Lock, Mail } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("supervisor@ars.demo.com");
  const [password, setPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock successful login
    const token = "mock-jwt-token-12345";
    const user = { name: "Sarah Connor", role: "Supply Chain Supervisor" };

    login(token, user);
    navigate("/dashboard");
  };

  return (
    <div className="app-shell flex min-h-screen flex-col justify-center px-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[12%] top-[10%] h-56 w-56 rounded-full bg-primary-300/20 blur-3xl" />
        <div className="absolute right-[10%] top-[24%] h-48 w-48 rounded-full bg-navy-400/15 blur-3xl" />
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div
          className="mx-auto flex h-16 w-16 -rotate-6 items-center justify-center rounded-2xl shadow-lg"
          style={{ background: "linear-gradient(135deg, #5a6ef0, #7c96f6)" }}
        >
          <Box className="h-10 w-10 text-white transform rotate-6" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Auto Replenishment System
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sign in to access your supervisor dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="app-surface rounded-[28px] border border-white/60 px-4 py-8 shadow-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="app-input-surface block w-full rounded-xl py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/60"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="app-input-surface block w-full rounded-xl py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/60"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-slate-900 cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="app-button-primary flex w-full justify-center rounded-xl border border-transparent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="app-surface-muted rounded-full px-3 py-1 text-slate-500">
                  Demo Credentials
                </span>
              </div>
            </div>
            <div className="app-surface-muted mt-4 rounded-2xl p-3 text-center text-xs text-slate-500">
              <p>Email: supervisor@ars.demo.com</p>
              <p>Password: password</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
