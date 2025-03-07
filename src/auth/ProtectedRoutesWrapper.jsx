import Spinner from "@/components/ui/Spinner";
import { useQueryForDataQuery } from "@/redux/api/quickbaseApi";
import { data } from "autoprefixer";
import { getAuth } from "firebase/auth";
import { use } from "react";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedRoutesWrapper = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const uid = localStorage.getItem("uid");
  let {
    data: artistsData,
    isLoading: isArtistLoading,
    isError: isPerformersError,
    error: artistsError,
  } = useQueryForDataQuery({
    from: import.meta.env.VITE_QUICKBASE_ARTISTS_TABLE_ID,
    select: [3, 6, 29, 30],
    where: `{10.EX.${uid}}`,
  });
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(null);
  const [approved, setApproved] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthenticated(!!user);
      setLoading(false);
    });
    return unsubscribe;
  }, [auth]);

  useEffect(()=>{
    if(artistsData && !isArtistLoading){
      setApproved(artistsData.data[0][29].value);
      setExpired(artistsData.data[0][30].value);
    }
  },[isArtistLoading, artistsData]);

  useEffect(()=>{
    if(!loading){
      if(!authenticated){
        navigate('/login')
      }else if(expired == true || approved == false){
        navigate('/registration-gate')
      }
    }
  },[loading, authenticated, expired, approved, navigate])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoutesWrapper;