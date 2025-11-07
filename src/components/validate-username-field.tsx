"use client";

import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { Check, LoaderCircle, X } from "lucide-react";
import axios, { isAxiosError } from "axios";

import InputField from "./form/input";
import type {
  AuthErrorResponse,
  UsernameExist,
} from "@/utils/types/server-response.types";
import type { ValidationState } from "@/utils/types/client.types";

interface Props {
  validationState: ValidationState;
  setValidityState: Dispatch<SetStateAction<ValidationState>>;
}

const ValidateUsernameField = ({
  validationState,
  setValidityState,
}: Props) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const validateUsername = async (username: string, signal: AbortSignal) => {
    try {
      const response = await axios.get<UsernameExist>(
        `/api/username/${username}/exists/`,
        { signal }
      );
      const data = response.data;
      if (("exists" in data && data.exists) || "error" in data) {
        setError(
          "error" in data
            ? data.error
            : "Sorry looks like this username is already taken"
        );
        return "invalid";
      }

      setError("");
      return "valid";
    } catch (e) {
      if (isAxiosError<AuthErrorResponse>(e)) {
        const errorMessage = e.response?.data?.error;
        if (errorMessage) {
          setError(errorMessage);
          return "invalid";
        }
      }
      setError("");
      return "idle";
    }
  };

  useEffect(() => {
    setValidityState("idle");
    if (username.length < 3 || username.length > 32) return;
    const controller = new AbortController();
    const timeoutKey = setTimeout(() => {
      setValidityState("loading");
      (async () => {
        const state = await validateUsername(username, controller.signal);
        setValidityState(state);
      })();
    }, 300);

    return () => {
      clearTimeout(timeoutKey);
      controller.abort();
    };
  }, [username, setValidityState]);

  return (
    <div className="relative">
      <InputField
        label="Username"
        name="username"
        placeholder="Enter your new username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        error={error}
        validation={(username) => {
          if (!username) return "Enter a username";
          if (username.length < 3)
            return "Username should be at least 3 characters";
          if (username.length > 36)
            return "Username should not be more than 36 characters";
        }}
        elementInField={
          validationState === "loading" ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : validationState === "invalid" ? (
            <X size={20} className="text-red-500" />
          ) : validationState === "valid" ? (
            <Check size={20} className="text-green-500" />
          ) : undefined
        }
      />
    </div>
  );
};

export default ValidateUsernameField;
