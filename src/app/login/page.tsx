"use client";
import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";

import { login } from "@/utils/actions";
import type { AuthErrorResponse } from "@/utils/types";
import InputField, { PasswordField } from "@/components/form/input";
import { redirect } from "next/navigation";
import Link from "next/link";
import SubmitBtn from "@/components/form/submit-btn";

const Page = () => {
  const initialState: AuthErrorResponse = { error: "" };
  const [state, formAction, isPending] = useActionState(login, initialState);
  if ("user" in state) redirect("/");
  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 max-w-3xs mx-auto mt-24 text-black"
    >
      <div className="flex flex-col gap-2 items-center self-center">
        <h1 className="text-4xl font-medium">Beep</h1>
        <p className="opacity-70 text-sm">
          Don&apos;t have an account?{" "}
          <Link className="text-blue-600 underline" href="/signup/">
            join now
          </Link>
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <InputField
          label="Username or Email"
          name="identification"
          placeholder="Enter your username or email"
          error={"error" in state ? state.error : ""}
        />
        <PasswordField
          label="Password"
          placeholder="Enter a password"
          name="password"
        />
      </div>
      <SubmitBtn disabled={isPending}>
        {isPending ? <LoaderCircle className="animate-spin" /> : "Login"}
      </SubmitBtn>
      {/* <p>or</p>
      <button
        type="button"
        className="bg-amber-500 px-3 py-1.5 rounded-lg text-white"
      >
        Continue with Google
      </button> */}
    </form>
  );
};

export default Page;
