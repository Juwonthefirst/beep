import { useCallback, useState } from "react";

import AuthForm from "@/components/form/form";
import { PasswordField } from "@/components/form/input";
import SubmitBtn from "@/components/form/submit-btn";
import type { SignupStepsProps } from "@/utils/types";
import CheckList from "@/components/form/check-list";

const SignupStep3 = ({ onSuccess }: SignupStepsProps) => {
  const [password, setPassword] = useState("");
  const onSignupSuccess = useCallback(() => {
    onSuccess(password);
  }, [onSuccess, password]);
  const passwordRequirements = {
    "Password should be atleast 8 characters": password.length >= 8,
    "Password should not be more than 24 characters": password.length <= 24,
  };
  return (
    <section className="mt-16 mx-auto">
      <div className="flex flex-col gap-2 items-center text-sm text-center">
        <h1 className="font-semibold text-2xl mb-2">Enter a password</h1>
        <p className="opacity-70">
          Enter your preferred password for your new account
        </p>
      </div>

      <AuthForm
        className="mt-4"
        action={async () => ({ status: "saved" })}
        onSuccess={onSignupSuccess}
      >
        <div className="flex flex-col gap-2">
          <PasswordField
            label="Password"
            name="password"
            placeholder="Enter a valid password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            validation={(password) => {
              if (!password) return;
              if (password.length < 8)
                return "Password should be atleast 8 characters";
              if (password.length > 24)
                return "Password should not be more than 24 characters";
            }}
          />
          <CheckList list={passwordRequirements} />
        </div>

        <PasswordField
          label="Confirm password"
          placeholder="Re-enter your password"
          validation={(reEnteredPassword) => {
            return reEnteredPassword !== password
              ? "Your password does not match"
              : "";
          }}
        />
        <SubmitBtn disabled>Submit</SubmitBtn>
      </AuthForm>
    </section>
  );
};

export default SignupStep3;
