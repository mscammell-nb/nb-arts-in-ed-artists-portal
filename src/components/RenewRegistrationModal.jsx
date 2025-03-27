import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { isRegistrationExpiring } from "@/utils/isRegistrationExpiring";
import React from "react";
import { useNavigate } from "react-router-dom";

const RenewRegistrationModal = (openProp) => {
  const [open, setOpen] = React.useState(openProp);
  const navigate = useNavigate();
  const isRegistrationExpired = isRegistrationExpiring();

  if (!isRegistrationExpired) return <></>;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Your Registration is About to Expire
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your registration is about to expire. Please renew your registration
            to ensure uninterrupted access to our services.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Remind me Later
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => navigate("/registration-renewal")}>
            Renew Registration
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RenewRegistrationModal;
