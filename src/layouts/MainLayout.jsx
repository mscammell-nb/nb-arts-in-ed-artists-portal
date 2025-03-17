import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="grow bg-slate-50">
        <SidebarProvider>
          <AppSidebar variant="inset" collapsible="icon"  />
          <div className="flex flex-1 flex-col">

            <div className="flex min-w-2/3 p-10 pt-14 md:min-w-[920px] grow justify-start items-start">
              <Outlet />
            </div>
            <footer
              className="flex flex-col items-center bg-primary p-5 text-sm text-white"
            >
              <p>
                &copy; {new Date().getUTCFullYear()} Nassau BOCES. All Rights
                Reserved.
              </p>
              <div className="space-x-2">
                <a
                  className="underline"
                  href="https://nbws.nasboces.org/artsined/main/company/terms.asp"
                  target="_blank"
                >
                  Terms & Conditions
                </a>
                <a
                  className="underline"
                  href="https://nbws.nasboces.org/artsined/main/company/privacy.asp"
                  target="_blank"
                >
                  Privacy Policy
                </a>
              </div>
            </footer>
          </div>
        </SidebarProvider>
      </main>

      <Toaster />
    </div>
  );
};

export default MainLayout;
