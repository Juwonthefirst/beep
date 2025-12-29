"use client";

import { cn } from "@/lib/utils";
import { LucideIcon, MessageCircle, PhoneCall, Users } from "lucide-react";
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
        "group flex md:flex-col gap-2 items-center text-sm md:text-xs rounded-full text-white p-2 md:p-3 transition-all duration-300 ",
        {
          " text-white font-semibold text-base": isCurrent,
        }
      )}
    >
      <Icon className="" size={22} />
      <p
        className={cn(
          "md:hidden max-w-0 opacity-0 overflow-hidden transition-all duration-700 ease-in-out whitespace-nowrap",
          {
            "max-w-xs opacity-100": isCurrent,
          }
        )}
      >
        {children}
      </p>
    </Link>
  );
};

export const NavBar = ({ className }: { className?: string }) => {
  const pathName = usePathname();

  return (
    <nav className={className}>
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
        href="/calls"
        Icon={PhoneCall}
        isCurrent={pathName.startsWith("/calls")}
      >
        Thoughts
      </NavLink>
      <ProfileLink />
    </nav>
  );
};

export const MobileNavBar = () => {
  const pathName = usePathname();

  return (
    !pathName.startsWith("/chat") && (
      <NavBar className="md:hidden fixed bg-black/5 bottom-10 flex justify-between items-center gap-4 w-9/10 max-w-sm backdrop-blur-sm backdrop-saturate-200 py-2 px-4 rounded-full *:text-black border border-black/10  *:data-[current=true]:text-theme" />
    )
  );
};
