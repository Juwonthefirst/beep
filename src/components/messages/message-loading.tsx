import { LoaderCircle } from "lucide-react";

const MessageLoading = ({ className }: { className: string }) => (
  <div className={className}>
    <LoaderCircle className="animate-spin opacity-70" />
  </div>
);

export default MessageLoading;
