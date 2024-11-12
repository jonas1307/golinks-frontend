import React, { useState } from "react";
import { getYear } from "date-fns";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { UserProfile } from "../components/UserProfile";
import { LinkListing } from "../components/LinkListing";
import { LinkFilters } from "../components/LinkFilters";

const Home: NextPage = () => {
  const [metricRange, setMetricRange] = useState<string>("30");

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
        <LinkFilters
          metricRange={metricRange}
          setMetricRange={setMetricRange}
        />
        <LinkListing metricRange={metricRange} />
      </main>

      <footer className="h-8 flex items-center justify-center">
        <span className="text-xs md:text-base">
          &copy; 2021-{getYear(Date.now())} Jonas Amorim.
        </span>
      </footer>
    </div>
  );
};

export default Home;
