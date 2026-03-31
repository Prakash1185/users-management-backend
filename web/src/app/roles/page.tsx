"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";

const endpoints = [
  { method: "GET", path: "/", desc: "List all roles", permission: "ROLE_READ" },
  { method: "GET", path: "/:id", desc: "Get role by ID", permission: "ROLE_READ" },
  { method: "POST", path: "/", desc: "Create new role", permission: "ROLE_CREATE" },
  { method: "PATCH", path: "/:id", desc: "Update role", permission: "ROLE_UPDATE" },
  { method: "DELETE", path: "/:id", desc: "Delete role", permission: "ROLE_DELETE" },
  { method: "GET", path: "/permissions", desc: "List all permissions", permission: "ROLE_READ" },
  { method: "POST", path: "/:roleId/users/:userId", desc: "Assign role to user", permission: "ROLE_ASSIGN" },
  { method: "DELETE", path: "/:roleId/users/:userId", desc: "Remove role from user", permission: "ROLE_ASSIGN" },
];

const permissions = [
  { name: "USER_READ", desc: "View users" },
  { name: "USER_CREATE", desc: "Create users" },
  { name: "USER_UPDATE", desc: "Update users" },
  { name: "USER_DELETE", desc: "Delete users" },
  { name: "USER_MANAGE", desc: "Full user management" },
  { name: "ROLE_READ", desc: "View roles" },
  { name: "ROLE_CREATE", desc: "Create roles" },
  { name: "ROLE_UPDATE", desc: "Update roles" },
  { name: "ROLE_DELETE", desc: "Delete roles" },
  { name: "ROLE_ASSIGN", desc: "Assign/remove roles" },
  { name: "ADMIN_ACCESS", desc: "Admin panel access" },
  { name: "ADMIN_SETTINGS", desc: "Modify settings" },
  { name: "AUDIT_READ", desc: "View audit logs" },
  { name: "SYSTEM_MANAGE", desc: "System management" },
];

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  POST: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  PATCH: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  DELETE: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function RolesPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Roles & RBAC" />

      <div className="mx-auto mt-10  max-w-7xl  px-6 py-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Roles & Permissions</h1>
          <p className="text-muted-foreground">
            Role-Based Access Control with 14 granular permissions and custom roles.
          </p>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Base URL</h2>
          <code className="block font-mono text-sm bg-card border border-border rounded-sm px-4 py-3 text-muted-foreground">
            /api/v1/roles
          </code>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Endpoints</h2>
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
          <h2 className="text-lg font-semibold text-foreground">Available Permissions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {permissions.map((p) => (
              <div key={p.name} className="flex items-center justify-between p-3 rounded-sm bg-card border border-border">
                <code className="font-mono text-xs text-foreground">{p.name}</code>
                <span className="text-xs text-muted-foreground">{p.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Default Roles</h2>
          <div className="grid gap-2">
            <div className="flex items-center gap-3 p-3 rounded-sm bg-card border border-border">
              <Badge className="rounded-sm bg-foreground text-background">admin</Badge>
              <span className="text-sm text-muted-foreground">All permissions (system role)</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-sm bg-card border border-border">
              <Badge variant="outline" className="rounded-sm border-border text-muted-foreground">moderator</Badge>
              <span className="text-sm text-muted-foreground">USER_READ, USER_UPDATE, AUDIT_READ</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-sm bg-card border border-border">
              <Badge variant="outline" className="rounded-sm border-border text-muted-foreground">user</Badge>
              <span className="text-sm text-muted-foreground">Basic access (default role)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
