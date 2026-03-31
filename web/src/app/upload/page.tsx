"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";

const endpoints = [
  { method: "POST", path: "/avatar", desc: "Upload user avatar", auth: true },
  { method: "DELETE", path: "/avatar", desc: "Remove current avatar", auth: true },
];

const methodColors: Record<string, string> = {
  POST: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  DELETE: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="File Upload" />

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">File Upload</h1>
          <p className="text-muted-foreground">
            Avatar upload with image processing and validation.
          </p>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Base URL</h2>
          <code className="block font-mono text-sm bg-card border border-border rounded-sm px-4 py-3 text-muted-foreground">
            /api/v1/upload
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
          <h2 className="text-lg font-semibold text-foreground">Upload Specs</h2>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between p-3 rounded-sm bg-card border border-border">
              <span className="text-muted-foreground">Max file size</span>
              <span className="text-foreground font-mono">5MB</span>
            </div>
            <div className="flex justify-between p-3 rounded-sm bg-card border border-border">
              <span className="text-muted-foreground">Accepted formats</span>
              <span className="text-foreground font-mono">JPEG, PNG, WebP</span>
            </div>
            <div className="flex justify-between p-3 rounded-sm bg-card border border-border">
              <span className="text-muted-foreground">Content-Type</span>
              <span className="text-foreground font-mono">multipart/form-data</span>
            </div>
            <div className="flex justify-between p-3 rounded-sm bg-card border border-border">
              <span className="text-muted-foreground">Field name</span>
              <span className="text-foreground font-mono">avatar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
