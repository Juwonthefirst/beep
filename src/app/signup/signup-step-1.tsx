"use client";

import { useCallback, useState } from "react";

import InputField from "@/components/form/input";
import { getOtp } from "@/utils/actions";
import type { SignupStepsProps } from "@/utils/types";
import SubmitBtn from "@/components/form/submit-btn";
import AuthForm from "@/components/form/form";

const SignupStep1 = ({ emailRef, onSuccess }: SignupStepsProps) => {
  const [email, setEmail] = useState("");
  const onSignupSuccess = useCallback(() => {
    onSuccess();
    emailRef.current = email;
  }, [onSuccess, emailRef, email]);

  return (
    <AuthForm className="mt-24" action={getOtp} onSuccess={onSignupSuccess}>
      <InputField
        label="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        name="email"
        placeholder="Enter an email here"
        inputType="email"
      />
      <SubmitBtn>Submit</SubmitBtn>
    </AuthForm>
  );
};

export default SignupStep1;
