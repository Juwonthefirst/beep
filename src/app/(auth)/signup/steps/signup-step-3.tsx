import { useCallback, useState } from "react";

import AuthForm, { FormError } from "@/components/form/form";
import { PasswordField } from "@/components/form/input";
import type {
  SignupStepsProps,
  ValidationRequirement,
} from "@/utils/types/client.type";
import RequirementCheckList from "@/components/form/check-list";
import { FormHeader, FormDescription } from "@/components/form/form-sematics";
import SubmitBtn from "@/components/form/submit-btn";

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
    <section className="mt-22 mx-auto">
      <div className="flex flex-col gap-2 items-center text-sm text-center">
        <FormHeader>Create a password</FormHeader>
        <FormDescription>
          Enter a secure password for your new account and keep it safe
        </FormDescription>
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
        <FormError/>
      </AuthForm>
    </section>
  );
};

export default SignupStep3;
