import Link from "next/link";

const endpoints = [
  {
    category: "Authentication",
    prefix: "/api/v1/auth",
    routes: [
      { method: "POST", path: "/register", desc: "Register new user" },
      { method: "POST", path: "/login", desc: "Login and get tokens" },
      { method: "POST", path: "/logout", desc: "Logout user", auth: true },
      { method: "POST", path: "/refresh", desc: "Refresh access token" },
      { method: "POST", path: "/verify-email", desc: "Verify email with token" },
      { method: "POST", path: "/forgot-password", desc: "Request password reset" },
      { method: "POST", path: "/reset-password", desc: "Reset password" },
      { method: "POST", path: "/change-password", desc: "Change password", auth: true },
    ],
  },
  {
    category: "User Profile",
    prefix: "/api/v1/users",
    routes: [
      { method: "GET", path: "/me", desc: "Get current user", auth: true },
      { method: "PATCH", path: "/me", desc: "Update profile", auth: true },
      { method: "GET", path: "/me/preferences", desc: "Get preferences", auth: true },
      { method: "PATCH", path: "/me/preferences", desc: "Update preferences", auth: true },
      { method: "GET", path: "/:username/public", desc: "Get public profile" },
    ],
  },
  {
    category: "Two-Factor Auth",
    prefix: "/api/v1/2fa",
    routes: [
      { method: "POST", path: "/setup", desc: "Setup 2FA (get QR)", auth: true },
      { method: "POST", path: "/enable", desc: "Enable 2FA", auth: true },
      { method: "POST", path: "/disable", desc: "Disable 2FA", auth: true },
      { method: "POST", path: "/verify", desc: "Verify 2FA code", auth: true },
      { method: "GET", path: "/status", desc: "Get 2FA status", auth: true },
    ],
  },
  {
    category: "Sessions",
    prefix: "/api/v1/sessions",
    routes: [
      { method: "GET", path: "/", desc: "List active sessions", auth: true },
      { method: "DELETE", path: "/:id", desc: "Revoke session", auth: true },
      { method: "DELETE", path: "/", desc: "Revoke all sessions", auth: true },
    ],
  },
  {
    category: "Admin",
    prefix: "/api/v1/admin",
    routes: [
      { method: "GET", path: "/dashboard", desc: "Dashboard stats", auth: true, admin: true },
      { method: "GET", path: "/users", desc: "Search users", auth: true, admin: true },
      { method: "GET", path: "/users/:id", desc: "User details", auth: true, admin: true },
      { method: "POST", path: "/users/:id/suspend", desc: "Suspend user", auth: true, admin: true },
      { method: "POST", path: "/users/:id/impersonate", desc: "Impersonate user", auth: true, admin: true },
    ],
  },
  {
    category: "Roles & Permissions",
    prefix: "/api/v1/roles",
    routes: [
      { method: "GET", path: "/", desc: "List all roles", auth: true, admin: true },
      { method: "POST", path: "/", desc: "Create role", auth: true, admin: true },
      { method: "PATCH", path: "/:id", desc: "Update role", auth: true, admin: true },
      { method: "DELETE", path: "/:id", desc: "Delete role", auth: true, admin: true },
      { method: "GET", path: "/permissions", desc: "List permissions", auth: true, admin: true },
    ],
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-green-600",
  POST: "bg-blue-600",
  PATCH: "bg-yellow-600",
  DELETE: "bg-red-600",
  PUT: "bg-purple-600",
};

export default function ApiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
      <div className="container mx-auto px-6">
        <Link href="/" className="text-blue-400 hover:text-blue-300 mb-8 inline-block">← Back to Home</Link>
        <h1 className="text-4xl font-bold text-white mb-4">API Documentation</h1>
        <p className="text-gray-400 mb-8">Base URL: <code className="bg-gray-800 px-2 py-1 rounded">http://localhost:5001/api/v1</code></p>

        <div className="space-y-8">
          {endpoints.map((group) => (
            <div key={group.category} className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
              <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">{group.category}</h2>
                <code className="text-sm text-gray-400">{group.prefix}</code>
              </div>
              <div className="divide-y divide-gray-700">
                {group.routes.map((route, i) => (
                  <div key={i} className="px-6 py-4 flex items-center gap-4">
                    <span className={`${methodColors[route.method]} text-white text-xs font-bold px-2 py-1 rounded w-16 text-center`}>
                      {route.method}
                    </span>
                    <code className="text-gray-300 font-mono text-sm flex-1">{route.path}</code>
                    <span className="text-gray-400 text-sm">{route.desc}</span>
                    <div className="flex gap-2">
                      {route.auth && <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded">Auth</span>}
                      {route.admin && <span className="text-xs bg-purple-900 text-purple-300 px-2 py-1 rounded">Admin</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Response Format</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-green-400 mb-2">Success</h3>
              <pre className="bg-gray-900 p-4 rounded text-sm text-gray-300 overflow-x-auto">
{`{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}`}
              </pre>
            </div>
            <div>
              <h3 className="text-red-400 mb-2">Error</h3>
              <pre className="bg-gray-900 p-4 rounded text-sm text-gray-300 overflow-x-auto">
{`{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
