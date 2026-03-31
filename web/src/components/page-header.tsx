"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <header className="fixed w-full top-0 z-50 flex h-14 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-md px-6">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-medium text-foreground">{title}</h1>
        {description && (
          <>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground">{description}</span>
          </>
        )}
      </div>
      <div className="flex-1" />
      {children}
    </header>
  );
}
