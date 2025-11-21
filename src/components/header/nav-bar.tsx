"use client";

import { cn } from "@/lib/utils";
import { LucideIcon, MessageCircle, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  isCurrent: boolean;
  Icon: LucideIcon;
  children: React.ReactNode;
}

const NavLink = ({ href, isCurrent, Icon, children }: NavLinkProps) => {
  return (
    <Link
      href={href}
      data-current={isCurrent}
      className={cn(
        "group flex gap-2 items-center text-sm rounded-full text-theme py-2 px-4 transition-all duration-300",
        {
          "bg-theme border text-white font-semibold": isCurrent,
          "hover:bg-blue-50": !isCurrent,
        }
      )}
    >
      <Icon className="" size={20} />
      <p
        className={cn(
          "max-w-0 opacity-0 overflow-hidden transition-all duration-700 ease-in-out whitespace-nowrap",
          {
            "max-w-xs opacity-100": isCurrent,
            "group-hover:max-w-xs group-hover:opacity-100": !isCurrent,
          }
        )}
      >
        {children}
      </p>
    </Link>
  );
};

const NavBar = () => {
  const pathName = usePathname();

  return (
    <nav className="hidden sm:flex items-center gap-4 ">
      <NavLink
        href="/"
        Icon={MessageCircle}
        isCurrent={pathName === "/" || pathName.startsWith("/chat")}
      >
        Chat
      </NavLink>
      <NavLink
        href="/friends"
        Icon={Users}
        isCurrent={pathName.startsWith("/friends")}
      >
        Friends
      </NavLink>
      <NavLink
        href="/thoughts"
        Icon={MessageCircle}
        isCurrent={pathName.startsWith("/thoughts")}
      >
        Thoughts
      </NavLink>
    </nav>
  );
};

export default NavBar;
