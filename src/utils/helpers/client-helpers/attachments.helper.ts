import { createAttachment, deleteAttachment } from "@/utils/actions";
import { uploadFileToUrl, withRetry } from "./generics.helper";
import { Attachment } from "@/utils/types/server-response.type";
import { isAxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";
import { AttachmentState } from "@/utils/types/client.type";

export const removeAttachment = async (
  attachmentIds: number[],
  asBeacon = false,
) => {
  if (asBeacon)
    return navigator.sendBeacon(
      `/api/upload/attachment/delete`,
      JSON.stringify({ attachment_ids: attachmentIds }),
    );

  await withRetry({
    func: () =>
      deleteAttachment(attachmentIds).then((res) => {
        if (res.status === "error") throw new Error(res.error);
      }),
  });
};
export const uploadAttachment = async (
  file: File,
  onComplete: (attachmentId: number) => void,
  onError: (errorMessage: string) => void,
) => {
  try {
    const response = await withRetry<Attachment>({
      func: () =>
        createAttachment(file.name, file.size, file.type).then((res) => {
          if (res.status === "success") return res.data;
          throw new Error(
            res.status === "error" ? res.error : "Something went wrong",
          );
        }),
    });
    try {
      (async () => {
        const uploadResponse = await uploadFileToUrl(
          file,
          response.upload_url!,
        );
        if (uploadResponse.status > 299)
          throw new Error("Failed to upload file");
        onComplete(response.id);
      })();
    } catch (e) {
      if (isAxiosError(e)) {
        await withRetry({
          func: () =>
            deleteAttachment([response.id]).then((res) => {
              if (res.status === "error") throw new Error(res.error);
            }),
        });
      }

      throw new Error();
    }
  } catch {
    onError("Something went wrong, try again later");
  }
};

export const onAttachmentUploadComplete = (
  setAttachments: Dispatch<SetStateAction<AttachmentState[]>>,
  file: File,
) => {
  return (attachmentId: number) => {
    setAttachments((prev) =>
      prev.map((attachment) => {
        if (attachment.file === file) {
          return {
            ...attachment,
            uploadStatus: "success",
            attachmentId,
          };
        }
        return attachment;
      }),
    );
  };
};

export const onAttachmentUploadError = (
  setAttachments: Dispatch<SetStateAction<AttachmentState[]>>,
  file: File,
) => {
  return (errorMessage: string) => {
    setAttachments((prev) =>
      prev.map((attachment) => {
        if (attachment.file === file) {
          return {
            ...attachment,
            uploadStatus: "error",
            errorMessage,
          };
        }
        return attachment;
      }),
    );
  };
};

export const getAttachmentsId = (attachments: AttachmentState[]) => {
  const attachmentIds: number[] = [];
  attachments.forEach((attachment) => {
    if (attachment.uploadStatus === "success") {
      attachmentIds.push(attachment.attachmentId);
    }
  });
  return attachmentIds;
};
