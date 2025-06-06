import { cn } from "@/lib/utils";
import { Mail, Phone, User } from "lucide-react";

const ContactCard = ({ name, email, phone, inDialog = false }) => {
  const cardClasses = {
    base: `mx-auto max-w-md overflow-hidden rounded-xl bg-foreground shadow-md md:max-w-md`,
    dialog: `w-full overflow-hidden mb-4`,
  };
  return (
    <div className={cn(!inDialog ? cardClasses.base : cardClasses.dialog)}>
      <div>
        <div className="mb-4">
          {!inDialog ? (
            <h2 className="text-tertiary-800 text-2xl font-bold">
              Contact Card
            </h2>
          ) : (
            <></>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="text-tertiary-500" size={20} />
            <div>
              <p className="text-tertiary-500 text-sm">Name</p>
              <p className="text-tertiary-900 text-lg font-medium">{name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="text-tertiary-500" size={20} />
            <div>
              <p className="text-tertiary-500 text-sm">Email</p>
              <p className="text-tertiary-900 text-lg font-medium">{email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="text-tertiary-500" size={20} />
            <div>
              <p className="text-tertiary-500 text-sm">Phone</p>
              <p className="text-tertiary-900 text-lg font-medium">{phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
