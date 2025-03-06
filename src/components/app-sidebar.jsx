import * as React from "react"

import { VersionSwitcher } from "@/components/version-switcher"
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
  SidebarRail,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom";


const data = {
  versions: ["Email Help", "Sign Out"],
  navMain: [
    {
      title: "Account Information",
      url: "#",
      items: [
        {
          title: "Artist Information",
          url: "/artist-information",
        },
        {
          title: "Artist Registrations",
          url: "/artist-registrations",
        },
      ],
    },
    {
      title: "App Navigation",
      url: "#",
      items: [
        {
          title: "Artist Documents",
          url: "/artist-documents",
        },
        {
          title: "Artist Evaluations",
          url: "/artist-evaluations",
          //isActive: true,
        },
        {
          title: "Performers",
          url: "/performers",
        },
        {
          title: "Programs",
          url: "/programs",
        },
      ],
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    (<Sidebar className={"side-bar"} {...props}>
      <SidebarHeader >
        <VersionSwitcher  className={"side-bar"} />
        {/*<SearchForm />*/}
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link to={item.url} className="hover:bg-white hover:bg-opacity-20 transition-all">{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>)
  );
}
