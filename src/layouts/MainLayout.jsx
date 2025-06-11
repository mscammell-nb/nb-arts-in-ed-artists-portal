import { AppSidebar } from "@/components/app-sidebar";
import PageHeader from "@/components/PageHeader";
import RenewRegistrationModal from "@/components/renewRegistrationModal";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useIsMobile } from "@/hooks/use-mobile";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const isMobile = useIsMobile();
  console.log(
    "Dark mode ? ",
    window.matchMedia(`(prefers-color-scheme: dark`).matches,
  );

  return (
    <div className="max-w-screen flex min-h-screen flex-col overflow-x-hidden bg-background  text-primary">
      <RenewRegistrationModal />
      <SidebarProvider>
        {!isMobile && <AppSidebar variant="inset" collapsible="icon" />}
        <div className="flex flex-grow flex-col">
          {isMobile && <AppSidebar variant="inset" collapsible="icon" />}
          <PageHeader />
          <div
            className={`flex ${isMobile ? "max-w-[100vw]" : "max-w-[calc(100vw-var(--sidebar-width))]"}  grow items-start justify-start overflow-hidden p-10 pt-4`}
          >
            <Outlet />
          </div>
          <footer className="text-tertiary flex flex-col items-center bg-primary p-5 text-sm">
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

      <Toaster />
    </div>
  );
};

export default MainLayout;
