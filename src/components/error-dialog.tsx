// components/ErrorDialog.tsx

import * as Dialog from "@radix-ui/react-dialog";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button"; // Replace with your actual button path
import { cn } from "@/lib/utils"; // Replace with your actual utils path

type ErrorDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  variant?: "error" | "warning" | "info";
};

const ErrorDialog = ({
  isOpen,
  onClose,
  title,
  message,
  variant = "error",
}: ErrorDialogProps) => {
  // Determine the Icon to use based on the variant
  const Icon = XCircle;

  // Determine color to use based on the variant
  const variantColor =
    variant === "error"
      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      : variant === "warning"
      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            "fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white p-6 shadow-lg focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-1/2 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-1/2  dark:bg-gray-800",
            variantColor
          )}
        >
          <Dialog.Title className="text-xl font-semibold">
            <div className="flex flex-row items-center">
              <Icon
                className={cn(
                  "h-6 w-6 mr-2",
                  variant === "error" && "text-red-500",
                  variant === "warning" && "text-yellow-500",
                  variant === "info" && "text-blue-500"
                )}
              />
              {title}
            </div>
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mt-2">
            {message}
          </Dialog.Description>
          <div className="mt-6 flex justify-end">
            <Dialog.Close asChild>
              <Button variant="secondary">Close</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ErrorDialog;
