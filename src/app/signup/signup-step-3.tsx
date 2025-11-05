import { useCallback, useState } from "react";

import AuthForm from "@/components/form/form";
import { PasswordField } from "@/components/form/input";
import SubmitBtn from "@/components/form/submit-btn";
import type { SignupStepsProps, ValidationRequirement } from "@/utils/types";
import RequirementCheckList from "@/components/form/check-list";

const SignupStep3 = ({ onSuccess }: Omit<SignupStepsProps, "email">) => {
  const [password, setPassword] = useState("");
  const [hasValidationError, setHasValidationError] = useState({
    password: true,
    confirm: true,
  });

  const onSignupSuccess = useCallback(() => {
    onSuccess(password);
  }, [onSuccess, password]);

  const passwordRequirements: ValidationRequirement[] = [
    {
      message: "Password should be at least 8 characters",
      test: (password: string) => password.length >= 8,
    },
    {
      message: "Password should not be more than 24 characters",
      test: (password: string) => password.length <= 24,
    },
  ];

  return (
    <section className="mt-16 mx-auto">
      <div className="flex flex-col gap-2 items-center text-sm text-center">
        <h1 className="font-semibold text-2xl mb-1">Create a password</h1>
        <p className="opacity-70">
          Enter your preferred password for your new account
        </p>
      </div>

      <AuthForm
        className="mt-6"
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
              if (!password) return "This field is required";
              setHasValidationError((prev) => ({ ...prev, password: true }));
              const failedRequirement = passwordRequirements.find(
                (requirement) => !requirement.test(password)
              );
              if (failedRequirement) return failedRequirement.message;
              setHasValidationError((prev) => ({ ...prev, password: false }));
            }}
          />
          <RequirementCheckList
            value={password}
            requirements={passwordRequirements}
          />
        </div>

        <PasswordField
          label="Confirm password"
          placeholder="Re-enter your password"
          validation={(reEnteredPassword) => {
            setHasValidationError((prev) => ({ ...prev, confirm: true }));
            if (reEnteredPassword !== password)
              return "Your password does not match";
            setHasValidationError((prev) => ({ ...prev, confirm: false }));
          }}
        />
        <SubmitBtn
          disabled={hasValidationError.confirm || hasValidationError.password}
        >
          Submit
        </SubmitBtn>
      </AuthForm>
    </section>
  );
};

export default SignupStep3;
