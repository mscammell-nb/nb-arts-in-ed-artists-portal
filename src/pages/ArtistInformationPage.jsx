import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { useAddOrUpdateRecordMutation, useQueryForDataQuery } from "@/redux/api/quickbaseApi";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";

// TODO: Reset Password Functionality
// TODO: Address format not letting update happen, redo editing for address to match registration page
// NOTE: Do we display alternate phone?
/* NOTE: update password on firebase first
          - once accepted change it on quickbase
          - if an error occurs do not change on quickbase

   NOTE: PASSWORD WORRY, firebase does not allow diret retrieval of user passwords bc of security risks,
         we can work around this by accessing the user's current password via quickbase, then updating it on firebase
         We need to get the user's password becaus we need to verify the user knows the current password to change it
*/

const ArtistItem = ({
  label,
  value,
  setValue,
  editing,
  dropdown = false,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <Label className="font-semibold">{label}</Label>
      {editing ? (
        <>
          {dropdown ? (
            <Select onValueChange={(val) => setValue(val)}>
              <SelectTrigger className="w-[400px]">
                <SelectValue placeholder="Number of Performers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Less than Five">Less than 5</SelectItem>
                <SelectItem value="More than Five">More than 5</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input
              type="text"
              value={value}
              className="max-w-[400px]"
              onChange={(e) => setValue(e.target.value)}
            />
          )}
        </>
      ) : (
        <p>{value || '-'}</p>
      )}
    </div>
  );
};

const ArtistInformationPage = () => {
  const [editing, setEditing] = useState(false);
  const [artistVal, setArtistVal] = useState("");
  const [performersVal, setPerformersVal] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [phoneVal, setPhoneVal] = useState("");
  const [addressVal, setAddressVal] = useState("");
  const [websiteVal, setWebsiteVal] = useState("");

  const artistRecordId = localStorage.getItem("artistRecordId");
  const [updateArtist ,
  {
    isLoading: isUpdateArtistLoading,
    isSuccess: isUpdateArtistSucess,
    isError: isUpdateArtistError,
    error: updateArtistError
  }] = useAddOrUpdateRecordMutation();
  let {
    data: artistsData,
    isLoading: isArtstsLoading,
    isError: isPerformersError,
    error: artistsError,
  } = useQueryForDataQuery({
    from: import.meta.env.VITE_QUICKBASE_ARTISTS_TABLE_ID,
    select: [6, 7, 9, 19, 12, 11, 31],
    where: `{3.EX.${artistRecordId}}`,
  });
  useEffect(() => {
    if (artistsData) {
      setArtistVal(artistsData.data[0][6].value);
      setPerformersVal(artistsData.data[0][19].value);
      setEmailVal(artistsData.data[0][7].value);
      setPhoneVal(artistsData.data[0][9].value);
      setAddressVal(artistsData.data[0][12].value);
      setWebsiteVal(artistsData.data[0][31].value);
    }
  }, [artistsData]);

  useEffect(()=>{
    if(isUpdateArtistSucess){
      toast({
        title: "Operation successful!",
        description: "Artists information updated",
        variant: "success",
      })
    }
    if(isUpdateArtistError){
      toast({
        title: "There's been an error",
        description: "There was an error updating the artists information.",
        variant: "destructive",
      });
      console.log(updateArtistError)
    }

  }, [updateArtistError, isUpdateArtistSucess, isUpdateArtistError])

  const onSave = () => {
    console.log(artistVal)
    updateArtist({
      to: import.meta.env.VITE_QUICKBASE_ARTISTS_TABLE_ID,
      data: [
        {
          3: {
            value: artistRecordId
          },
          6: {
            value: artistVal
          },
          19: {
            value: performersVal
          },
          7: {
            value: emailVal
          },
          9: {
            value: phoneVal
          },
          // 12: {
          //   value: addressVal
          // },
          31: {
            value: websiteVal
          }
        }
      ]
    })
    setEditing(false)
  };
  const cancelEdit = () => {
    setEditing(false);
    setArtistVal(artistsData.data[0][6].value);
    setPerformersVal(artistsData.data[0][19].value);
    setEmailVal(artistsData.data[0][7].value);
    setPhoneVal(artistsData.data[0][9].value);
    setAddressVal(artistsData.data[0][12].value);
    setWebsiteVal(artistsData.data[0][31].value);
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full items-center justify-between rounded border border-gray-200 bg-white p-2.5">
        <p className="text-xl font-semibold">Artist Information</p>
        <Pencil1Icon
          className="size-5 cursor-pointer text-blue-400"
          onClick={() => {
            setEditing(!editing);
          }}
        />
      </div>
      {isArtstsLoading ? (
        <div className="flex w-full flex-col items-start gap-4 rounded border border-gray-200 bg-white p-2.5">
          <Skeleton className="h-[20px] w-[300px] rounded-full" />
          <Skeleton className="h-[20px] w-[200px] rounded-full" />
          <Skeleton className="mt-2 h-[20px] w-[300px] rounded-full" />
          <Skeleton className="h-[20px] w-[200px] rounded-full" />
          <Skeleton className="mt-2 h-[20px] w-[300px] rounded-full" />
          <Skeleton className="h-[20px] w-[200px] rounded-full" />
        </div>
      ) : (
        <div className="flex w-full flex-col gap-3 rounded border border-gray-200 bg-white p-2.5">
          <ArtistItem
            label="Artist / Org"
            value={artistVal}
            setValue={setArtistVal}
            editing={editing}
          />
          <ArtistItem
            label="Number of Performers"
            value={performersVal}
            setValue={setPerformersVal}
            editing={editing}
            dropdown={true}
          />
          <ArtistItem
            label="Email"
            value={emailVal}
            setValue={setEmailVal}
            editing={editing}
          />
          <ArtistItem
            label="Phone"
            value={phoneVal}
            setValue={setPhoneVal}
            editing={editing}
          />
          <ArtistItem
            label="Address"
            value={addressVal}
            setValue={setAddressVal}
            editing={editing}
          />
          <ArtistItem
            label="Website"
            value={websiteVal}
            setValue={setWebsiteVal}
            editing={editing}
          />
          <Sheet>
            <SheetTrigger className="mt-3 w-fit cursor-pointer text-sm text-blue-500 hover:underline">
              Change Password
            </SheetTrigger>
            <SheetContent>
              <div className="flex w-full flex-col gap-3">
                <div>
                  <p className="text-2xl font-bold">Change Password</p>
                  <p className="text-gray-500">
                    {" "}
                    Ensure your account is using a long, random passowrd to stay
                    secure.
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Current Password</Label>
                  <PasswordInput />
                </div>

                <div>
                  <Label className="font-semibold">New Password</Label>
                  <PasswordInput />
                </div>

                <div>
                  <Label className="font-semibold">Confirm Password</Label>
                  <PasswordInput />
                </div>

                <Button disabled className="w-fit">
                  Save
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          {editing && (
            <div className="flex gap-3">
              <Button
                className="w-fit"
                variant="secondary"
                onClick={() => cancelEdit()}
              >
                Cancel
              </Button>
              {/* TODO: Implement save logic */}
              <Button className="w-fit" onClick={() => onSave()}>
                Save
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArtistInformationPage;
