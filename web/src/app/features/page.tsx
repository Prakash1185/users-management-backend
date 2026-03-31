import Link from "next/link";

const features = [
  {
    title: "Authentication System",
    icon: "🔐",
    description: "Complete JWT-based authentication with access and refresh tokens",
    details: [
      "15-minute access tokens, 7-day refresh tokens",
      "Secure password hashing with bcrypt (12 rounds)",
      "Account lockout after 5 failed login attempts",
      "Email verification with expiring tokens",
      "Password reset flow with secure tokens",
      "Password history to prevent reuse",
    ],
  },
  {
    title: "Two-Factor Authentication",
    icon: "📱",
    description: "TOTP-based 2FA compatible with Google Authenticator",
    details: [
      "QR code generation for easy setup",
      "Time-based one-time passwords (TOTP)",
      "10 backup codes for account recovery",
      "Grace period for clock drift",
      "Enable/disable without losing settings",
    ],
  },
  {
    title: "Role-Based Access Control",
    icon: "👥",
    description: "Flexible permission system with 14 granular permissions",
    details: [
      "3 default roles: Admin, Moderator, User",
      "Custom role creation",
      "Multiple roles per user",
      "Permission-based middleware",
      "Protected system roles",
    ],
  },
  {
    title: "Session Management",
    icon: "💻",
    description: "Full visibility and control over active sessions",
    details: [
      "Track all active sessions per user",
      "Device and IP information",
      "Revoke individual sessions",
      "Logout from all devices",
      "Session activity timestamps",
    ],
  },
  {
    title: "Admin Dashboard",
    icon: "⚙️",
    description: "Comprehensive admin tools for user management",
    details: [
      "User search with filters",
      "Force password reset",
      "Manual email verification",
      "Account suspension/reactivation",
      "User impersonation",
      "Bulk role assignment",
    ],
  },
  {
    title: "Audit & Analytics",
    icon: "📊",
    description: "Track all user actions and system events",
    details: [
      "Complete audit trail",
      "User activity logs",
      "Login analytics",
      "Filterable log queries",
      "Automatic log retention",
    ],
  },
  {
    title: "Account Management",
    icon: "🛡️",
    description: "GDPR-compliant account controls",
    details: [
      "Profile management",
      "User preferences storage",
      "Account deactivation",
      "Soft delete with 30-day recovery",
      "Permanent deletion option",
      "Full data export",
    ],
  },
  {
    title: "Security Features",
    icon: "🔒",
    description: "Enterprise-grade security measures",
    details: [
      "Rate limiting (100 req/min default)",
      "Helmet security headers",
      "CORS configuration",
      "Input validation with Zod",
      "SQL injection prevention (Prisma)",
      "XSS protection",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
      <div className="container mx-auto px-6">
        <Link href="/" className="text-blue-400 hover:text-blue-300 mb-8 inline-block">← Back to Home</Link>
        <h1 className="text-4xl font-bold text-white mb-4">Features</h1>
        <p className="text-gray-400 mb-12 max-w-2xl">
          A comprehensive look at all the features included in this production-grade user management backend.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-blue-500/30 transition">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{feature.icon}</span>
                <h2 className="text-xl font-semibold text-white">{feature.title}</h2>
              </div>
              <p className="text-gray-400 mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.details.map((detail, i) => (
                  <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gray-800/50 border border-gray-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Architecture Overview</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-blue-400 font-semibold mb-2">Controllers</div>
              <div className="text-gray-400 text-sm">Request handling & validation</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-green-400 font-semibold mb-2">Services</div>
              <div className="text-gray-400 text-sm">Business logic & rules</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-purple-400 font-semibold mb-2">Repositories</div>
              <div className="text-gray-400 text-sm">Data access & queries</div>
            </div>
          </div>
          <p className="text-gray-400 text-center mt-6">
            Clean Architecture pattern with clear separation of concerns
          </p>
        </div>
      </div>
    </div>
  );
}
