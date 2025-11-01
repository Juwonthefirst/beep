"use client";

import { useState } from "react";
import SignupStep1 from "./signup-step-1";
import { AuthErrorResponse } from "@/utils/types";

const Page = () => {
  const [signupStep, setsignupStep] = useState<1 | 2 | 3>(1);
  const initialState: AuthErrorResponse = { error: "" };
  return (
    <>
      <div className="flex justify-between hidden">
        <p className="bg-black p-1 rounded-full">1</p>
        <p>2</p>
        <p>3</p>
      </div>
      {signupStep === 1 && (
        <SignupStep1
          initialState={initialState}
          onSuccess={() => setsignupStep(2)}
        />
      )}
    </>
  );
};

export default Page;
