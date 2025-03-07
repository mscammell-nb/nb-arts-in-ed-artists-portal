import { GalleryVerticalEnd } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useQueryForDataQuery } from "@/redux/api/quickbaseApi";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { getAuth, signOut } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function VersionSwitcher({ versions, defaultVersion }) {
  const auth = getAuth();
  const navigate = useNavigate();
  const signUserOut = () => {
    signOut(auth);
    localStorage.clear();
    navigate("/login");
  };

  const userUid = localStorage.getItem("uid");

  const {
    data: artistsData,
    isLoading: isArtistsLoading,
    isError: isPerformersError,
    error: artistsError,
  } = useQueryForDataQuery({
    from: import.meta.env.VITE_QUICKBASE_ARTISTS_TABLE_ID,
    select: [3, 6, 29, 30],
    where: `{10.EX.${userUid}}`,
  });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="rounded-lg transition-all hover:bg-white hover:bg-opacity-20 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
                <img
                  className=""
                  style={{ padding: "4px" }}
                  src="https://nassauboces.quickbase.com/up/butswtb25/a/r74/e8/v0"
                />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Arts in Education</span>
                <span className="">
                  {artistsData
                    ? artistsData.data[0][6].value
                    : "Artists Portal"}
                </span>
              </div>
              <CaretSortIcon className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width]"
            align="start"
          >
            {/* TODO: Implement email help */}
            <DropdownMenuItem className="cursor-pointer">
              Email Help
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                signUserOut();
              }}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
