import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GoogleOAuthProvider } from "@react-oauth/google";

import SignupStep4 from "./signup/steps/signup-step-4";

const AuthLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookieStore = await cookies();
  if (cookieStore.has("refresh_token")) {
    const requestedURLCookie = cookieStore.get("requested_url");
    //cookieStore.delete("requested_url");
    redirect(requestedURLCookie?.value || "/");
  } else if (
    cookieStore.has("signup_session_id") &&
    cookieStore.has("pending_google_signup")
  )
    return (
      <SignupStep4
        email="placeholder email"
        password="placeholder password"
        isGoogleLogin
      />
    );
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      {children}
    </GoogleOAuthProvider>
  );
};

export default AuthLayout;
