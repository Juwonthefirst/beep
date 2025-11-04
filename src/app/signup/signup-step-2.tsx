import AuthForm from "@/components/form/form";
import OtpInput from "@/components/form/otp-input";
import SubmitBtn from "@/components/form/submit-btn";
import { verifyOtp, getOtp } from "@/utils/actions";
import { SignupStepsProps } from "@/utils/types";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

const RequestOtpBtn = ({
  email,
  requestTimeout = 120,
}: {
  email: string;
  requestTimeout?: number;
}) => {
  const [isLoading, setisLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(requestTimeout);

  if (timeLeft <= 0) {
    setIsDisabled(false);
    setTimeLeft(requestTimeout);
  }

  useEffect(() => {
    if (!isDisabled) return;
    const timeoutId = setTimeout(
      () => setTimeLeft((currentTime) => currentTime - 1),
      1000
    );

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isDisabled, timeLeft]);

  return (
    <button
      type="button"
      className="text-sm font-medium text-blue-600 disabled:opacity-70 hover:not-disabled:underline"
      disabled={isDisabled}
      onClick={async () => {
        setisLoading(true);
        const formData = new FormData();
        formData.append("email", email);
        const status = await getOtp(undefined, formData);
        setisLoading(false);
        if (status && "status" in status) {
          setIsDisabled(true);
        }
      }}
    >
      {isDisabled ? (
        `wait ${timeLeft}s`
      ) : isLoading ? (
        <LoaderCircle size={18} className="animate-spin" />
      ) : (
        "Get another"
      )}
    </button>
  );
};

const SignupStep2 = ({ email, onSuccess }: SignupStepsProps) => {
  return (
    <section className="mt-24 mx-auto">
      <div className="flex flex-col gap-1 items-center text-sm text-center">
        <h1 className="font-semibold text-2xl mb-2">Verify your email</h1>
        <p>
          <span className="opacity-70">Enter the OTP sent to </span>
          <span className="font-medium opacity-90">{email}</span>
        </p>
        <p className="flex gap-1 items-center">
          <span className="opacity-70">Didn&apos;t get a code?</span>
          <RequestOtpBtn email={email} />
        </p>
      </div>

      <AuthForm
        className="mt-10 items-center"
        action={verifyOtp}
        onSuccess={onSuccess}
      >
        <OtpInput />
        <SubmitBtn>Verify</SubmitBtn>
      </AuthForm>
    </section>
  );
};

export default SignupStep2;
