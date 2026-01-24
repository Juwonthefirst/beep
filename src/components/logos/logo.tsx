import { cn } from "@/lib/utils";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"], weight: ["700"] });

const Logo = ({ className }: { className?: string }) => {
  return (
    <h1
      className={cn(
        geist.className,
        "font-bold text-3xl text-theme",
        className
      )}
    >
      Beep
    </h1>
  );
};

export default Logo;
