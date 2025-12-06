"use client";

import { cn } from "@/lib/utils";
import { LucideIcon, MessageCircle, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileLink from "./profile-link";

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
        "group flex gap-2 items-center text-sm rounded-full text-white p-2 transition-all duration-300 ",
        {
          " text-white font-semibold text-base": isCurrent,
        }
      )}
    >
      <Icon className="" size={20} />
      <p
        className={cn(
          "md:hidden max-w-0 opacity-0 overflow-hidden transition-all duration-700 ease-in-out whitespace-nowrap",
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
    <nav className="md:hidden fixed bottom-10 flex justify-between items-center gap-4 self-center w-9/10 max-w-sm bg-theme/90 backdrop-blur-md py-2 px-4 rounded-full">
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
      <ProfileLink />
    </nav>
  );
};

export default NavBar;
