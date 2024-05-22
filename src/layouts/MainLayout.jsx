import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <nav className="p-5 shadow">
          <div className="max-w-36">
            <img
              src="https://www.nassauboces.org/cms/lib/NY01928409/Centricity/Template/GlobalAssets/images///logos/NBlogo-website3.png"
              alt="Nassau BOCES logo"
            />
          </div>
        </nav>
      </header>

      <main className="grow p-5">
        <Outlet />
      </main>

      <footer className="bg-bocesPrimary p-5 text-white flex flex-col items-center text-sm">
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
