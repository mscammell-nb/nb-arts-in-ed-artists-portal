import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { PasswordInput } from "../ui/password-input";
import { useRegisterUserMutation } from "@/redux/api/authApi";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/authSlice";
import { formatAuthErrorMessage } from "@/utils/functionUtils";

const RegistrationForm = () => {
  const [registerUser, { data, isLoading, isSuccess, isError, error }] =
    useRegisterUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data));
      toast({
        variant: "success",
        title: "Operation successful!",
        description: "Your account has been created.",
      });
      navigate("/dashboard");
    }

    if (isError && error) {
      console.log("error: ", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${formatAuthErrorMessage(error.data.code)}`,
      });
    }
  }, [isSuccess, data, isError, error, toast]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    await registerUser({
      ...payload,
      role: "VENDOR",
      quickbaseToken: "no token for now",
    });
  };

  return (
    <div className="flex w-full justify-center py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your credentials below to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">
                  Email
                  <span className="text-red-600">*</span>
                </Label>
                <Input id="email" type="email" name="email" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="" name="phone" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">
                  Password
                  <span className="text-red-600">*</span>
                </Label>
                <PasswordInput id="password" name="password" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm-password">
                  Confirm Password
                  <span className="text-red-600">*</span>
                </Label>
                <PasswordInput
                  id="confirm-password"
                  name="confirm-password"
                  required
                />
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
              {isLoading ? "Please wait" : "Sign up"}
            </Button>
          </form>
          <div className="pt-2 text-center text-sm">
            Already have an account?{" "}
            <Link to="/auth/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationForm;
