import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import Logo from "./logo";
import Menu from "./menu";
import { SearchBarWithParam } from "./search-bar";
import Link from "next/link";
import CurrentPageListView from "./current-page-list-view";

const SideSection = ({ className }: { className?: string }) => {
  return (
    <section className={cn(className)}>
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex justify-between items-center">
          <Logo className="self-start ml-2" />
          <Menu>
            <Link className="flex gap-2 items-center" href="/chat/group">
              <Users className="text-theme " size={20} />
              <p>Create group</p>
            </Link>
          </Menu>
        </div>
        <SearchBarWithParam />
      </div>
      <CurrentPageListView />
    </section>
  );
};

export default SideSection;
