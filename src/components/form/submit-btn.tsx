import { use, type ReactNode } from "react";
import { FormContext } from "./form";
import { LoaderCircle } from "lucide-react";

interface Props {
  children: ReactNode;
}

const SubmitBtn = ({ children }: Props) => {
  const isSubmitting = use(FormContext);
  return (
    <button
      className="bg-black rounded-lg text-white px-2 py-1 flex flex-col items-center disabled:opacity-70"
      type="submit"
      disabled={isSubmitting}
    >
      {isSubmitting ? <LoaderCircle className="animate-spin" /> : children}
    </button>
  );
};

export default SubmitBtn;
