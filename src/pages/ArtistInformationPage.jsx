import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryForDataQuery } from "@/redux/api/quickbaseApi";

// TODO: Reset Password Functionality
// TODO: Num Performers

const ArtistInformationPage = () => {
  const artistRecordId = localStorage.getItem("artistRecordId");
  const {
    data: artistsData,
    isLoading: isArtstsLoading,
    isError: isPerformersError,
    error: artistsError,
  } = useQueryForDataQuery({
    from: import.meta.env.VITE_QUICKBASE_ARTISTS_TABLE_ID,
    select: [6, 7, 9, 19, 12, 11],
    where: `{3.EX.${artistRecordId}}`,
  });

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="w-full rounded border border-gray-200 bg-white p-2.5">
        <p className="text-xl font-semibold">Artist Information</p>
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
          <div>
            <Label className="font-semibold">Artist / Org</Label>
            <p>{artistsData?.data && artistsData.data[0][6].value}</p>
          </div>
          <div>
            <Label className="font-semibold">Number of Performers</Label>
            <p>-</p>
          </div>
          <div>
            <Label className="font-semibold">Email</Label>
            <p>{artistsData?.data && artistsData.data[0][7].value}</p>
          </div>

          <div>
            <Label className="font-semibold">Phone</Label>
            <p>{artistsData?.data && artistsData.data[0][9].value}</p>
          </div>

          <div>
            <Label className="font-semibold">Address</Label>
            <p>{artistsData?.data && artistsData.data[0][12].value}</p>
          </div>
          <Sheet>
            <SheetTrigger className="mt-3 w-fit cursor-pointer text-sm text-blue-500 hover:underline">
              Change Password
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-3 w-full">
                <div>
                  <p className="font-bold text-2xl">Change Password</p>
                  <p className="text-gray-500"> Ensure your account is using a long, random passowrd to stay secure.</p>
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

                <Button disabled className="w-fit">Save</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  );
};

export default ArtistInformationPage;
