import { useState } from "react";
import { auth } from "@/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const useSignInUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [uid, setUid] = useState(null);

  const signInUser = async (email, password) => {
    setIsLoading(true);
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      setAccessToken(userCredentials.user.accessToken);
      setUid(userCredentials.user.uid);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { signInUser, accessToken, uid, isLoading, isSuccess, isError, error };
};

export default useSignInUser;
