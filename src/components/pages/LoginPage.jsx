import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { PasswordInput } from "../ui/password-input";
import { useLoginUserMutation } from "@/redux/api/authApi";
import { useEffect } from "react";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import { ReloadIcon } from "@radix-ui/react-icons";
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
  const [loginUser, { data, isLoading, isSuccess, isError, error }] =
    useLoginUserMutation();
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
    if (isSuccess && data) {
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

  const onSubmit = (data) => {
    loginUser(data);
  };

  return (
    <div className="flex w-full justify-center py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
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
