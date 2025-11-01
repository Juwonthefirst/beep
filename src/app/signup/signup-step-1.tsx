import { useActionState } from "react";

import InputField from "@/components/form/input";
import { getOtp } from "@/utils/actions";
import { AuthErrorResponse } from "@/utils/types";
import SubmitBtn from "@/components/form/submit-btn";
import { LoaderCircle } from "lucide-react";

interface Prop {
  onSuccess: () => void;
  initialState: AuthErrorResponse;
}

const SignupStep1 = ({ onSuccess, initialState }: Prop) => {
  const [state, formAction, isSubmitting] = useActionState(
    getOtp,
    initialState
  );
  if (state && "status" in state && state.status === "sent") onSuccess();
  return (
    <>
      <form
        action={formAction}
        className="flex flex-col gap-6 max-w-3xs mx-auto mt-24 text-black"
      >
        <InputField
          label="Email"
          name="email"
          placeholder="Enter an email here"
          inputType="email"
          error={state && "error" in state ? state.error : ""}
        />
        <SubmitBtn disabled={isSubmitting}>
          {isSubmitting ? <LoaderCircle className="animate-spin" /> : "Submit"}
        </SubmitBtn>
      </form>
    </>
  );
};

export default SignupStep1;
