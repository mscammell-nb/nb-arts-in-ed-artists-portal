import { Toaster } from "@/components/ui/toaster";
import { signOut } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const MainLayout = ({ isDark }) => {
  const imageSource = isDark
    ? "https://resources.finalsite.net/images/f_auto,q_auto/v1726066239/Branding/na8arirrgrexylovc6ap/NB-Logo-2color-White.png"
    : "https://resources.finalsite.net/images/f_auto,q_auto/v1726066240/Branding/fczgbgadj3knyvi9wura/NB-Logo-Color.png";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClick = async () => {
    await dispatch(signOut());
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header>
        <nav className="flex items-center justify-between border-b border-border p-5 shadow-lg ">
          <div className="max-w-36">
            {/* Old image 
            <img
              src="https://nassauboces.quickbase.com/up/bpt5wxg92/a/r1/e7/v0"
              alt="Nassau BOCES logo"
            /> */}

            {/* New hi-res image */}
            <img src={imageSource} alt="Nassau BOCES logo" />
          </div>
        </nav>
      </header>

      <main className="bg-backgrund flex grow flex-col p-14">
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
