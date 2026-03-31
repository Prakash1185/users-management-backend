"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";

const endpoints = [
  { method: "POST", path: "/setup", desc: "Generate 2FA secret and QR code", auth: true },
  { method: "POST", path: "/enable", desc: "Enable 2FA with TOTP code", auth: true, body: { token: "string (6-digit TOTP)" } },
  { method: "POST", path: "/disable", desc: "Disable 2FA", auth: true, body: { token: "string" } },
  { method: "POST", path: "/verify", desc: "Verify 2FA during login", auth: true, body: { token: "string" } },
  { method: "GET", path: "/status", desc: "Get current 2FA status", auth: true },
  { method: "POST", path: "/backup-codes/regenerate", desc: "Regenerate backup codes", auth: true, body: { token: "string" } },
];

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  POST: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function TwoFaPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Two-Factor Authentication" />

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Two-Factor Authentication</h1>
          <p className="text-muted-foreground">
            TOTP-based 2FA compatible with Google Authenticator, Authy, and other authenticator apps.
          </p>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Base URL</h2>
          <code className="block font-mono text-sm bg-card border border-border rounded-sm px-4 py-3 text-muted-foreground">
            /api/v1/2fa
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

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Setup Flow</h2>
          <div className="grid gap-3 text-sm text-muted-foreground">
            <div className="flex gap-3 p-3 rounded-sm bg-card border border-border">
              <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-foreground text-background font-mono text-xs">1</span>
              <span>Call <code className="text-foreground">/setup</code> to get QR code and secret</span>
            </div>
            <div className="flex gap-3 p-3 rounded-sm bg-card border border-border">
              <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-foreground text-background font-mono text-xs">2</span>
              <span>Scan QR code with authenticator app</span>
            </div>
            <div className="flex gap-3 p-3 rounded-sm bg-card border border-border">
              <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-foreground text-background font-mono text-xs">3</span>
              <span>Call <code className="text-foreground">/enable</code> with generated TOTP to activate</span>
            </div>
            <div className="flex gap-3 p-3 rounded-sm bg-card border border-border">
              <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-foreground text-background font-mono text-xs">4</span>
              <span>Save the 10 backup codes securely</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
