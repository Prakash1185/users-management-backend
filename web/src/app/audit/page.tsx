"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";

const endpoints = [
  { method: "GET", path: "/", desc: "Query audit logs with filters", permission: "AUDIT_READ" },
  { method: "GET", path: "/stats", desc: "Get audit statistics", permission: "AUDIT_READ" },
  { method: "GET", path: "/analytics", desc: "Get user analytics", permission: "AUDIT_READ" },
  { method: "GET", path: "/user/:userId", desc: "Get user activity log", permission: "AUDIT_READ" },
  { method: "POST", path: "/cleanup", desc: "Delete old audit logs", permission: "SYSTEM_MANAGE" },
];

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  POST: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Audit Logs" />

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground">
            Complete audit trail for all user actions and system events.
          </p>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Base URL</h2>
          <code className="block font-mono text-sm bg-card border border-border rounded-sm px-4 py-3 text-muted-foreground">
            /api/v1/audit
          </code>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          {endpoints.map((ep, i) => (
            <Card key={i} className="rounded-sm border-border bg-card">
              <CardHeader className="">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className={`rounded-sm font-mono text-xs ${methodColors[ep.method]}`}>
                    {ep.method}
                  </Badge>
                  <code className="font-mono text-sm text-foreground">{ep.path}</code>
                  <Badge variant="outline" className="rounded-sm border-purple-700 text-purple-400 text-xs">
                    {ep.permission}
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
          <h2 className="text-lg font-semibold text-foreground">Query Parameters</h2>
          <Card className="rounded-sm border-border bg-card">
            <CardContent className="p-4">
              <pre className="font-mono text-xs text-muted-foreground overflow-x-auto">
{`?userId=xxx         # Filter by user
&action=USER_LOGIN  # Filter by action type
&resource=user      # Filter by resource
&startDate=2024-01-01
&endDate=2024-01-31
&page=1&limit=50`}
              </pre>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Tracked Actions</h2>
          <div className="flex flex-wrap gap-2">
            {["USER_LOGIN", "USER_LOGOUT", "USER_REGISTERED", "PASSWORD_CHANGED", "PASSWORD_RESET", "PROFILE_UPDATED", "TWO_FACTOR_ENABLED", "TWO_FACTOR_DISABLED", "SESSION_REVOKED", "ROLE_ASSIGNED", "ROLE_REMOVED", "ACCOUNT_DEACTIVATED", "ACCOUNT_DELETED"].map((action) => (
              <Badge key={action} variant="outline" className="rounded-sm border-border text-muted-foreground font-mono text-xs">
                {action}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
