"use client";

import * as React from "react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/atoms/sidebar";
import { adminNavConfig } from "./admin-nav";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={adminNavConfig.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminNavConfig.navMain} />
        <NavProjects projects={adminNavConfig.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={adminNavConfig.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
