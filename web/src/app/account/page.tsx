"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";

const endpoints = [
  { method: "POST", path: "/deactivate", desc: "Deactivate account (can reactivate)", auth: true },
  { method: "POST", path: "/reactivate", desc: "Reactivate deactivated account", auth: true },
  { method: "DELETE", path: "/", desc: "Soft delete with 30-day recovery", auth: true },
  { method: "DELETE", path: "/permanent", desc: "Permanent deletion (irreversible)", auth: true },
  { method: "GET", path: "/export", desc: "GDPR data export", auth: true },
];

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  POST: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  DELETE: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Account" />

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Account Management</h1>
          <p className="text-muted-foreground">
            GDPR-compliant account controls including deactivation, deletion, and data export.
          </p>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Base URL</h2>
          <code className="block font-mono text-sm bg-card border border-border rounded-sm px-4 py-3 text-muted-foreground">
            /api/v1/account
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
          <h2 className="text-lg font-semibold text-foreground">Deletion Flow</h2>
          <div className="grid gap-2 text-sm">
            <div className="flex gap-3 p-3 rounded-sm bg-card border border-border">
              <Badge variant="outline" className="rounded-sm border-amber-700 text-amber-400">Soft Delete</Badge>
              <span className="text-muted-foreground">Account recoverable for 30 days, then auto-purged</span>
            </div>
            <div className="flex gap-3 p-3 rounded-sm bg-card border border-border">
              <Badge variant="outline" className="rounded-sm border-red-700 text-red-400">Permanent</Badge>
              <span className="text-muted-foreground">Immediate and irreversible deletion</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
