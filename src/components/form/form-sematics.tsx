import { cn } from "@/lib/utils";

interface SematicsProps {
  children: React.ReactNode;
  className?: string;
}

export const FormHeader = ({ children, className }: SematicsProps) => (
  <h1 className={cn("font-semibold text-2xl mb-1", className)}>{children}</h1>
);

export const FormDescription = ({ children, className }: SematicsProps) => (
  <span className={cn("text-sm opacity-70", className)}>{children}</span>
);
