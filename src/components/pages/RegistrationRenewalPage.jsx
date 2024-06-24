import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
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

// TODO: make yup schema validation more complex

const schema = yup.object({
  artistOrg: yup.string().required(),
  phone: yup.number().required(),
  altPhone: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value,
    ),
  street1: yup.string().required(),
  street2: yup
    .string()
    .nullable()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value,
    ),
  city: yup.string().required(),
  state: yup.string().required(),
  zipCode: yup.number().required(),
});

const RegistrationRenewalPage = () => {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      artistOrg: "",
      phone: "",
      altPhone: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const onSubmit = data => console.log(data)

  return (
    <div className="flex w-full justify-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Registration Renewal</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="artistOrg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Artist / Organization
                      <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Artist / Organization" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 6312890915" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="altPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alt phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 6312890915" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="street1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Street 1<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Street 1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="street2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street 2</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Street 2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      City<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="City" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      State<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="State" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Zip code<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Zip code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant="bocesPrimary"
                className="mt-7 w-full"
                // disabled={isRequestLoading()}
              >
                {/* {isRequestLoading() && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isRequestLoading() ? "Please wait" : "Sign in"} */}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationRenewalPage;
