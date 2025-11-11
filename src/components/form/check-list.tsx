import type { ValidationRequirement } from "@/utils/types/client.type";
import clsx from "clsx";
import { Check } from "lucide-react";

const RequirementCheckList = ({
  value,
  requirements,
}: {
  value: string;
  requirements: ValidationRequirement[];
}) => {
  return (
    <div className="bg-neutral-100 rounded-md p-2 flex flex-col gap-2">
      {requirements.map((requirement) => (
        <div key={requirement.message} className="flex gap-2 text-xs">
          <div
            className={clsx(
              "p-0.5 border border-black rounded-full w-fit h-fit transition-colors duration-200",
              { "bg-black text-white": requirement.test(value) }
            )}
          >
            <Check size={12} />
          </div>
          <p>{requirement.message}</p>
        </div>
      ))}
    </div>
  );
};

export default RequirementCheckList;
