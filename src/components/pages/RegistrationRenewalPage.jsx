import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import {
  useQueryForDataMutation,
  useAddOrUpdateRecordMutation,
} from "@/redux/api/quickbaseApi";
import { parsePhoneNumber } from "@/utils/functionUtils";
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
import Spinner from "../ui/Spinner";

// TODO: make yup schema validation more complex
const schema = yup.object({
  artistOrg: yup.string().required(),
  email: yup.string().email().required(),
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [
    queryForData,
    {
      data: userData,
      isLoading: isUserDataLoading,
      isSuccess: isQueryForDataSuccess,
      isError: isUserDataError,
      error: userDataError,
    },
  ] = useQueryForDataMutation();
  const [
    addOrupdateRecord,
    {
      data: newArtistRegistrationData,
      isLoading: isNewArtistRegistrationLoading,
      isSuccess: isNewArtistRegistrationSuccess,
      isError: isNewArtistRegistrationError,
      error: newArtistRegistrationError,
    },
  ] = useAddOrUpdateRecordMutation();

  useEffect(() => {
    queryForData({
      from: import.meta.env.VITE_QUICKBASE_ARTISTS_TABLE_ID,
      select: [3, 6, 7, 8, 9, 11, 13, 14, 15, 16, 17],
      // TODO: Get the QB token (userUid) from the local storage.
      where: "{10.EX.'kU4EmyvW0xYeE1ztfAOTbaTS5tq2'}",
    });
  }, [queryForData]);

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      artistOrg: "",
      email: "",
      phone: "",
      altPhone: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (userData) {
      const data = userData.data[0];
      const defaultValues = {
        artistOrg: data[6].value,
        email: data[7].value,
        phone: parsePhoneNumber(data[9].value),
        altPhone: parsePhoneNumber(data[11].value),
        street1: data[13].value,
        street2: data[14].value,
        city: data[15].value,
        state: data[16].value,
        zipCode: data[17].value,
      };
      reset(defaultValues);
    }
  }, [userData, reset]);

  const formatDataForQuickbase = (data) => {
    const body = {
      to: import.meta.env.VITE_QUICKBASE_ARTIST_REGISTRATIONS_TABLE_ID,
      data: [
        {
          7: {
            value: userData.data[0][3].value,
          },
          9: {
            value: userData.data[0][7].value,
          },
          10: {
            value: userData.data[0][8].value,
          },
          11: {
            value: data.phone,
          },
          13: {
            value: "kU4EmyvW0xYeE1ztfAOTbaTS5tq2",
          },
          15: {
            value: data.street1,
          },
          17: {
            value: data.city,
          },
          18: {
            value: data.state,
          },
          19: {
            value: data.zipCode,
          },
          20: {
            value: "United States",
          },
        },
      ],
    };

    if (data.altPhone !== null) {
      body.data[0][12] = { value: data.altPhone };
    }

    if (data.street2 !== null) {
      body.data[0][16] = { value: data.street2 };
    }

    return body;
  };

  useEffect(() => {
    if (isNewArtistRegistrationSuccess) {
      toast({
        variant: "success",
        title: "Operation successful!",
        description: "New registration created.",
      });
      navigate("/dashboard");
    }

    if (isNewArtistRegistrationError) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: newArtistRegistrationError.data.code,
      });
      navigate("/dashboard");
    }
  }, [
    isNewArtistRegistrationSuccess,
    isNewArtistRegistrationError,
    newArtistRegistrationError,
    toast,
  ]);

  const onSubmit = async (data) => {
    const response = await addOrupdateRecord(formatDataForQuickbase(data));
  };

  if (!userData && isUserDataLoading)
    return (
      <div className="flex h-full w-full justify-center pt-24">
        <Spinner />
      </div>
    );

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
                    <FormLabel>Artist / Organization</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Artist / Organization"
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Email" disabled />
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
                disabled={isNewArtistRegistrationLoading}
              >
                {isNewArtistRegistrationLoading && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isNewArtistRegistrationLoading ? "Please wait" : "Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationRenewalPage;
