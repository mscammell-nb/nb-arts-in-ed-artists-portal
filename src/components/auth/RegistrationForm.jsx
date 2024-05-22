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
import { Link } from "react-router-dom";
import { PasswordInput } from "../ui/password-input";

const RegistrationForm = () => {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <div className="flex w-full justify-center pt-16">
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
                <Input id="email" type="email" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">
                  Password
                  <span className="text-red-600">*</span>
                </Label>
                <PasswordInput id="password" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm-password">
                  Confirm Password
                  <span className="text-red-600">*</span>
                </Label>
                <PasswordInput id="confirm-password" required />
              </div>
            </div>
            <Button
              type="submit"
              variant="bocesPrimary"
              className="mt-7 w-full"
            >
              Sign up
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
