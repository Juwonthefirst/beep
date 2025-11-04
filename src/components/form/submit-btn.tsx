import { use, type ReactNode } from "react";
import { FormContext } from "./form";
import { LoaderCircle } from "lucide-react";

interface Props {
  disabled?: boolean;
  children: ReactNode;
}

const SubmitBtn = ({ disabled = false, children }: Props) => {
  const isSubmitting = use(FormContext);
  return (
    <button
      className="bg-black rounded-md text-white px-2 py-1 flex flex-col items-center disabled:opacity-70 w-full"
      type="submit"
      disabled={disabled || isSubmitting}
    >
      {isSubmitting ? <LoaderCircle className="animate-spin" /> : children}
    </button>
  );
};

export default SubmitBtn;
