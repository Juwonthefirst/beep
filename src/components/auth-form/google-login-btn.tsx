"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { LoaderCircle } from "lucide-react";
import { use, useState } from "react";

import { cn } from "@/lib/utils";
import { FormContext } from "../form/form";
import { googleAuthenicate } from "@/utils/actions";

const GoogleLoginBtn = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const formControls = use(FormContext);

  const setLoginState = (state: boolean) => {
    setIsAuthenticating(state);
    formControls.setIsDisabled?.(state);
  };

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (response) => {
      const status = await googleAuthenicate(response.code);
      console.log(status);
      if ("error" in status) formControls.setError?.(status.error);
      setLoginState(false);
    },

    onError: (errorResponse) => {
      formControls.setError?.(
        errorResponse.error_description || "Google login failed"
      );
      setLoginState(false);
    },

    onNonOAuthError: (errorResponse) => {
      console.error("Non OAuth Error:", errorResponse);
      formControls.setError?.("Google login failed");
      setLoginState(false);
    },
  });

  return (
    <button
      type="button"
      onClick={() => {
        login();
        setLoginState(true);
      }}
      disabled={formControls.isDisabled}
      className={cn(
        "flex gap-2 bg-orange-500 rounded-md py-1.5 px-3 text-white text-sm items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed",
        { "cursor-wait!": isAuthenticating }
      )}
    >
      {isAuthenticating ? (
        <LoaderCircle className="animate-spin" size={18} />
      ) : (
        "Continue with Google"
      )}
    </button>
  );
};

export default GoogleLoginBtn;
