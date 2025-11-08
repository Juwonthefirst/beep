import FileUpload from "@/components/form/file-upload";
import AuthForm from "@/components/form/form";
import {
  FormDescription,
  FormHeader,
  SubmitBtn,
} from "@/components/form/form-sematics";
import { PasswordField } from "@/components/form/input";
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
}

const SignupStep4 = ({
  email,
  password,

  goToRequestOtp,
  onSuccess,
}: Props) => {
  const [usernameValidationState, setUsernameValidationState] =
    useState<ValidationState>("idle");
  const [profilePicturePreview, setProfilePicturePreview] =
    useState("/default.jpg");

  return (
    <section className="mt-18 mx-auto">
      <div className="flex flex-col gap-1 items-center text-sm text-center">
        <FormHeader>Almost done</FormHeader>
        <FormDescription>Finish creating your account</FormDescription>
        <p className=" text-sm">
          {/* <FormDescription>Signing up with</FormDescription> */}
          <span className="font-medium mr-1">{email}</span>
          <FormDescription>not you?</FormDescription>
          <button
            className="ml-1 text-blue-600 hover:underline"
            onClick={goToRequestOtp}
          >
            Change email
          </button>
        </p>
      </div>

      <AuthForm
        className="mt-6 items-center px-0 gap-4"
        action={signup}
        onSuccess={onSuccess}
      >
        <section className="mb-2">
          <h2 className="font-medium text-lg mb-4">
            Upload your profile picture:
          </h2>
          <FileUpload
            name="profile_picture"
            accept="image/*"
            className="relative w-44 h-44 mx-auto"
            inputClassName="absolute bottom-1 right-1 z-10 border border-black/20"
            onUpload={(files) =>
              setProfilePicturePreview(URL.createObjectURL(files[0]))
            }
          >
            <Image
              src={profilePicturePreview}
              alt="Profile Picture"
              fill
              sizes="176px"
              className="rounded-full object-cover shadow-lg"
            />
          </FileUpload>
        </section>

        <ValidateUsernameField
          validationState={usernameValidationState}
          setValidityState={setUsernameValidationState}
        />

        <PasswordField
          fieldClassName="hidden"
          name="password"
          value={password}
        />

        <SubmitBtn disabled={usernameValidationState !== "valid"}>
          Signup
        </SubmitBtn>
      </AuthForm>
    </section>
  );
};

export default SignupStep4;
