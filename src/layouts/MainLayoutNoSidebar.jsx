import { Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { signOut } from "@/redux/slices/authSlice";

const MainLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClick = async()=>{
    await dispatch(signOut());
    localStorage.clear();
    navigate("/login");
  }
  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <nav className="border border-slate-200 p-5 shadow-lg flex justify-between items-center">
          <div className="max-w-36">
            <img
              src="https://nassauboces.quickbase.com/up/bpt5wxg92/a/r1/e7/v0"
              alt="Nassau BOCES logo"
            />
          </div>
          <Button onClick={()=>handleClick()}>Sign Out</Button>
        </nav>
      </header>

      <main className="grow bg-slate-50 p-14">
        <Outlet />
      </main>

      <footer className="flex flex-col items-center bg-darker p-5 text-sm text-white">
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
