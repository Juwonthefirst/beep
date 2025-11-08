import { login } from "@/utils/actions";
import InputField, { PasswordField } from "@/components/form/input";
import Link from "next/link";
import AuthForm from "@/components/form/form";
import {
  FormDescription,
  FormHeader,
  SubmitBtn,
} from "@/components/form/form-sematics";

const Page = () => {
  return (
    <AuthForm action={login} className="mt-20 px-4">
      <div className="flex flex-col gap-2 items-center self-center">
        <FormHeader className="text-4xl">Beep</FormHeader>
        <p className="text-sm">
          <FormDescription>Don&apos;t have an account? </FormDescription>
          <Link
            className="text-blue-600 hover:underline font-medium"
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
      {/* <p>or</p>
      <button
        type="button"
        className="bg-amber-500 px-3 py-1.5 rounded-lg text-white"
      >
        Continue with Google
      </button> */}
    </AuthForm>
  );
};

export default Page;
