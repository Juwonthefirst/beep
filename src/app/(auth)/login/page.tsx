import Link from "next/link";

import { login } from "@/utils/actions";
import InputField, { PasswordField } from "@/components/form/input";
import AuthForm, { FormError } from "@/components/form/form";
import { FormDescription } from "@/components/form/form-sematics";
import Logo from "@/components/logo";
import GoogleLoginBtn from "@/components/auth-form/google-login-btn";
import SubmitBtn from "@/components/form/submit-btn";

const Page = () => {
  return (
    <AuthForm action={login} className="mt-20 px-4">
      <div className="flex flex-col gap-2 items-center self-center">
        <Logo className="text-4xl" />
        <p className="text-sm">
          <FormDescription>Don&apos;t have an account? </FormDescription>
          <Link
            className="text-theme hover:underline font-medium"
            href="/signup/"
          >
            Join now
          </Link>
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <InputField
          label="Username or Email"
          name="identification"
          placeholder="Enter your username or email"
        />
        <PasswordField
          label="Password"
          placeholder="Enter a password"
          name="password"
        />
      </div>
      <SubmitBtn>Login</SubmitBtn>
      <FormError />
      <div className="relative flex border-t border-black opacity-75 text-sm">
        <p className="absolute -top-3.5 left-9/20 text-center z-10 bg-white p-1">
          or
        </p>
      </div>
      <GoogleLoginBtn />
    </AuthForm>
  );
};

export default Page;
