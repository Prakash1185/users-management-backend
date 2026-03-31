"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Getting Started" />

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Getting Started</h1>
          <p className="text-muted-foreground">
            Set up the User Management API in minutes.
          </p>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-foreground text-background font-mono text-xs font-bold">1</span>
              <h2 className="text-lg font-semibold text-foreground">Prerequisites</h2>
            </div>
            <div className="flex flex-wrap gap-2 pl-9">
              <Badge variant="outline" className="rounded-sm border-border text-muted-foreground">Node.js 18+</Badge>
              <Badge variant="outline" className="rounded-sm border-border text-muted-foreground">PostgreSQL</Badge>
              <Badge variant="outline" className="rounded-sm border-border text-muted-foreground">npm or yarn</Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-foreground text-background font-mono text-xs font-bold">2</span>
              <h2 className="text-lg font-semibold text-foreground">Installation</h2>
            </div>
            <Card className="rounded-sm border-border bg-card ml-9">
              <CardContent className="p-4">
                <pre className="font-mono text-xs text-muted-foreground overflow-x-auto">
{`# Clone repository
git clone <repo-url>
cd users_management_backend

# Install dependencies
cd backend && npm install`}
                </pre>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-foreground text-background font-mono text-xs font-bold">3</span>
              <h2 className="text-lg font-semibold text-foreground">Configuration</h2>
            </div>
            <Card className="rounded-sm border-border bg-card ml-9">
              <CardContent className="p-4">
                <pre className="font-mono text-xs text-muted-foreground overflow-x-auto">
{`# Copy environment template
cp .env.example .env

# Edit .env with your values:
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_ACCESS_SECRET="your-secret-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret"
PORT=5001`}
                </pre>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-foreground text-background font-mono text-xs font-bold">4</span>
              <h2 className="text-lg font-semibold text-foreground">Database Setup</h2>
            </div>
            <Card className="rounded-sm border-border bg-card ml-9">
              <CardContent className="p-4">
                <pre className="font-mono text-xs text-muted-foreground overflow-x-auto">
{`# Run migrations
npm run db:migrate

# Seed default roles (admin, moderator, user)
npm run db:seed`}
                </pre>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-foreground text-background font-mono text-xs font-bold">5</span>
              <h2 className="text-lg font-semibold text-foreground">Start Server</h2>
            </div>
            <Card className="rounded-sm border-border bg-card ml-9">
              <CardContent className="p-4">
                <pre className="font-mono text-xs text-muted-foreground overflow-x-auto">
{`# Development mode with hot reload
npm run dev

# Production build
npm run build && npm start`}
                </pre>
              </CardContent>
            </Card>
            <p className="text-sm text-muted-foreground ml-9">
              Server runs at <code className="bg-border px-2 py-0.5 rounded-sm text-foreground">http://localhost:5001</code>
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-foreground text-background font-mono text-xs font-bold">6</span>
              <h2 className="text-lg font-semibold text-foreground">Test the API</h2>
            </div>
            <Card className="rounded-sm border-border bg-card ml-9">
              <CardContent className="p-4">
                <pre className="font-mono text-xs text-muted-foreground overflow-x-auto">
{`# Health check
curl http://localhost:5001/health

# Register a user
curl -X POST http://localhost:5001/api/v1/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@test.com","username":"testuser","password":"Test123!"}'`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Available Scripts</h2>
          <div className="grid gap-2 text-sm">
            {[
              { cmd: "npm run dev", desc: "Start development server" },
              { cmd: "npm run build", desc: "Build for production" },
              { cmd: "npm run start", desc: "Start production server" },
              { cmd: "npm run db:migrate", desc: "Run database migrations" },
              { cmd: "npm run db:seed", desc: "Seed default data" },
              { cmd: "npm run db:studio", desc: "Open Prisma Studio" },
              { cmd: "npm run test", desc: "Run tests" },
              { cmd: "npm run lint", desc: "Run ESLint" },
            ].map((s) => (
              <div key={s.cmd} className="flex items-center justify-between p-3 rounded-sm bg-card border border-border">
                <code className="font-mono text-foreground text-xs">{s.cmd}</code>
                <span className="text-muted-foreground text-xs">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
