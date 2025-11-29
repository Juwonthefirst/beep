import { cn } from "@/lib/utils";
import type { Attachment } from "@/utils/types/server-response.type";
import Image from "next/image";

interface AttachmentProps extends Attachment {
  message_id: string;
  className: string;
  imageSizes?: string;
}

const Attachment = ({
  message_id,
  file,
  content_type,
  className,
  imageSizes,
}: AttachmentProps) => {
  return (
    <div className={cn("relative", className)}>
      {content_type.startsWith("image/") ? (
        <Image
          src={file}
          alt={`attachment for message ${message_id}`}
          fill
          sizes={imageSizes}
          className="object-cover"
        />
      ) : content_type.startsWith("video/") ? (
        <video
          src={file}
          controls
          playsInline
          className="w-full h-full"
          preload="metadata"
        />
      ) : (
        <p>Hello</p>
      )}
    </div>
  );
};

export default Attachment;
