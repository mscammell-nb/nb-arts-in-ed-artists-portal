import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { setUser } from "@/redux/slices/authSlice";

const FirebaseAuthListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            accessToken: user.accessToken,
          }),
        );
      } else {
        // User is signed out - explicitly set to null
        dispatch(setUser(null));
      }
    });

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return null;
};

export default FirebaseAuthListener;
