"use client";
import { Camera } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

import FileUpload from "@/components/form/file-upload";
import Form, { FormError } from "@/components/form/form";
import { FormDescription, FormHeader } from "@/components/form/form-sematics";
import InputField from "@/components/form/input";
import SubmitBtn from "@/components/form/submit-btn";
import { createGroup } from "@/utils/actions";

const Page = () => {
  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(null);
  return (
    <section className="py-8 w-full h-dvh overflow-y-auto">
      <div className="flex flex-col gap-2 items-center  mb-8">
        <FormHeader className="text-2xl">Create a group</FormHeader>
        <FormDescription className="max-w-xs leading-5">
          create a group to start chatting with your friends at once
        </FormDescription>
      </div>
      <Form action={createGroup} onSuccess={() => {}}>
        <h2 className="font-medium  -mb-4">
          Upload your group&apos;s avatar (otional):
        </h2>
        <FileUpload
          name="avatar"
          accept="image/*"
          className="relative w-44 h-44 mx-auto"
          inputClassName="block p-2 bg-white text-black shadow-md rounded-full w-fit h-fit cursor-pointer hover:bg-neutral-200 transition-colors absolute bottom-1 right-1 z-10 border border-black/20"
          labelChildren={<Camera color="#000000" strokeWidth={2.5} size={24} />}
          onUpload={(files) =>
            setProfilePicturePreview(
              files && files[0] ? URL.createObjectURL(files[0]) : ""
            )
          }
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
        <InputField
          label="Description"
          name="description"
          placeholder="Enter your group description"
          required={false}
        />
        <SubmitBtn>Submit</SubmitBtn>
        <FormError />
      </Form>
    </section>
  );
};

export default Page;
