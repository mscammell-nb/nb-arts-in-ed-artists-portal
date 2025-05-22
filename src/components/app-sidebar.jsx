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
import {
  TICKET_VENDOR,
  TICKET_VENDOR_EXCEPTION_SIDEBAR,
} from "@/constants/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQueryForDataQuery } from "@/redux/api/quickbaseApi";
import { selectUser } from "@/redux/slices/authSlice";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  BookText,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Drum,
  FileText,
  MonitorCog,
  PiggyBank,
  UserRoundCog,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

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
        {
          title: "Artist Invoices",
          url: "/artist-invoices",
          icon: <PiggyBank />,
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

  const user = useSelector(selectUser);

  const { data: artistsData, isLoading: isArtistDataLoading } =
    useQueryForDataQuery(
      user
        ? {
            from: import.meta.env.VITE_QUICKBASE_ARTISTS_TABLE_ID,
            select: [46],
            where: `{10.EX.${user.uid}}`,
          }
        : { skip: !user, refetchOnMountOrArgChange: true },
    );

  const isTicketVendor = artistsData?.data[0][46].value === TICKET_VENDOR;

  if (useIsMobile()) {
    return (
      <Sheet>
        <SheetTrigger className="ml-5 mt-5 w-fit cursor-pointer text-xl">
          <HamburgerMenuIcon className="h-7 w-7" />
        </SheetTrigger>
        <SheetTitle className="hidden">Sidebar</SheetTitle>
        <SheetContent side="left" className="side-bar max-w-[66%] border-0">
          <SheetDescription className="hidden">
            Arts in Education Sidebar
          </SheetDescription>
          <SidebarHeader>
            <VersionSwitcher className={"side-bar"} />
            {/*<SearchForm />*/}
          </SidebarHeader>
          {data.navMain.map((item) => (
            <SidebarGroup key={item.title}>
              <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.items.map((item) => {
                    if (
                      isTicketVendor &&
                      TICKET_VENDOR_EXCEPTION_SIDEBAR.includes(item.title)
                    )
                      return <></>;
                    return (
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
                    );
                  })}
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
                {item.items.map((item) => {
                  if (
                    isTicketVendor &&
                    TICKET_VENDOR_EXCEPTION_SIDEBAR.includes(item.title)
                  )
                    return null;
                  return (
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
                  );
                })}
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
