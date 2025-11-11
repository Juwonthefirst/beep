"use client";

import { useCallback, useState } from "react";

import InputField from "@/components/form/input";
import { getOtp } from "@/utils/actions";
import type { SignupStepsProps } from "@/utils/types/client.type";
import AuthForm, { FormError } from "@/components/form/form";
import { FormDescription, FormHeader } from "@/components/form/form-sematics";
import Logo from "@/components/logo";
import SubmitBtn from "@/components/form/submit-btn";
import GoogleLoginBtn from "@/components/auth-form/google-login-btn";

const SignupStep1 = ({ onSuccess }: Omit<SignupStepsProps, "email">) => {
  const [email, setEmail] = useState("");
  const onSignupSuccess = useCallback(() => {
    onSuccess(email);
  }, [onSuccess, email]);

  return (
    <section className="mt-22 mx-auto max-w-sm">
      <div className="flex flex-col gap-2 items-center  mb-8">
        <div className="flex items-end gap-2 ">
          <FormHeader className="text-xl">Welcome to</FormHeader>
          <Logo />
        </div>
        <FormDescription className="max-w-xs leading-5">
          Your only open source chat platform{" "}
          {/*where you can meet, call, chat
          with your loved ones with features created by you. Enter your email to
          continue */}
        </FormDescription>
      </div>
      <AuthForm action={getOtp} onSuccess={onSignupSuccess}>
        <InputField
          label="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          name="email"
          placeholder="Enter an email here"
          inputType="email"
        />
        <SubmitBtn>Submit</SubmitBtn>
        <FormError />
        <div className="relative border-t border-black opacity-75 text-sm">
          <p className="absolute -top-3.5 left-9/20 text-center z-10 bg-white p-1">
            or
          </p>
        </div>
        <GoogleLoginBtn />
      </AuthForm>
    </section>
  );
};

export default SignupStep1;
