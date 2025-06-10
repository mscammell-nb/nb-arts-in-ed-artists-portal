import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import * as React from "react";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-text-secondary",
  {
    variants: {
      variant: {
        default: "bg-background text-text-secondary",
        destructive:
          "border-destructive/50 text-red-800 dark:border-destructive [&>svg]:text-destructive bg-destructive/15",
        warning:
          "border-amber-500 text-amber-700 dark:border-amber-500 [&>svg]:text-amber-700 bg-amber-900/15",
        info: "border-blue-400 text-blue-600 dark:border-blue-400 [&>svg]:text-blue-600 bg-blue-50",
        success:
          "border-green-400/50 text-green-600 dark:border-green-400 [&>svg]:text-green-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription, AlertTitle };
