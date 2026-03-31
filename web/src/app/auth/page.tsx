"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Endpoint {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  desc: string;
  auth?: boolean;
  body?: Record<string, string>;
  response?: string;
}

const endpoints: Endpoint[] = [
  { method: "POST", path: "/register", desc: "Register a new user account", body: { email: "string", username: "string", password: "string", firstName: "string?", lastName: "string?" }, response: `{ "user": { "id", "email", "username" }, "accessToken", "refreshToken" }` },
  { method: "POST", path: "/login", desc: "Authenticate and get tokens", body: { email: "string", password: "string" }, response: `{ "user": {...}, "accessToken", "refreshToken" }` },
  { method: "POST", path: "/logout", desc: "Invalidate current session", auth: true, response: `{ "message": "Logged out successfully" }` },
  { method: "POST", path: "/refresh", desc: "Get new access token", body: { refreshToken: "string" }, response: `{ "accessToken", "refreshToken" }` },
  { method: "POST", path: "/verify-email", desc: "Verify email address", body: { token: "string" }, response: `{ "message": "Email verified" }` },
  { method: "POST", path: "/resend-verification", desc: "Resend verification email", body: { email: "string" }, response: `{ "message": "Verification email sent" }` },
  { method: "POST", path: "/forgot-password", desc: "Request password reset", body: { email: "string" }, response: `{ "message": "Reset email sent" }` },
  { method: "POST", path: "/reset-password", desc: "Reset password with token", body: { token: "string", password: "string" }, response: `{ "message": "Password reset" }` },
  { method: "POST", path: "/change-password", desc: "Change current password", auth: true, body: { currentPassword: "string", newPassword: "string" }, response: `{ "message": "Password changed" }` },
];

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  POST: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  PATCH: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  DELETE: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Authentication" />

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Authentication</h1>
          <p className="text-muted-foreground">
            JWT-based authentication with access/refresh tokens. Access tokens expire in 15 minutes, refresh tokens in 7 days.
          </p>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Base URL</h2>
          <code className="block font-mono text-sm bg-card border border-border rounded-sm px-4 py-3 text-muted-foreground">
            /api/v1/auth
          </code>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          {endpoints.map((ep, i) => (
            <Card key={i} className="rounded-sm border-border bg-card">
              <CardHeader className="pb-0">
                <div className="flex items-center gap-3">
                  <Badge className={`rounded-sm font-mono text-xs ${methodColors[ep.method]}`}>
                    {ep.method}
                  </Badge>
                  <code className="font-mono text-sm text-foreground">{ep.path}</code>
                  {ep.auth && (
                    <Badge variant="outline" className="rounded-sm border-border text-muted-foreground text-xs">
                      Auth Required
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-sm font-normal text-muted-foreground mt-2">
                  {ep.desc}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-3">
                {ep.body && (
                  <Tabs defaultValue="body" className="w-full">
                    <TabsList className="bg-border rounded-sm h-8">
                      <TabsTrigger value="body" className="rounded-sm text-xs data-[state=active]:bg-accent">Body</TabsTrigger>
                      <TabsTrigger value="response" className="rounded-sm text-xs data-[state=active]:bg-accent">Response</TabsTrigger>
                    </TabsList>
                    <TabsContent value="body" className="mt-3">
                      <pre className="font-mono text-xs bg-background rounded-sm p-3 overflow-x-auto text-muted-foreground">
                        {JSON.stringify(ep.body, null, 2)}
                      </pre>
                    </TabsContent>
                    <TabsContent value="response" className="mt-3">
                      <pre className="font-mono text-xs bg-background rounded-sm p-3 overflow-x-auto text-muted-foreground">
                        {ep.response}
                      </pre>
                    </TabsContent>
                  </Tabs>
                )}
                {!ep.body && ep.response && (
                  <pre className="font-mono text-xs bg-background rounded-sm p-3 overflow-x-auto text-muted-foreground">
                    {ep.response}
                  </pre>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Security Features</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-foreground" />
              Account lockout after 5 failed login attempts
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-foreground" />
              Password hashed with bcrypt (12 rounds)
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-foreground" />
              Password history prevents reuse of last 5 passwords
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-foreground" />
              Email verification required for sensitive actions
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
