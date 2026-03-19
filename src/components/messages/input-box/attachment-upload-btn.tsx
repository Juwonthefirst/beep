import FileUpload from "@/components/form/file-upload";
import {
  onAttachmentUploadComplete,
  onAttachmentUploadError,
  uploadAttachment,
} from "@/utils/helpers/client-helpers/attachments.helper";
import { AttachmentState } from "@/utils/types/client.type";
import { UUID } from "crypto";
import { Paperclip } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { v4 as uuidV4 } from "uuid";

interface Props {
  setAttachments: Dispatch<SetStateAction<AttachmentState[]>>;
  iconSize: number;
}

const AttachmentUploadBtn = ({ setAttachments, iconSize }: Props) => {
  return (
    <FileUpload
      inputClassName=" *:[&:hover,&:active]:text-theme *:[&:hover,&:active]:scale-110 *:rounded-full *:transition-all"
      onUpload={(files) => {
        const newAttachments: AttachmentState[] = [];
        files?.forEach((file) => {
          uploadAttachment(
            file,
            onAttachmentUploadComplete(setAttachments, file),
            onAttachmentUploadError(setAttachments, file),
          );
          newAttachments.push({
            file,
            uploadStatus: "pending",
            uuid: uuidV4() as UUID,
          });
        });
        setAttachments((prev) => [...newAttachments, ...prev]);
      }}
      labelChildren={<Paperclip size={iconSize} />}
      multiple
    />
  );
};

export default AttachmentUploadBtn;
