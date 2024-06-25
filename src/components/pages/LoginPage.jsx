import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { PasswordInput } from "../ui/password-input";
import { useLoginUserMutation } from "@/redux/api/authApi";
import { useEffect } from "react";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/authSlice";
import { ReloadIcon } from "@radix-ui/react-icons";

// TODO: edit form to use the form component from Shadcn/ui

const LoginPage = () => {
  const [loginUser, { data, isLoading, isSuccess, isError, error }] =
    useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isSuccess && data) {
      // TODO: figure out whether I still need this dispatch
      dispatch(setUser(data));
      const { userUid, authToken } = data;
      localStorage.setItem("userUid", userUid);
      localStorage.setItem("authToken", authToken);
      toast({
        variant: "success",
        title: "Operation successful!",
        description: "You have logged in successfully!",
      });
      navigate("/dashboard");
    }

    if (isError && error) {
      console.log("error: ", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error.data.code}`,
      });
    }
  }, [isSuccess, data, isError, error, toast]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    await loginUser(payload);
  };

  return (
    <div className="flex w-full justify-center py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput id="password" name="password" required />
              </div>
            </div>
            <Button
              type="submit"
              variant="bocesPrimary"
              className="mt-7 w-full"
              disabled={isLoading}
            >
              {isLoading && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isLoading ? "Please wait" : "Sign in"}
            </Button>
          </form>
          <div className="pt-2 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/registration" className="underline">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
