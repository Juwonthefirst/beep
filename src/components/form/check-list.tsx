import clsx from "clsx";
import { Check } from "lucide-react";

const CheckList = ({ list }: { list: Record<string, boolean> }) => {
  return (
    <div className="bg-neutral-100 rounded-md p-2 flex flex-col gap-2">
      {Object.keys(list).map((item) => (
        <div key={item} className="flex gap-2 text-xs">
          <div
            className={clsx(
              "p-0.5 border border-black rounded-full w-fit h-fit transition-colors duration-200",
              { "bg-black text-white": list[item] }
            )}
          >
            <Check size={12} />
          </div>
          <p>{item}</p>
        </div>
      ))}
    </div>
  );
};

export default CheckList;
