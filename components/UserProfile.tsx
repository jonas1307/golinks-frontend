import React, { FunctionComponent } from "react";
import Image from "next/image";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { useUser } from "@auth0/nextjs-auth0";
import { toast } from "react-toastify";

export const UserProfile: FunctionComponent = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading)
    return (
      <div className="animate-spin rounded-full h-5 w-5 border-b border-gray-900"></div>
    );

  if (error) return <>{toast.error(`Sign in error: ${error.message}`)}</>;

  return user ? (
    <div className="flex items-center space-x-2 h-10">
      {user.picture && (
        <Image
          src={user.picture}
          alt={user.name || "User image"}
          width="40"
          height="40"
          className="rounded-full"
        />
      )}
      {/*eslint-disable-next-line @next/next/no-html-link-for-pages*/}
      <a href="/api/auth/logout" className="p-1">
        <FiLogOut size="18" />
      </a>
    </div>
  ) : (
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a
      href="/api/auth/login"
      className="flex items-center space-x-2 border border-gray-100 hover:border-gray-200 hover:shadow-sm rounded-md py-2 px-4"
    >
      <span>Login</span>
      <FiLogIn size="18" />
    </a>
  );
};
