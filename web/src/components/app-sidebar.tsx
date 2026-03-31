"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Home,
  Key,
  User,
  Shield,
  Smartphone,
  Monitor,
  Users,
  FileText,
  Activity,
  Bell,
  Upload,
  Heart,
  Settings,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  {
    title: "Overview",
    items: [
      { title: "Introduction", href: "/", icon: Home },
      { title: "Getting Started", href: "/getting-started", icon: BookOpen },
    ],
  },
  {
    title: "Authentication",
    items: [
      { title: "Auth Endpoints", href: "/auth", icon: Key },
      { title: "Two-Factor Auth", href: "/2fa", icon: Smartphone },
      { title: "Sessions", href: "/sessions", icon: Monitor },
    ],
  },
  {
    title: "User Management",
    items: [
      { title: "User Profile", href: "/users", icon: User },
      { title: "Account", href: "/account", icon: Settings },
      { title: "Notifications", href: "/notifications", icon: Bell },
      { title: "File Upload", href: "/upload", icon: Upload },
    ],
  },
  {
    title: "Admin",
    items: [
      { title: "Admin Panel", href: "/admin", icon: Shield },
      { title: "Roles & RBAC", href: "/roles", icon: Users },
      { title: "Audit Logs", href: "/audit", icon: FileText },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Health Checks", href: "/health", icon: Heart },
      { title: "Architecture", href: "/architecture", icon: Activity },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-2.5">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-primary-foreground font-mono font-bold text-sm">
            UM
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">User Management</p>
            <p className="text-xs text-muted-foreground">API Documentation</p>
          </div>
        </Link>
      </SidebarHeader>
      <Separator className="bg-border" />
      <SidebarContent>
        <ScrollArea className="h-full">
          {navItems.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider px-4">
                {group.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        className="rounded-sm"
                      >
                        <Link href={item.href} className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </ScrollArea>
      </SidebarContent>
      <Separator className="bg-border" />
      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">v1.0.0 • MIT</p>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-8 w-8 rounded-sm hover:bg-accent"
                >
                  <a
                    href="https://github.com/Prakash1185/users-management-backend"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="sr-only">GitHub</span>
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="rounded-sm">
                <p>View on GitHub</p>
              </TooltipContent>
            </Tooltip>
            <ThemeToggle />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
