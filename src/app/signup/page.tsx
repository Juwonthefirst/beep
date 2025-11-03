"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SignupStep1 from "./signup-step-1";
import SignupStep2 from "./signup-step-2";

const Page = () => {
  const [signupStep, setsignupStep] = useState<1 | 2 | 3>(2);
  const emailRef = useRef("");
  const onSignupStep1Success = useCallback(() => {
    setsignupStep(2);
  }, []);
  const onSignupStep2Success = useCallback(() => setsignupStep(3), []);
  //const onSignupStep1Success = useCallback(() => setsignupStep(2), []);

  return (
    <>
      <div className="flex justify-between hidden">
        <p className="bg-black p-1 rounded-full">1</p>
        <p>2</p>
        <p>3</p>
      </div>
      {signupStep === 1 && (
        <SignupStep1 emailRef={emailRef} onSuccess={onSignupStep1Success} />
      )}
      {signupStep === 2 && (
        <SignupStep2 emailRef={emailRef} onSuccess={onSignupStep2Success} />
      )}
    </>
  );
};

export default Page;
