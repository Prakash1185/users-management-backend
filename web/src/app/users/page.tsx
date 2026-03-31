"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";

const endpoints = [
  { method: "GET", path: "/me", desc: "Get current user profile", auth: true },
  { method: "PATCH", path: "/me", desc: "Update profile information", auth: true, body: { firstName: "string?", lastName: "string?", bio: "string?", website: "string?" } },
  { method: "GET", path: "/me/preferences", desc: "Get user preferences", auth: true },
  { method: "PATCH", path: "/me/preferences", desc: "Update preferences", auth: true, body: { theme: "string?", language: "string?", notifications: "object?" } },
  { method: "GET", path: "/:username/public", desc: "Get public profile by username", auth: false },
];

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  PATCH: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="User Profile" />

      <div className="mx-auto mt-10  max-w-7xl  px-6 py-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">User Profile</h1>
          <p className="text-muted-foreground">
            Manage user profile information and preferences.
          </p>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Base URL</h2>
          <code className="block font-mono text-sm bg-card border border-border rounded-sm px-4 py-3 text-muted-foreground">
            /api/v1/users
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
                  <Badge variant="outline" className={`rounded-sm text-xs ${ep.auth ? "border-border text-muted-foreground" : "border-emerald-700 text-emerald-400"}`}>
                    {ep.auth ? "Auth" : "Public"}
                  </Badge>
                </div>
                <CardTitle className="text-sm font-normal text-muted-foreground mt-2">
                  {ep.desc}
                </CardTitle>
              </CardHeader>
              {ep.body && (
                <CardContent className="p-4 pt-0">
                  <pre className="font-mono text-xs bg-background rounded-sm p-3 text-muted-foreground">
                    {JSON.stringify(ep.body, null, 2)}
                  </pre>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
