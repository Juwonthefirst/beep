interface Props {
  name?: string;
  className?: string;
  inputClassName?: string;
  onUpload?: (files: File[] | null) => void;
  accept?: string;
  multiple?: boolean;
  required?: boolean;
  disabled?: boolean;
  maxFiles?: number;
  children?: React.ReactNode;
  labelChildren?: React.ReactNode;
}

const FileUpload = ({
  name,
  onUpload,
  className,
  inputClassName,
  accept,
  multiple = false,
  required = false,
  maxFiles,
  children,
  labelChildren,
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
      <label className={inputClassName} htmlFor={name || "file-input"}>
        {labelChildren}
      </label>
      <input
        id={name || "file-input"}
        multiple={multiple}
        className="hidden"
        accept={accept}
        type="file"
        value={""}
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
