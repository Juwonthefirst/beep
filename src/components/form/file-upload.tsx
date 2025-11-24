import { cn } from "@/lib/utils";
import { Camera } from "lucide-react";

interface Props {
  name: string;
  className?: string;
  inputClassName?: string;
  onUpload?: (files: File[] | null) => void;
  accept?: string;
  multiple?: boolean;
  required?: boolean;
  disabled?: boolean;
  maxFiles?: number;
  iconSize?: number;
  children?: React.ReactNode;
}

const FileUpload = ({
  name,
  onUpload,
  className,
  inputClassName,
  accept,
  multiple = false,
  required,
  maxFiles,
  children,
  iconSize = 24,
}: Props) => {
  return (
    <div
      className={className}
      onDrop={(event) => {
        event.preventDefault();
        const uploadedFiles = [...event.dataTransfer.files];
        onUpload?.(uploadedFiles.slice(0, maxFiles));
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      {children}
      <label
        className={cn(
          "block p-2 bg-white text-black shadow-md rounded-full w-fit h-fit cursor-pointer hover:bg-neutral-200 transition-colors  ",
          inputClassName
        )}
        htmlFor={name}
      >
        <Camera color="#000000" strokeWidth={2.5} size={iconSize} />
      </label>
      <input
        id={name}
        multiple={multiple}
        className="hidden"
        accept={accept}
        type="file"
        required={required}
        name={name}
        onChange={(event) => {
          event.preventDefault();
          if (event.target.files) {
            const uploadedFiles = [...event.target.files];
            onUpload?.(uploadedFiles.slice(0, maxFiles));
          } else onUpload?.(null);
        }}
      />
    </div>
  );
};

export default FileUpload;
