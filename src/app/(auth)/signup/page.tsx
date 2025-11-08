"use client";

import { useCallback, useState } from "react";
import SignupStep1 from "./signup-step-1";
import SignupStep2 from "./signup-step-2";
import SignupStep3 from "./signup-step-3";
import SignupStep4 from "./signup-step-4";

const Page = () => {
  const [signupStep, setsignupStep] = useState<1 | 2 | 3 | 4>(1);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const goToRequestOtp = () => setsignupStep(1);
  const goToVerifyOtp = () => setsignupStep(2);
  const goToCreatePassword = () => setsignupStep(3);
  const goToSignup = () => setsignupStep(4);

  const onSignupStep1Success = useCallback((email?: string) => {
    if (email) setUserEmail(email);
    else return;
    goToVerifyOtp();
  }, []);
  const onSignupStep2Success = useCallback(() => {
    goToCreatePassword();
  }, []);
  const onSignupStep3Success = useCallback((password?: string) => {
    if (password) setUserPassword(password);
    else return;
    goToSignup();
  }, []);

  return (
    <>
      {signupStep === 1 && <SignupStep1 onSuccess={onSignupStep1Success} />}
      {signupStep === 2 && (
        <SignupStep2 email={userEmail} onSuccess={onSignupStep2Success} />
      )}
      {signupStep === 3 && <SignupStep3 onSuccess={onSignupStep3Success} />}
      {signupStep === 4 && (
        <SignupStep4
          email={userEmail}
          password={userPassword}
          goToRequestOtp={goToRequestOtp}
          onSuccess={onSignupStep3Success}
        />
      )}
    </>
  );
};

export default Page;
