import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <nav className="border border-slate-200 p-5 shadow-lg">
          <div className="max-w-36">
            <img
              src="https://www.nassauboces.org/cms/lib/NY01928409/Centricity/Template/GlobalAssets/images///logos/NBlogo-website3.png"
              alt="Nassau BOCES logo"
            />
          </div>
        </nav>
      </header>

      <main className="grow bg-slate-50 p-5">
        <Outlet />
      </main>

      <footer className="flex flex-col items-center bg-bocesPrimary p-5 text-sm text-white">
        <p>
          &copy; 2002 Nassau BOCES. All Rights Reserved.{" "}
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
        <p>Produced by SynergyMedia, Inc.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
