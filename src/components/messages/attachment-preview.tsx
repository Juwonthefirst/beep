import { Play } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

interface Props {
  attachment: File;
  onRemove: () => void;
}

const AttachmentPreview = ({ attachment, onRemove }: Props) => {
  const previewURL = useMemo(
    () => URL.createObjectURL(attachment),
    [attachment]
  );

  return (
    <div className="w-18 h-18 rounded-md relative overflow-hidden shrink-0 shadow-md">
      <button
        className="absolute top-0 right-0 w-4 h-4 font-semibold bg-white rounded-full text-black z-10 text-xs shadow-ld"
        type="button"
        onClick={onRemove}
      >
        X
      </button>
      {attachment.type.startsWith("image/") ? (
        <Image src={previewURL} alt="attachment preview" fill />
      ) : attachment.type.startsWith("video/") ? (
        <div className="w-full h-full relative flex items-center justify-center">
          <Play className="opacity-70 text-white fill-white shadow-md" />
          <video
            src={previewURL}
            playsInline
            className="w-full h-full object-cover absolute -z-10"
          />
        </div>
      ) : (
        <div className="bg-theme/50 w-full h-full"></div>
      )}
    </div>
  );
};

export default AttachmentPreview;
