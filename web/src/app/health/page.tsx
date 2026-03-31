"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";

const endpoints = [
  { method: "GET", path: "/health", desc: "Basic health check" },
  { method: "GET", path: "/health/detailed", desc: "Detailed health with dependencies" },
  { method: "GET", path: "/ready", desc: "Readiness probe (K8s)" },
  { method: "GET", path: "/live", desc: "Liveness probe (K8s)" },
];

export default function HealthPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Health Checks" />

      <div className="mx-auto mt-10  max-w-7xl  px-6 py-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Health Checks</h1>
          <p className="text-muted-foreground">
            Kubernetes-ready health, readiness, and liveness probes.
          </p>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          {endpoints.map((ep, i) => (
            <Card key={i} className="rounded-sm border-border bg-card">
              <CardHeader className="">
                <div className="flex items-center gap-3">
                  <Badge className="rounded-sm font-mono text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    {ep.method}
                  </Badge>
                  <code className="font-mono text-sm text-foreground">{ep.path}</code>
                  <Badge variant="outline" className="rounded-sm border-emerald-700 text-emerald-400 text-xs">
                    Public
                  </Badge>
                </div>
                <CardTitle className="text-sm font-normal text-muted-foreground mt-2">
                  {ep.desc}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Response Examples</h2>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Basic Health</p>
            <Card className="rounded-sm border-border bg-card">
              <CardContent className="p-4">
                <pre className="font-mono text-xs text-muted-foreground">
{`{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z"
}`}
                </pre>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Detailed Health</p>
            <Card className="rounded-sm border-border bg-card">
              <CardContent className="p-4">
                <pre className="font-mono text-xs text-muted-foreground">
{`{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 86400,
  "checks": {
    "database": { "status": "healthy", "latency": 5 },
    "memory": { "status": "healthy", "latency": 128 }
  }
}`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
