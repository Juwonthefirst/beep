import { useState, type ChangeEventHandler, type RefObject } from "react";
import { Eye, EyeClosed } from "lucide-react";
import clsx from "clsx";

const className =
  "text-sm transistion-all duration-200  rounded-lg py-1.5 px-3  outline has-focus:ring-3 has-focus:ring-offset-2 has-focus:outline-2 ring-black/20 outline-black/100 text-black placeholder:text-sm";

interface InputFieldPropType {
  required?: boolean;
  label?: string;

  name?: string;
  placeholder?: string;
  ref?: RefObject<HTMLInputElement>;
  error?: string;
  inputType?: string;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const InputField = ({
  ref,
  label = "",
  name,
  placeholder,
  inputType = "text",
  value,
  onChange,
  required = true,
  error,
}: InputFieldPropType) => {
  return (
    <div className="flex flex-col gap-2 ">
      <label className="font-medium" htmlFor={label + "-input"}>
        {label}
      </label>
      <div
        className={clsx(
          className,
          "flex",
          error ? "outline-2 outline-red-500!" : ""
        )}
      >
        <input
          ref={ref}
          name={name || label}
          id={label + "-input"}
          className="focus:outline-0 grow"
          type={inputType}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        />
      </div>
      {error && (
        <p className=" text-red-500 text-xs text-center -mt-1">{error}</p>
      )}
    </div>
  );
};

export const PasswordField = ({
  ref,
  label = "",
  name,
  placeholder,
  value,
  onChange,
  required = true,
  error,
}: InputFieldPropType) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium" htmlFor={label + "-input"}>
        {label}
      </label>

      <div
        className={clsx(className, "flex items-center gap-2", {
          "outline-2 outline-red-500!": error,
        })}
      >
        <input
          ref={ref}
          id={label + "-input"}
          name={name || label}
          value={value}
          className="focus:outline-0 grow"
          type={isVisible ? "text" : "password"}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        />
        <button
          className=""
          type="button"
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? <Eye size={18} /> : <EyeClosed size={18} />}
        </button>
      </div>
      {error && (
        <p className=" text-red-500 text-sm text-center -mt-1">{error}</p>
      )}
    </div>
  );
};

export default InputField;
