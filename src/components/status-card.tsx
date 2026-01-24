import { cn } from "@/lib/utils";
import { stringifyResponseErrorStatusCode } from "@/utils/helpers/client-helper";
import { CheckCircle, RadioTower, XCircle } from "lucide-react";

interface Props {
  status: number;
  message?: string;
  onRetry?: () => void;
  withRetry?: boolean;
  className?: string;
}

const StatusCard = ({
  status,
  message,
  onRetry,
  className = "",
  withRetry = false,
}: Props) => {
  const statusMessage =
    status === 400 ? message : stringifyResponseErrorStatusCode(status);
  const statusCodeGroup = Math.floor(status / 100);
  const iconColor =
    statusCodeGroup > 2
      ? "text-red-500 bg-red-500/20"
      : "text-green-500 bg-green-500/20";

  const StatusIcon =
    statusCodeGroup === 2
      ? CheckCircle
      : statusCodeGroup === 4
      ? XCircle
      : RadioTower;

  return (
    <div className={cn("flex flex-col items-center gap-2 mt-5", className)}>
      <StatusIcon className={cn("p-4 rounded-full", iconColor)} size="72" />
      <p className="text-center">{statusMessage}</p>
      {withRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="px-3 py-1 dark:bg-white dark:text-black bg-black text-white rounded-md font-medium text-sm"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default StatusCard;
