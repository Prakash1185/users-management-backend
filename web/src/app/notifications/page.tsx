"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";

const endpoints = [
  { method: "GET", path: "/", desc: "List notifications with pagination", auth: true },
  { method: "PATCH", path: "/:id/read", desc: "Mark notification as read", auth: true },
  { method: "PATCH", path: "/read-all", desc: "Mark all as read", auth: true },
  { method: "DELETE", path: "/:id", desc: "Delete notification", auth: true },
  { method: "DELETE", path: "/", desc: "Delete all notifications", auth: true },
];

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  PATCH: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  DELETE: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Notifications" />

      <div className="mx-auto mt-10  max-w-7xl  px-6 py-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            In-app notification system for security alerts and account updates.
          </p>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Base URL</h2>
          <code className="block font-mono text-sm bg-card border border-border rounded-sm px-4 py-3 text-muted-foreground">
            /api/v1/notifications
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
                  <Badge variant="outline" className="rounded-sm border-border text-muted-foreground text-xs">
                    Auth
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
          <h2 className="text-lg font-semibold text-foreground">Notification Types</h2>
          <div className="flex flex-wrap gap-2">
            {["EMAIL_VERIFIED", "PASSWORD_CHANGED", "LOGIN_ALERT", "SECURITY_ALERT", "ACCOUNT_UPDATE", "ROLE_CHANGED", "SYSTEM"].map((type) => (
              <Badge key={type} variant="outline" className="rounded-sm border-border text-muted-foreground font-mono text-xs">
                {type}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
