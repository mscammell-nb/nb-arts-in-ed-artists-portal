import { ReloadIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LoadingButton = ({
  isLoading,
  buttonText,
  loadingText,
  className,
  variant,
  size,
  asChild = false,
  ...props
}) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
      disabled={isLoading}
    >
      {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading ? loadingText : buttonText}
    </Comp>
  );
};

LoadingButton.displayName = "LoadingButton";
export { LoadingButton };
