import {
  LayoutDashboard,
  CalendarDays,
  ListChecks,
  Video,
  Archive,
  FileEdit,
  ClipboardList,
  FolderOpen,
  BookOpen,
  ScrollText,
  ShieldCheck,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import type { Authority } from "@/components/AuthProvider";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  minAuthority: Authority;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, minAuthority: "member" },
  { href: "/calendar", label: "Calendar", icon: CalendarDays, minAuthority: "member" },
  { href: "/tasks", label: "Tasks", icon: ListChecks, minAuthority: "member" },
  { href: "/meetings", label: "Meetings", icon: Video, minAuthority: "member" },
  { href: "/registry", label: "Registry", icon: Archive, minAuthority: "member" },
  { href: "/application", label: "Applications", icon: FileEdit, minAuthority: "member" },
  { href: "/forms", label: "Forms", icon: ClipboardList, minAuthority: "member" },
  { href: "/repository", label: "Repository", icon: FolderOpen, minAuthority: "member" },
  { href: "/chat", label: "Chat", icon: MessageSquare, minAuthority: "member" },
  { href: "/docs", label: "Docs", icon: BookOpen, minAuthority: "nonmember" },
  { href: "/terms-and-conditions", label: "Terms", icon: ScrollText, minAuthority: "nonmember" },
  { href: "/admin", label: "Admin", icon: ShieldCheck, minAuthority: "admin" },
];
