import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { PasswordInput } from "../components/ui/password-input";
import useSignInUser from "@/hooks/useSignInUser";
import { useEffect } from "react";
import { useToast } from "../components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const LoginPage = () => {
  const { signInUser, accessToken, uid, isLoading, isSuccess, isError, error } =
    useSignInUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem("uid", uid);
      localStorage.setItem("accessToken", accessToken);
      toast({
        variant: "success",
        title: "Operation successful!",
        description: "You have logged in successfully!",
      });
      navigate("/registration-gate");
    }

    if (isError && error) {
      console.log("error: ", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
      });
    }
  }, [isSuccess, accessToken, uid, isError, error, toast]);

  const onSubmit = async (data) => {
    signInUser(data.email, data.password);
  };

  return (
    <div className="flex w-full justify-center py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Artist Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-7 w-full"
                isLoading={isLoading}
              >
                Sign in
              </Button>
            </form>
          </Form>
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
