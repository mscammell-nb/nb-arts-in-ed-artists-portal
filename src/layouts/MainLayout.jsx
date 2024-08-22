import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <nav className="border border-slate-200 p-5 shadow-lg">
          <div className="max-w-36">
            <img
              src="https://nassauboces.quickbase.com/up/bpt5wxg92/a/r1/e7/v0"
              alt="Nassau BOCES logo"
            />
          </div>
        </nav>
      </header>

      <main className="grow bg-slate-50 p-14">
        <Outlet />
      </main>

      <footer className="flex flex-col items-center bg-bocesPrimary p-5 text-sm text-white">
        <p>
          &copy; 2024 Nassau BOCES. All Rights Reserved.{" "}
          <a
            className="underline"
            href="https://nbws.nasboces.org/artsined/main/company/terms.asp"
            target="_blank"
          >
            Terms & Conditions
          </a>
          .{" "}
          <a
            className="underline"
            href="https://nbws.nasboces.org/artsined/main/company/privacy.asp"
            target="_blank"
          >
            Privacy Policy
          </a>
          .
        </p>
      </footer>

      <Toaster />
    </div>
  );
};

export default MainLayout;
