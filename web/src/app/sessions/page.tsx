"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";

const endpoints = [
  { method: "GET", path: "/", desc: "List all active sessions for current user", auth: true },
  { method: "DELETE", path: "/:sessionId", desc: "Revoke a specific session", auth: true },
  { method: "DELETE", path: "/", desc: "Revoke all sessions except current", auth: true },
];

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  DELETE: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function SessionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Sessions" />

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Session Management</h1>
          <p className="text-muted-foreground">
            Track and manage active sessions across devices. Revoke suspicious sessions instantly.
          </p>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Base URL</h2>
          <code className="block font-mono text-sm bg-card border border-border rounded-sm px-4 py-3 text-muted-foreground">
            /api/v1/sessions
          </code>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          {endpoints.map((ep, i) => (
            <Card key={i} className="rounded-sm border-border bg-card">
              <CardHeader className="">
                <div className="flex items-center gap-3">
                  <Badge className={`rounded-sm font-mono text-xs ${methodColors[ep.method]}`}>
                    {ep.method}
                  </Badge>
                  <code className="font-mono text-sm text-foreground">{ep.path}</code>
                  {ep.auth && (
                    <Badge variant="outline" className="rounded-sm border-border text-muted-foreground text-xs">
                      Auth
                    </Badge>
                  )}
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
          <h2 className="text-lg font-semibold text-foreground">Session Data</h2>
          <Card className="rounded-sm border-border bg-card">
            <CardContent className="p-4">
              <pre className="font-mono text-xs text-muted-foreground overflow-x-auto">
{`{
  "id": "session_xxx",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "lastActivity": "2024-01-15T10:30:00Z",
  "createdAt": "2024-01-14T08:00:00Z",
  "isCurrent": true
}`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
