import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { TICKET_VENDOR } from "@/constants/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useQueryForDataQuery } from "@/redux/api/quickbaseApi";
import { handleSignout } from "@/utils/utils";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import {
  Award,
  Calendar,
  ChevronRight,
  CreditCard,
  FileText,
  FolderOpen,
  GalleryVerticalEnd,
  LogOut,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Spinner from "./ui/Spinner";

const data = {
  versions: ["Need Help?", "Sign Out"],
  navMain: [
    {
      title: "Artist Information",
      url: "/artist-information",
      icon: <User className="w-4" />,
      isActive: true,
    },
    {
      title: "Artist Registrations",
      url: "/artist-registrations",
      icon: <FileText className="w-4" />,
      isActive: false,
    },
    {
      title: "Artist Invoices",
      url: "/artist-invoices",
      icon: <CreditCard className="w-4" />,
      isActive: false,
    },
    {
      title: "Artist Documents",
      url: "/artist-documents",
      icon: <FolderOpen className="w-4" />,
      isActive: false,
    },
    {
      title: "Artist Evaluations",
      url: "/artist-evaluations",
      icon: <Award className="w-4" />,
      isActive: false,
    },
    {
      title: "Performers",
      url: "/performers",
      icon: <Users className="w-4" />,
      isActive: false,
    },
    {
      title: "Programs",
      url: "/programs",
      icon: <Calendar className="w-4" />,
      isActive: false,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [active, setActive] = useState(1);
  const location = useLocation();

  const user = useSelector((state) => state.auth.user);

  const { data: artistsData, isLoading: isArtistDataLoading } =
    useQueryForDataQuery(
      user
        ? {
            from: import.meta.env.VITE_QUICKBASE_ARTISTS_TABLE_ID,
            select: [6, 46],
            where: `{10.EX.'${user.uid}'}`,
          }
        : { skip: !user, refetchOnMountOrArgChange: true },
    );

  const isTicketVendor = artistsData?.data[0][46].value === TICKET_VENDOR;

  useEffect(() => {
    setActive(location.pathname);
  }, [location]);
  if (isArtistDataLoading) {
    return (
      <div className="side-bar flex w-[--sidebar-width] items-center justify-center">
        <Spinner classname={"text-white"} />
      </div>
    );
  }

  if (useIsMobile()) {
    return (
      <Sheet>
        <SheetTrigger className="side-bar fixed -left-1 top-1/2 z-50 w-fit -translate-y-1/2 transform cursor-pointer rounded-sm p-1 text-xl">
          <ChevronRight className="ml-1 h-6 w-6" />
        </SheetTrigger>
        <SheetTitle className="hidden">Sidebar</SheetTitle>
        <SheetContent
          side="left"
          className="side-bar flex h-full max-w-[66%] flex-col gap-0 border-0"
        >
          <SheetDescription className="hidden">
            Arts in Education Sidebar
          </SheetDescription>
          <SidebarHeader className="mb-3 border-b border-blue-800 pb-3">
            <div className="flex items-start gap-4 ">
              <div className="flex aspect-square size-8 max-h-[250px] items-center justify-center rounded-lg bg-white text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
                <img
                  style={{ padding: "4px" }}
                  src="https://nassauboces.quickbase.com/up/butswtb25/a/r74/e8/v0"
                />
              </div>
              <div className="flex flex-col gap-0.5 overflow-clip leading-none">
                <span className="font-semibold">Arts in Education</span>
                <span className=" text-xs font-normal leading-tight text-blue-200">
                  {artistsData
                    ? artistsData.data[0][6].value
                    : "Artists Portal"}
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarMenu className="flex-1 gap-0">
            {data.navMain.map((item) => {
              if (
                isTicketVendor &&
                TICKET_VENDOR_EXCEPTION_SIDEBAR.includes(item.title)
              )
                return null;
              return (
                <SidebarMenuItem key={item.title}>
                  <Link
                    to={item.url}
                    className={cn(
                      `flex w-full items-center space-x-3 px-6 py-2.5 text-left text-sm font-normal transition-all duration-200 hover:bg-blue-800 hover:bg-opacity-80`,
                      active === item.url
                        ? "border-r-2 border-white bg-blue-800"
                        : "",
                    )}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
          <SidebarFooter className="px-0">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="px-4">
                  <Link
                    to="/"
                    className={`flex w-full items-center space-x-3 px-6 py-2.5 text-left text-sm font-normal transition-all duration-200 hover:bg-blue-800 hover:bg-opacity-80`}
                  >
                    <QuestionMarkCircledIcon />
                    <span>{data.versions[0]}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="border-t border-blue-800 py-4">
                <SidebarMenuButton asChild className="px-4">
                  <div
                    onClick={() => {
                      handleSignout(dispatch, navigate);
                    }}
                    className={`flex w-full items-center space-x-3 px-6 py-2.5 text-left text-sm font-normal transition-all duration-200 hover:bg-blue-800 hover:bg-opacity-80`}
                  >
                    <LogOut />
                    <span>{data.versions[1]}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sidebar className={cn("side-bar", "p-0 pt-2")} {...props}>
      <SidebarHeader className="mb-3 border-b border-blue-800 pb-3">
        <div className="flex items-start gap-4 ">
          <div className="flex aspect-square size-8 max-h-[250px] items-center justify-center rounded-lg bg-white text-sidebar-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
            <img
              style={{ padding: "4px" }}
              src="https://nassauboces.quickbase.com/up/butswtb25/a/r74/e8/v0"
            />
          </div>
          <div className="flex flex-col gap-0.5 overflow-clip leading-none">
            <span className="font-semibold">Arts in Education</span>
            <span className=" text-xs font-normal leading-tight text-blue-200">
              {artistsData ? artistsData.data[0][6].value : "Artists Portal"}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="gap-0">
          {data.navMain.map((item) => {
            if (
              isTicketVendor &&
              TICKET_VENDOR_EXCEPTION_SIDEBAR.includes(item.title)
            )
              return null;
            return (
              <SidebarMenuItem key={item.title}>
                <Link
                  to={item.url}
                  className={cn(
                    `flex w-full items-center space-x-3 px-6 py-2.5 text-left text-sm font-normal transition-all duration-200 hover:bg-blue-800 hover:bg-opacity-80`,
                    active === item.url
                      ? "border-r-2 border-white bg-blue-800"
                      : "",
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="px-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="px-4">
              <Link
                to="/"
                className={`flex w-full items-center space-x-3 px-6 py-2.5 text-left text-sm font-normal transition-all duration-200 hover:underline`}
              >
                <QuestionMarkCircledIcon />
                <span>{data.versions[0]}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="border-t border-blue-800 py-4">
            <SidebarMenuButton asChild className="px-4">
              <div
                onClick={() => {
                  handleSignout(dispatch, navigate);
                }}
                className={`flex w-full cursor-pointer items-center space-x-3 px-6 py-2.5 text-left text-sm font-normal transition-all duration-200 hover:underline`}
              >
                <LogOut />
                <span>{data.versions[1]}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
