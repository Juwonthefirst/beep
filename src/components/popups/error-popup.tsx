import type { ErrorResponse } from "@/utils/types/server-response.type";
import StatusCard from "../status-card";
import InfoPopup from "./info-popup";
import { isAxiosError } from "axios";

interface Props {
  error: Error | null;
  clearError: () => void;
}

const ErrorPopup = ({ error, clearError }: Props) => {
  const status =
    isAxiosError(error) && error.response ? error.response.status : 600;
  const errorMessage =
    isAxiosError<ErrorResponse>(error) && error.response
      ? error.response.data.error
      : "An unexpected error occurred";
  return (
    error && (
      <InfoPopup open onClose={clearError}>
        <StatusCard status={status} message={errorMessage} />
      </InfoPopup>
    )
  );
};

export default ErrorPopup;
