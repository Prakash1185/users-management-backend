"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";
import {
  Key,
  Shield,
  Smartphone,
  Users,
  Activity,
  Bell,
  FileText,
  Heart,
} from "lucide-react";

const features = [
  {
    title: "JWT Authentication",
    desc: "Access/refresh tokens with 15-min expiry",
    icon: Key,
  },
  {
    title: "Two-Factor Auth",
    desc: "TOTP with QR codes & backup codes",
    icon: Smartphone,
  },
  { title: "Role-Based Access", desc: "14 granular permissions", icon: Shield },
  {
    title: "Session Management",
    desc: "Track & revoke across devices",
    icon: Activity,
  },
  { title: "Admin Dashboard", desc: "User search, impersonation", icon: Users },
  {
    title: "Audit Logging",
    desc: "Complete activity tracking",
    icon: FileText,
  },
  { title: "Notifications", desc: "In-app notification system", icon: Bell },
  { title: "Health Checks", desc: "K8s ready endpoints", icon: Heart },
];

const techStack = [
  "Fastify",
  "TypeScript",
  "Prisma",
  "PostgreSQL",
  "JWT",
  "Zod",
  "bcrypt",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="User Management API" />

      <div className="mx-auto max-w-7xl px-6 py-12 mt-10">
        <div className="space-y-2">
          <Badge className="rounded-sm bg-white text-black hover:bg-neutral-200">
            Production Ready
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            User Management API
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A production-grade REST API for comprehensive user management with
            authentication, RBAC, 2FA, and enterprise security features.
          </p>
        </div>

        <Separator className="my-8 bg-border" />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Quick Start</h2>
          <Card className="rounded-sm border-border bg-card">
            <CardContent className="p-4">
              <pre className="font-mono text-sm text-muted-foreground overflow-x-auto">
                <code>{`# Clone and setup
cd backend && npm install

# Configure environment
cp .env.example .env

# Run migrations and start
npm run db:migrate && npm run dev`}</code>
              </pre>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground">
            Base URL:{" "}
            <code className="font-mono bg-border px-2 py-0.5 rounded-sm text-foreground">
              http://localhost:5001/api/v1
            </code>
          </p>
        </section>

        <Separator className="my-8 bg-border" />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((f) => (
              <Card
                key={f.title}
                className="rounded-sm border-border bg-card hover:border-border transition-colors"
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-border">
                      <f.icon className="h-4 w-4 text-foreground" />
                    </div>
                    <CardTitle className="text-sm font-medium text-foreground">
                      {f.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-4   pt-0">
                  <CardDescription className="text-muted-foreground text-sm">
                    {f.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-8 bg-border" />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="rounded-sm border-border text-muted-foreground"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </section>

        <Separator className="my-8 bg-border" />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            API Endpoints
          </h2>
          <div className="space-y-2 text-sm">
            {[
              { path: "/api/v1/auth/*", desc: "Authentication" },
              { path: "/api/v1/users/*", desc: "User Profile" },
              { path: "/api/v1/2fa/*", desc: "Two-Factor Auth" },
              { path: "/api/v1/sessions/*", desc: "Sessions" },
              { path: "/api/v1/admin/*", desc: "Admin Panel" },
              { path: "/api/v1/roles/*", desc: "RBAC" },
              { path: "/api/v1/audit/*", desc: "Audit Logs" },
            ].map((e) => (
              <div
                key={e.path}
                className="flex items-center gap-4 p-3 rounded-sm bg-card border border-border"
              >
                <code className="font-mono text-foreground flex-1">
                  {e.path}
                </code>
                <span className="text-muted-foreground">{e.desc}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
