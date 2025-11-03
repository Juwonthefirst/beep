import AuthForm from "@/components/form/form";
import OtpInput from "@/components/form/otp-input";
import SubmitBtn from "@/components/form/submit-btn";
import { verifyOtp } from "@/utils/actions";
import { SignupStepsProps } from "@/utils/types";

const SignupStep2 = ({ emailRef, onSuccess }: SignupStepsProps) => {
  const email = emailRef.current;

  return (
    <section className="flex flex-col gap-4 mt-24 text-black max-w-3xs mx-auto items-center">
      <h1 className="font-medium text-2xl">Verify your email</h1>
      <p className="text-sm">Enter the OTP sent to </p>
      <AuthForm
        className="mt-4"
        action={verifyOtp}
        onSuccess={() => alert("success")}
      >
        <OtpInput />
        <SubmitBtn>Verify</SubmitBtn>
      </AuthForm>
    </section>
  );
};

export default SignupStep2;
