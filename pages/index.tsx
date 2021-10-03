import React from "react";
import { getYear } from "date-fns";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ActivityChart } from "../components/ActivityChart";
import { UserProfile } from "../components/UserProfile";

const Home: NextPage = () => {
  return (
    <div className="container mx-auto px-2 xl:px-0">
      <Head>
        <title>go/links</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="h-16 flex justify-between items-center border-b border-gray-100">
        <h1 className="font-bold text-4xl">
          <Link href="/">go/links</Link>
        </h1>

        <div className="flex justify-end">
          <UserProfile />
        </div>
      </header>

      <main className="w-full py-8 space-y-10">
        <div className="w-5/6 lg:w-1/2 px-4 py-2 m-auto border border-gray-200 rounded-md md:flex md:justify-between shadow-md">
          <div className="grid auto-rows-min gap-2 lg:gap-4 h-32 md:flex-1">
            <div className="whitespace-nowrap overflow-ellipsis overflow-hidden">
              <h2 className="text-2xl font-bold">
                <a href="/g">go/g</a>
              </h2>
              <a href="https://www.google.com/" className="text-xs">
                https://www.google.com
              </a>
            </div>
            <div className="self-center">
              <p className="text-sm font-medium">Google</p>
            </div>
            <div className="items-start self-end">
              <p className="text-xs">
                Total Usage: <span className="font-bold">8</span>
              </p>
            </div>
          </div>

          <div className="border-t mt-2 pt-2 md:border-t-0 md:mt-0 md:pt-0 md:border-l md:pl-2 md:ml-2 md:w-56 border-gray-200 flex items-center justify-center">
            <ActivityChart minHeight="128px" />
          </div>
        </div>

        <div className="w-5/6 lg:w-1/2 px-4 py-2 m-auto border border-gray-200 rounded-md md:flex md:justify-between shadow-md">
          <div className="grid auto-rows-min gap-2 lg:gap-4 h-32 md:flex-1">
            <div className="whitespace-nowrap overflow-ellipsis overflow-hidden">
              <h2 className="text-2xl font-bold">
                <a href="/g">go/g</a>
              </h2>
              <a href="https://www.google.com/" className="text-xs">
                https://www.google.com
              </a>
            </div>
            <div className="self-center">
              <p className="text-sm font-medium">Google</p>
            </div>
            <div className="items-start self-end">
              <p className="text-xs">
                Total Usage: <span className="font-bold">8</span>
              </p>
            </div>
          </div>

          <div className="border-t mt-2 pt-2 md:border-t-0 md:mt-0 md:pt-0 md:border-l md:pl-2 md:ml-2 md:w-56 border-gray-200 flex items-center justify-center">
            <ActivityChart minHeight="128px" />
          </div>
        </div>
      </main>

      <footer className="h-8 flex items-center justify-center">
        <span className="text-xs md:text-base">
          &copy; {getYear(Date.now())} Jonas Amorim.
        </span>
      </footer>
    </div>
  );
};

export default Home;
