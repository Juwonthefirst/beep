import FileUpload from "@/components/form/file-upload";
import AuthForm from "@/components/form/form";
import {
  FormDescription,
  FormHeader,
  SubmitBtn,
} from "@/components/form/form-sematics";
import InputField, { PasswordField } from "@/components/form/input";
import ValidateUsernameField from "@/components/validate-username-field";
import { signup } from "@/utils/actions";
import type {
  SignupStepsProps,
  ValidationState,
} from "@/utils/types/client.types";
import Image from "next/image";
import { useState } from "react";

interface Props extends SignupStepsProps {
  password: string;
  goToRequestOtp: () => void;
  goToCreatePassword: () => void;
}

const SignupStep4 = ({
  email,
  password,
  goToCreatePassword,
  goToRequestOtp,
  onSuccess,
}: Props) => {
  const [usernameValidationState, setUsernameValidationState] =
    useState<ValidationState>("idle");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  return (
    <section className="mt-22 mx-auto">
      <div className="flex flex-col gap-1 items-center text-sm text-center">
        <FormHeader>Almost done</FormHeader>
        <FormDescription>Finish setting up your account</FormDescription>
      </div>

      <AuthForm
        className="mt-6 items-center px-0"
        action={signup}
        onSuccess={onSuccess}
      >
        <div className="flex gap-6 flex-col items-center">
          <FileUpload
            name="profile_picture"
            accept="image/*"
            className="relative w-44 h-44"
            inputClassName="absolute bottom-1 right-1 z-10 border border-white/50"
            onUpload={(files) => setProfilePicture(files[0])}
          >
            {profilePicture ? (
              <Image
                src={URL.createObjectURL(profilePicture)}
                alt="Profile Picture"
                fill
                sizes="176px"
                className="rounded-full object-cover shadow-md"
              />
            ) : (
              <p>Upload</p>
            )}
          </FileUpload>
          <div className="flex flex-col gap-4">
            <ValidateUsernameField
              validationState={usernameValidationState}
              setValidityState={setUsernameValidationState}
            />

            <PasswordField
              fieldClassName="hidden"
              name="password"
              value={password}
            />
          </div>
        </div>

        <SubmitBtn disabled={usernameValidationState !== "valid"}>
          Signup
        </SubmitBtn>
      </AuthForm>
    </section>
  );
};

export default SignupStep4;
