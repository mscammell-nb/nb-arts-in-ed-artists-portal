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
            <h2 className="text-2xl font-bold text-tertiary">Contact Card</h2>
          ) : (
            <></>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="text-tertiary" size={20} />
            <div>
              <p className="text-sm text-tertiary">Name</p>
              <p className="text-lg font-medium text-tertiary">{name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="text-tertiary" size={20} />
            <div>
              <p className="text-sm text-tertiary">Email</p>
              <p className="text-lg font-medium text-tertiary">{email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="text-tertiary" size={20} />
            <div>
              <p className="text-sm text-tertiary">Phone</p>
              <p className="text-lg font-medium text-tertiary">{phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
