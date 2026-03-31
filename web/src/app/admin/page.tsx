"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";

const endpoints = [
  { method: "GET", path: "/dashboard", desc: "Get admin dashboard stats", permission: "ADMIN_ACCESS" },
  { method: "GET", path: "/users", desc: "Search and list users", permission: "USER_READ" },
  { method: "GET", path: "/users/:userId", desc: "Get detailed user info", permission: "USER_READ" },
  { method: "POST", path: "/users/:userId/reset-password", desc: "Force password reset", permission: "USER_MANAGE" },
  { method: "POST", path: "/users/:userId/verify-email", desc: "Manually verify email", permission: "USER_MANAGE" },
  { method: "POST", path: "/users/:userId/unlock", desc: "Unlock locked account", permission: "USER_MANAGE" },
  { method: "POST", path: "/users/:userId/suspend", desc: "Suspend user account", permission: "USER_MANAGE" },
  { method: "POST", path: "/users/:userId/reactivate", desc: "Reactivate suspended user", permission: "USER_MANAGE" },
  { method: "POST", path: "/users/:userId/impersonate", desc: "Generate token as user", permission: "ADMIN_ACCESS" },
  { method: "POST", path: "/bulk/assign-role", desc: "Bulk assign role to users", permission: "ROLE_ASSIGN" },
];

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  POST: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Admin Panel" description="Admin Only" />

      <div className="mx-auto mt-10  max-w-7xl  px-6 py-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground">
            Administrative endpoints for user management, impersonation, and bulk operations.
          </p>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Base URL</h2>
          <code className="block font-mono text-sm bg-card border border-border rounded-sm px-4 py-3 text-muted-foreground">
            /api/v1/admin
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
          <h2 className="text-lg font-semibold text-foreground">User Search Query Params</h2>
          <Card className="rounded-sm border-border bg-card">
            <CardContent className="p-4">
              <pre className="font-mono text-xs text-muted-foreground overflow-x-auto">
{`?q=search_term      # Search by email, username, name
&role=admin         # Filter by role
&status=active      # active | inactive
&verified=true      # Email verification status
&sortBy=createdAt   # Sort field
&order=desc         # asc | desc
&page=1&limit=20    # Pagination`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
