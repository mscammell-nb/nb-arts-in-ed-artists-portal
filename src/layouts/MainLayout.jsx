import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">

      <main className="grow bg-slate-50 p-14">
      <SidebarProvider>
        <AppSidebar />
        <Outlet />
      </SidebarProvider>
      </main>

      <footer style={{zIndex:"1000000"}} className="flex flex-col items-center bg-primary p-5 text-sm text-white">
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

      <Toaster />
    </div>
  );
};

export default MainLayout;
