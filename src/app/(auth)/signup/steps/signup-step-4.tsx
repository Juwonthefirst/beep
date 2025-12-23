"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import FileUpload from "@/components/form/file-upload";
import AuthForm, { FormError } from "@/components/form/form";
import { FormDescription, FormHeader } from "@/components/form/form-sematics";
import { PasswordField } from "@/components/form/input";
import ValidateUsernameField from "@/components/auth-form/validate-username-field";
import { signup } from "@/utils/actions";
import type {
  SignupStepsProps,
  ValidationState,
} from "@/utils/types/client.type";
import SubmitBtn from "@/components/form/submit-btn";
import { Camera } from "lucide-react";
import { isSignupResponseData } from "@/utils/types/server-response.type";
import { uploadFileToUrl } from "@/utils/helpers/client-helper";

interface Props {
  isGoogleLogin?: boolean;
  password: string;
  goToRequestOtp?: () => void;
}

const SignupStep4 = ({
  email,
  password,
  goToRequestOtp,
  isGoogleLogin = false,
}: Omit<SignupStepsProps, "onSuccess"> & Props) => {
  const [usernameValidationState, setUsernameValidationState] =
    useState<ValidationState>("idle");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const profilePicturePreview = useMemo(
    () => profilePicture && URL.createObjectURL(profilePicture),
    [profilePicture]
  );
  return (
    <section className="mt-18 mx-auto">
      <div className="flex flex-col gap-1 items-center text-sm text-center">
        <FormHeader>Almost done</FormHeader>
        <FormDescription>Finish creating your account</FormDescription>
        <p className=" text-sm">
          {!isGoogleLogin && (
            <>
              <span className="font-medium mr-1">{email}</span>
              <FormDescription>not you?</FormDescription>
              <button
                className="ml-1 text-theme hover:underline"
                onClick={goToRequestOtp}
              >
                Change email
              </button>
            </>
          )}
        </p>
      </div>

      <AuthForm
        className="mt-6 items-center px-0 gap-4"
        action={async (prevState, formData) => {
          const response = await signup(prevState, formData);
          if (
            response.status === "success" &&
            isSignupResponseData(response.data) &&
            profilePicture
          ) {
            alert("Uploading profile picture");
            uploadFileToUrl(profilePicture, response.data.avatar_upload_link);
          }
          return response;
        }}
      >
        <section className="mb-2">
          <h2 className="font-medium text-lg mb-4">
            Upload your profile picture:
          </h2>
          <FileUpload
            accept="image/*"
            className="relative w-44 h-44 mx-auto"
            inputClassName="block p-2 bg-white text-black shadow-md rounded-full w-fit h-fit cursor-pointer hover:bg-neutral-200 transition-colors absolute bottom-1 right-1 z-10 border border-black/20"
            labelChildren={
              <Camera color="#000000" strokeWidth={2.5} size={24} />
            }
            onUpload={(files) => setProfilePicture(files && files[0])}
          >
            <Image
              src={profilePicturePreview || "/default.webp"}
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
          required={false}
          value={password}
        />

        <SubmitBtn disabled={usernameValidationState !== "valid"}>
          Signup
        </SubmitBtn>
        <FormError />
      </AuthForm>
    </section>
  );
};

export default SignupStep4;
