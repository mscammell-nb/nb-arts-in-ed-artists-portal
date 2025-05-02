import { cn } from "@/lib/utils";
import { Mail, Phone, User } from "lucide-react";

const ContactCard = ({ name, email, phone, inDialog = false }) => {
  const cardClasses = {
    base: `mx-auto max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-md`,
    dialog: `w-full overflow-hidden mb-4`,
  };
  return (
    <div className={cn(!inDialog ? cardClasses.base : cardClasses.dialog)}>
      <div>
        <div className="mb-4">
          {!inDialog ? (
            <h2 className="text-2xl font-bold text-gray-800">Contact Card</h2>
          ) : (
            <></>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="text-gray-500" size={20} />
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg font-medium text-gray-900">{name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="text-gray-500" size={20} />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium text-gray-900">{email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="text-gray-500" size={20} />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-lg font-medium text-gray-900">{phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
