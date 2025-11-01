import type { ReactNode } from "react";

interface Props {
  disabled: boolean;
  children: ReactNode;
}

const SubmitBtn = ({ disabled, children }: Props) => {
  return (
    <button
      className="bg-black rounded-lg text-white  px-2 py-1 flex flex-col items-center disabled:opacity-70"
      type="submit"
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default SubmitBtn;
