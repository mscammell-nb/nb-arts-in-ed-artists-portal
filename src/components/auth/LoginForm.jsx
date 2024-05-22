import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { PasswordInput } from "../ui/password-input";

const LoginForm = () => {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <div className="flex w-full justify-center pt-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput id="password" required />
              </div>
            </div>
            <Button
              type="submit"
              variant="bocesPrimary"
              className="mt-7 w-full"
            >
              Sign in
            </Button>
          </form>
          <div className="text-center text-sm pt-2">
            Don't have an account?{" "}
            <Link to="/auth/register" className="underline">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
