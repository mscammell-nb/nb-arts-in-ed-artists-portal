import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useIsMobile } from "@/hooks/use-mobile";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const isMobile = useIsMobile();
  const mainWidth = isMobile ? "100%" : "calc(100vw - var(--sidebar-width))";

  return (
    <div className="max-w-screen flex min-h-screen flex-col">
      <main className="grow bg-slate-50">
        <SidebarProvider>
          {!isMobile && <AppSidebar variant="inset" collapsible="icon" />}
          <div className="flex flex-1 flex-col">
            {isMobile && <AppSidebar variant="inset" collapsible="icon" />}
            <div className={`flex max-w-[${mainWidth}] grow items-start justify-start p-10 pt-14`}>
              <Outlet />
            </div>
            <footer className="flex flex-col items-center bg-primary p-5 text-sm text-white">
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
