import React, { useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { getYear } from "date-fns";
import { auth0 } from "../lib/auth0";
import { hasPermission } from "../utils/hasPermission";
import { AppHeader } from "../components/AppHeader";

interface PageProps {
  user?: { picture?: string; name?: string } | null;
}

const Admin: NextPage<PageProps> = ({ user }) => {
  const [backfilling, setBackfilling] = useState(false);
  const [result, setResult] = useState<{ updated: number; skipped: number } | null>(null);
  const [error, setError] = useState(false);

  const handleBackfill = async () => {
    setBackfilling(true);
    setResult(null);
    setError(false);
    try {
      const res = await fetch("/api/dashboard/backfill-ua", { method: "POST" });
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch {
      setError(true);
    } finally {
      setBackfilling(false);
    }
  };

  return (
    <div className="container mx-auto px-2 xl:px-0">
      <Head>
        <title>go/links — admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppHeader user={user} isAdmin={true} />

      <main className="w-full py-6 space-y-6">
        <section className="border border-gray-100 rounded-lg p-4 shadow-sm space-y-3 max-w-lg">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            User Agent backfill
          </h2>
          <p className="text-sm text-gray-500">
            Parses the stored User-Agent string on existing metric records and populates the
            device, browser and OS fields. Only affects records that have not been parsed yet.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackfill}
              disabled={backfilling}
              className="px-4 py-2 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 disabled:opacity-50"
            >
              {backfilling ? "Running…" : "Run backfill"}
            </button>
            {result && (
              <span className="text-sm text-gray-500">
                {result.updated} updated, {result.skipped} skipped
              </span>
            )}
            {error && (
              <span className="text-sm text-red-500">Backfill failed.</span>
            )}
          </div>
        </section>
      </main>

      <footer className="h-8 flex items-center justify-center">
        <span className="text-xs md:text-base">
          &copy; 2021-{getYear(Date.now())} Jonas Amorim.
        </span>
      </footer>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  try {
    const { token } = await auth0.getAccessToken(context.req, context.res);
    const session = await auth0.getSession(context.req);

    if (!hasPermission(token || "", "golinks:admin")) {
      return { redirect: { destination: "/", permanent: false } };
    }

    return { props: { user: session?.user ?? null } };
  } catch {
    return { redirect: { destination: "/auth/login?returnTo=/admin", permanent: false } };
  }
};

export default Admin;
