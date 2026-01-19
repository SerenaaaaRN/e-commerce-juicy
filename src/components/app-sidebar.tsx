"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Store,
  PieChart,
  Map as MapIcon,
  Frame,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/atoms/sidebar";

// DATA MENU ADMIN KITA
const data = {
  user: {
    name: "Admin",
    email: "admin@juicy.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Juicy Store",
      logo: Store,
      plan: "Pro Plan",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
      ],
    },
    {
      title: "E-Commerce",
      url: "#",
      icon: Package,
      items: [
        {
          title: "Products",
          url: "/dashboard/products",
        },
        {
          title: "Orders",
          url: "/dashboard/orders",
        },
        {
          title: "Customers",
          url: "/dashboard/customers",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "/dashboard/settings",
        },
        {
          title: "Team",
          url: "/dashboard/settings/team",
        },
      ],
    },
  ],
  // Bisa dipakai untuk Quick Links / External Tools
  projects: [
    {
      name: "Payment Gateway",
      url: "#",
      icon: Frame,
    },
    {
      name: "Shipping Partner",
      url: "#",
      icon: MapIcon,
    },
    {
      name: "Marketing Ads",
      url: "#",
      icon: PieChart,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
