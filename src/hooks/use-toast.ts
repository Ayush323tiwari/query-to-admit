
import { toast as sonnerToast } from "sonner";
import { useToast as useShadcnToast } from "@/components/ui/toast";

export const useToast = useShadcnToast;

export const toast = {
  ...sonnerToast,
  success: (message: string) => sonnerToast.success(message),
  error: (message: string) => sonnerToast.error(message),
  info: (message: string) => sonnerToast.info(message),
  warning: (message: string) => sonnerToast.warning(message),
};
