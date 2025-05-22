import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { selectAuth, signIn } from "@/redux/slices/authSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { PasswordInput } from "../components/ui/password-input";
import { useToast } from "../components/ui/use-toast";

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const { user, loading, error: authError } = useSelector(selectAuth);
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
    if (user) {
      toast({
        variant: "success",
        title: "Operation successful!",
        description: "You have logged in successfully!",
      });
      navigate("/registration-gate");
    }
  }, [user]);

  useEffect(() => {
    if (authError) {
      console.log("error: ", authError);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${authError}`,
      });
    }
  }, [authError]);

  const onSubmit = async (data) => {
    await dispatch(signIn({ email: data.email, password: data.password }));
  };

  const onForgotPassword = () => {
    const email = document.getElementById("resetPasswordEmail").value;
    const auth = getAuth();
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          toast({
            variant: "success",
            title: "Password Reset Email Sent",
            description:
              "You were emailed a password reset email. Check your spam folder incase you did not receive it.",
          });
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Password Reset Email Failed",
            description: "Failed to send the password reset email.",
          });
        });
    }
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

              <Dialog onSubmit={onForgotPassword}>
                <DialogTrigger asChild>
                  <span className="cursor-pointer text-sm text-blue-600 underline">
                    Forgot your password?
                  </span>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Reset Your Password</DialogTitle>
                    <DialogDescription>
                      Enter your email and you will be emailed a password reset
                      link. If you don't receive it check your spam folder.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="resetPasswordEmail"
                        className="text-right"
                      >
                        Email
                      </Label>
                      <Input
                        id="resetPasswordEmail"
                        placeholder="email"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-center">
                    <Button onClick={onForgotPassword}>
                      Send password reset
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button type="submit" className="mt-7 w-full" isLoading={loading}>
                Sign in
              </Button>
            </form>
          </Form>
          <div className="pt-2 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/registration" className="text-blue-600 underline">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
