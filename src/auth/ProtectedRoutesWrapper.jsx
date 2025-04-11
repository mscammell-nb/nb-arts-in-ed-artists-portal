import Spinner from "@/components/ui/Spinner";
import { useQueryForDataQuery } from "@/redux/api/quickbaseApi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoutesWrapper = () => {
  const { user, authReady } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  let { data: artistsData, isLoading: isArtistLoading } = useQueryForDataQuery(
    user
      ? {
          from: import.meta.env.VITE_QUICKBASE_ARTISTS_TABLE_ID,
          select: [3, 6, 29, 30],
          where: `{10.EX.${user.uid}}`,
        }
      : { skip: true, refetchOnMountOrArgChange: true },
  );
  const [expired, setExpired] = useState(null);
  const [approved, setApproved] = useState(null);

  useEffect(() => {
    if (artistsData?.data && !isArtistLoading) {
      localStorage.setItem("artist/org", artistsData.data[0][6].value);
      localStorage.setItem("artistRecordId", artistsData.data[0][3].value);
      setApproved(artistsData.data[0][29].value);
      setExpired(artistsData.data[0][30].value);
    }
  }, [isArtistLoading, artistsData]);
  useEffect(() => {
    if (authReady) {
      if (!user) {
        navigate("/login");
      } else if (approved == false) {
        navigate("/file-upload");
      } else if (
        expired == true &&
        location.pathname !== "/registration-renewal"
      ) {
        navigate("/registration-gate");
      }
    }
  }, [expired, approved, authReady, user]);

  if (!authReady || isArtistLoading || !artistsData.data) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoutesWrapper;

// !: Currently there's a slight issue where if you type in a route you shouldn't have access to it'll show it for a millisecond then switch to where you can go.
