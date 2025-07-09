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
import { handleSignout } from "@/utils/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function VersionSwitcher({ versions, defaultVersion }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const { data: artistsData } = useQueryForDataQuery(
    user
      ? {
          from: import.meta.env.VITE_QUICKBASE_ARTISTS_TABLE_ID,
          select: [3, 6, 29, 30],
          where: `{10.EX.'${user.uid}'}`,
        }
      : { skip: !user, refetchOnMountOrArgChange: true },
  );

  return (
    <SidebarMenu className="max-h-16 border-b border-blue-800 pb-4">
      <SidebarMenuItem className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="rounded-lg transition-all hover:bg-foreground hover:bg-opacity-20 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 max-h-[250px] items-center justify-center rounded-lg bg-foreground text-sidebar-primary-foreground">
                <img
                  className=""
                  style={{ padding: "4px" }}
                  src="https://nassauboces.quickbase.com/up/butswtb25/a/r74/e8/v0"
                />
              </div>
              <div className="flex  flex-col gap-0.5 overflow-clip leading-none">
                <span className="font-semibold">Arts in Education</span>
                <span className=" text-xs font-normal leading-tight text-blue-200">
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
                handleSignout(dispatch, navigate);
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
