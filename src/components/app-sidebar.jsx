import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { VersionSwitcher } from "@/components/version-switcher";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  BookText,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Drum,
  FileText,
  MonitorCog,
  UserRoundCog,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";

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
          icon: <UserRoundCog />,
        },
        {
          title: "Artist Registrations",
          url: "/artist-registrations",
          icon: <BookText />,
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
          icon: <FileText />,
        },
        {
          title: "Artist Evaluations",
          url: "/artist-evaluations",
          icon: <ClipboardList />,

          //isActive: true,
        },
        {
          title: "Performers",
          url: "/performers",
          icon: <Drum />,
        },
        {
          title: "Programs",
          url: "/programs",
          icon: <MonitorCog />,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { open, setOpen } = useSidebar();

  if (useIsMobile()) {
    return (
      <Sheet>
        <SheetTrigger className="mt-3 w-fit cursor-pointer text-sm text-blue-500 hover:underline">
          Open Sidebar
        </SheetTrigger>
        <SheetContent side="left" className="side-bar border-r-0">
          <SidebarHeader>
            <VersionSwitcher className={"side-bar"} />
            {/*<SearchForm />*/}
          </SidebarHeader>
          {data.navMain.map((item) => (
            <SidebarGroup key={item.title}>
              <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={item.isActive}>
                        <SheetClose asChild>
                          <Link
                            to={item.url}
                            className="transition-all hover:bg-white hover:bg-opacity-20"
                          >
                            {item.icon}
                            <span>{item.title}</span>
                          </Link>
                        </SheetClose>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sidebar className={"side-bar"} {...props}>
      <SidebarHeader>
        <VersionSwitcher className={"side-bar"} />
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
                      <Link
                        to={item.url}
                        className="transition-all hover:bg-white hover:bg-opacity-20"
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem></SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Button
              variant="ghost"
              className="justify-end"
              onClick={() => setOpen(!open)}
            >
              {open ? <ChevronLeft /> : <ChevronRight />}
            </Button>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
