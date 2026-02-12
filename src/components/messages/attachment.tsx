import { cn } from "@/lib/utils";
import type { Attachment } from "@/utils/types/server-response.type";
import Image from "next/image";

interface AttachmentProps extends Attachment {
  message_id: string;
  className: string;
  imageSizes?: string;
  key: string | number;
}

const Attachment = ({
  message_id,
  kind,
  url,
  className,
  imageSizes,
}: AttachmentProps) => {
  return kind === "audio" ? (
    <audio src={url} controls className={className} />
  ) : (
    <div className={cn("relative", className)}>
      {kind === "image" ? (
        <Image
          src={url}
          alt={`attachment for message ${message_id}`}
          fill
          sizes={imageSizes}
          className="object-cover"
        />
      ) : kind === "video" ? (
        <video
          src={url}
          controls
          playsInline
          className="w-full h-full object-contain"
          preload="auto"
        />
      ) : (
        <p>Hello</p>
      )}
    </div>
  );
};

export default Attachment;
