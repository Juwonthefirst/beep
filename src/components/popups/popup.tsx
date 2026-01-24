import { type ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

interface Props {
  children: ReactNode;
  trigger: ReactNode;
  className?: string;
}

const Popup = ({ trigger, children, className }: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className={className}>{children}</AlertDialogContent>
    </AlertDialog>
  );
};

export default Popup;
