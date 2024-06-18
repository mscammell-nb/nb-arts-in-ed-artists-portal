import * as React from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";

const PasswordInput = React.forwardRef(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          type="button"
          className="absolute right-3 top-3"
        >
          {showPassword ? (
            <EyeNoneIcon className="select-none hover:cursor-pointer" />
          ) : (
            <EyeOpenIcon className="select-none hover:cursor-pointer" />
          )}
        </button>
      </div>
    </>
  );
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
