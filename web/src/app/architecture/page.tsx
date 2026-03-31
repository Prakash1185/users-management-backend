"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Architecture" />

      <div className="mx-auto mt-10  max-w-7xl  px-6 py-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Architecture</h1>
          <p className="text-muted-foreground">
            Clean architecture with clear separation of concerns.
          </p>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Layer Structure</h2>
          <div className="grid gap-3">
            <Card className="rounded-sm border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-sm bg-blue-500/10 flex items-center justify-center">
                    <span className="text-blue-400 text-sm font-mono">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Routes</p>
                    <p className="text-sm text-muted-foreground">Define endpoints and attach middleware</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-sm border-border bg-card">
              <CardContent className="">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-sm bg-emerald-500/10 flex items-center justify-center">
                    <span className="text-emerald-400 text-sm font-mono">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Controllers</p>
                    <p className="text-sm text-muted-foreground">Handle HTTP requests, validate input, send responses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-sm border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-sm bg-amber-500/10 flex items-center justify-center">
                    <span className="text-amber-400 text-sm font-mono">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Services</p>
                    <p className="text-sm text-muted-foreground">Business logic and domain rules</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-sm border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-sm bg-purple-500/10 flex items-center justify-center">
                    <span className="text-purple-400 text-sm font-mono">4</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Repositories</p>
                    <p className="text-sm text-muted-foreground">Data access layer with Prisma</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Folder Structure</h2>
          <Card className="rounded-sm border-border bg-card">
            <CardContent className="p-4">
              <pre className="font-mono text-xs text-muted-foreground overflow-x-auto">
{`backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic
│   ├── repositories/   # Data access
│   ├── middlewares/    # Auth, RBAC, validation
│   ├── routes/         # API routes
│   ├── utils/          # Helpers & utilities
│   └── validators/     # Zod schemas
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.ts         # Seed data
└── tests/              # Test suites`}
              </pre>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Tech Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { name: "Fastify", type: "Framework" },
              { name: "TypeScript", type: "Language" },
              { name: "Prisma", type: "ORM" },
              { name: "PostgreSQL", type: "Database" },
              { name: "JWT", type: "Auth" },
              { name: "bcrypt", type: "Hashing" },
              { name: "Zod", type: "Validation" },
              { name: "Pino", type: "Logging" },
            ].map((tech) => (
              <div key={tech.name} className="p-3 rounded-sm bg-card border border-border text-center">
                <p className="text-foreground font-medium text-sm">{tech.name}</p>
                <p className="text-muted-foreground text-xs">{tech.type}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Database Schema</h2>
          <div className="flex flex-wrap gap-2">
            {["users", "user_profiles", "refresh_tokens", "email_verifications", "password_resets", "password_histories", "roles", "user_roles", "two_factor_auth", "sessions", "audit_logs", "notifications"].map((table) => (
              <Badge key={table} variant="outline" className="rounded-sm border-border text-muted-foreground font-mono text-xs">
                {table}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
