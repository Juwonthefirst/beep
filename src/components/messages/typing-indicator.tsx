import { cn } from "@/lib/utils";

const Dot = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "w-2 h-2 bg-black rounded-full animate-bounce duration-300",
      className
    )}
  ></div>
);

const TypingIndicator = () => {
  return (
    <div className="rounded-t-2xl w-fit p-2 bg-neutral-100 rounded-r-2xl rounded-l-[6px] text-black">
      <div className="flex gap-2 items-center">
        <Dot className="" />
        <Dot className="delay-75" />
        <Dot className="delay-150" />
      </div>
    </div>
  );
};

export default TypingIndicator;
