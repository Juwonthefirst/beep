"use client";
import { Camera } from "lucide-react";
import { useMemo, useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";

import FileUpload from "@/components/form/file-upload";
import Form, { FormError } from "@/components/form/form";
import { FormDescription, FormHeader } from "@/components/form/form-sematics";
import InputField from "@/components/form/input";
import SubmitBtn from "@/components/form/submit-btn";
import { createGroup } from "@/utils/actions";
import { uploadFileToUrl } from "@/utils/helpers/client-helper";
import { isGroupCreateResponseData } from "@/utils/types/server-response.type";
import { chatListQueryOption } from "@/utils/queryOptions";
import TextArea from "@/components/form/text-area";

const Page = () => {
  const [avatar, setAvatar] = useState<File | null>(null);
  const profilePicturePreview = useMemo(
    () => avatar && URL.createObjectURL(avatar),
    [avatar]
  );
  const queryClient = useQueryClient();
  return (
    <section className="py-8 flex-1 h-dvh overflow-y-auto">
      <div className="flex flex-col gap-2 items-center  mb-8">
        <FormHeader className="text-2xl">Create a group</FormHeader>
        <FormDescription className="max-w-xs leading-5">
          create a group to start chatting with your friends at once
        </FormDescription>
      </div>
      <Form
        onSuccess={(data) => {
          if (!isGroupCreateResponseData(data)) return;
          if (avatar) uploadFileToUrl(avatar, data.avatar_upload_link);
          queryClient.invalidateQueries({
            queryKey: chatListQueryOption().queryKey,
            exact: true,
          });
          redirect(`/chat/${data.room_name}/members/add`);
        }}
        action={createGroup}
      >
        <h2 className="font-medium -mb-4">
          Upload your group&apos;s avatar (otional):
        </h2>
        <FileUpload
          accept="image/*"
          className="relative w-44 h-44 mx-auto"
          inputClassName="block p-2 bg-white text-black shadow-md rounded-full w-fit h-fit cursor-pointer hover:bg-neutral-200 transition-colors absolute bottom-1 right-1 z-10 border border-black/20"
          labelChildren={<Camera color="#000000" strokeWidth={2.5} size={24} />}
          onUpload={(files) => setAvatar(files && files[0])}
        >
          <Image
            src={profilePicturePreview || "/default.webp"}
            alt="Profile Picture"
            fill
            sizes="176px"
            className="rounded-full object-cover shadow-lg"
          />
        </FileUpload>
        <InputField
          label="Name"
          name="name"
          placeholder="Enter your group name"
        />
        <TextArea
          label="Description"
          maxLength={200}
          name="description"
          placeholder="Enter your group description"
          required={false}
          className="max-h-18 text-sm transistion-all duration-200  rounded-md py-2 px-4 bg-neutral-100 shadow-xs has-focus:bg-white has-focus:ring-4 has-focus:ring-offset-2 has-focus:outline-2  ring-neutral-500/20 has-focus:outline-black text-black *:placeholder:text-sm"
        />
        <SubmitBtn>Submit</SubmitBtn>
        <FormError />
      </Form>
    </section>
  );
};

export default Page;
