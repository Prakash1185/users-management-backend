import Link from "next/link";

const features = [
  { title: "JWT Authentication", desc: "Secure access/refresh token system with 15-min access tokens", icon: "🔐" },
  { title: "Two-Factor Auth", desc: "TOTP-based 2FA with QR codes and backup codes", icon: "📱" },
  { title: "Role-Based Access", desc: "Granular RBAC with 14 permissions and hierarchical roles", icon: "👥" },
  { title: "Session Management", desc: "Track and revoke sessions across devices", icon: "💻" },
  { title: "Audit Logging", desc: "Comprehensive activity tracking and analytics", icon: "📊" },
  { title: "Admin Dashboard", desc: "Full user management with impersonation support", icon: "⚙️" },
  { title: "Account Security", desc: "Lockout protection, password history, email verification", icon: "🛡️" },
  { title: "GDPR Compliant", desc: "Data export, soft delete with 30-day recovery", icon: "📋" },
];

const techStack = [
  { name: "Fastify", desc: "High-performance Node.js framework" },
  { name: "TypeScript", desc: "Type-safe development" },
  { name: "Prisma", desc: "Modern database ORM" },
  { name: "PostgreSQL", desc: "Reliable relational database" },
  { name: "JWT", desc: "Stateless authentication" },
  { name: "Zod", desc: "Schema validation" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero */}
      <header className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          User Management <span className="text-blue-400">Backend</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Production-grade REST API for comprehensive user management with authentication, RBAC, 2FA, and enterprise security features.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/api" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition">
            View API Docs
          </Link>
          <Link href="/features" className="border border-gray-500 hover:border-gray-300 text-gray-300 px-8 py-3 rounded-lg font-semibold transition">
            Explore Features
          </Link>
        </div>
      </header>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Core Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition">
              <span className="text-4xl mb-4 block">{f.icon}</span>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Tech Stack</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {techStack.map((t) => (
            <div key={t.name} className="bg-gray-800 border border-gray-700 rounded-lg px-6 py-3 text-center">
              <div className="text-white font-semibold">{t.name}</div>
              <div className="text-gray-400 text-sm">{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Start */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Start</h2>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
            <div className="text-gray-500"># Clone and setup</div>
            <div>cd backend && npm install</div>
            <div className="mt-2 text-gray-500"># Configure environment</div>
            <div>cp .env.example .env</div>
            <div className="mt-2 text-gray-500"># Run migrations and start</div>
            <div>npm run db:migrate && npm run dev</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-400">
        <p>Built as a learning project • Production-grade architecture</p>
      </footer>
    </div>
  );
}
