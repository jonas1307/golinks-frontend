import { FunctionComponent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiPlus } from "react-icons/fi";
import { UserProfile } from "./UserProfile";

interface IAppHeaderProps {
  user?: { picture?: string; name?: string } | null;
  isAdmin?: boolean;
  onNewLink?: () => void;
}

export const AppHeader: FunctionComponent<IAppHeaderProps> = ({ user, isAdmin, onNewLink }) => {
  const { pathname } = useRouter();

  return (
    <header className="h-16 flex items-center justify-between border-b border-gray-100 gap-4">
      <div className="flex items-center gap-6">
        <h1 className="font-bold text-4xl shrink-0">
          <Link href="/">go/links</Link>
        </h1>

        {isAdmin && (
          <nav className="flex items-center gap-1">
            <NavLink href="/dashboard" active={pathname === "/dashboard"}>Dashboard</NavLink>
            <NavLink href="/admin" active={pathname === "/admin"}>Admin</NavLink>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-3">
        {isAdmin && onNewLink && (
          <button
            onClick={onNewLink}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <FiPlus size={16} />
            <span className="hidden sm:inline">New link</span>
          </button>
        )}
        <UserProfile user={user} />
      </div>
    </header>
  );
};

const NavLink = ({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) => (
  <Link
    href={href}
    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
      active
        ? "text-teal-600 font-medium bg-teal-50"
        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
    }`}
  >
    {children}
  </Link>
);
