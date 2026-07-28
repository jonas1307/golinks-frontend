import React, { useCallback, useEffect, useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { format, parseISO } from "date-fns";
import { auth0 } from "../lib/auth0";
import { AppHeader } from "../components/AppHeader";
import { LinkCombobox } from "../components/LinkCombobox";
import { SelectComponent } from "../components/SelectComponent";
import { ILink } from "../interfaces/ILink";
import { hasPermission } from "../utils/hasPermission";

interface PageProps {
  user?: { picture?: string; name?: string } | null;
  isAdmin?: boolean;
  today: string;
  sevenDaysAgo: string;
}

interface AccessLog {
  createdAt: string;
  linkId: string;
  slug: string;
  url: string;
  browser: string | null;
  os: string | null;
  deviceType: string | null;
  deviceModel: string | null;
  referrer: string | null;
  isBot: boolean;
}

interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

const BOT_OPTIONS = [
  { value: "all", label: "All" },
  { value: "human", label: "Human only" },
  { value: "bots", label: "Bots only" },
];

const LogsPage: NextPage<PageProps> = ({ user, isAdmin, today, sevenDaysAgo }) => {
  const [linkId, setLinkId] = useState("");
  const [from, setFrom] = useState(sevenDaysAgo);
  const [to, setTo] = useState(today);
  const [botFilter, setBotFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [links, setLinks] = useState<ILink[]>([]);
  const [result, setResult] = useState<PagedResult<AccessLog> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/links?pageSize=50")
      .then((r) => r.json())
      .then((p) => setLinks(p.items ?? []))
      .catch(() => {});
  }, []);

  const fetchLogs = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ pageNumber: String(page), pageSize: "50" });
    if (linkId) params.set("linkId", linkId);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (botFilter !== "all") params.set("botFilter", botFilter);

    fetch(`/api/logs?${params}`)
      .then((r) => r.json())
      .then((d) => setResult(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [linkId, from, to, botFilter, page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
  };

  return (
    <div className="container mx-auto px-2 xl:px-0">
      <Head>
        <title>go/links — access logs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppHeader user={user} isAdmin={isAdmin} />

      <main className="w-full py-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1">
            <label className="text-sm font-medium text-gray-700">From:</label>
            <input
              type="date"
              value={from}
              onChange={(e) => { setFrom(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600"
            />
          </div>
          <div className="flex items-center gap-1">
            <label className="text-sm font-medium text-gray-700">To:</label>
            <input
              type="date"
              value={to}
              onChange={(e) => { setTo(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600"
            />
          </div>
          <div className="hidden xl:block">
            <LinkCombobox links={links} value={linkId} onChange={handleFilterChange(setLinkId)} />
          </div>
          <div className="hidden xl:block">
            <SelectComponent
              id="botFilter"
              label="Visitors"
              options={BOT_OPTIONS}
              selectedValue={botFilter}
              onChange={handleFilterChange(setBotFilter)}
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : !result ? (
          <p className="text-sm text-red-400">Failed to load logs.</p>
        ) : result.items.length === 0 ? (
          <p className="text-sm text-gray-400">No access logs found for the selected filters.</p>
        ) : (
          <>
            <div className="overflow-x-auto border border-gray-100 rounded-lg shadow-sm">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
                    <th className="px-4 py-3 text-left whitespace-nowrap">Timestamp</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Slug</th>
                    <th className="hidden sm:table-cell px-4 py-3 text-left whitespace-nowrap">URL</th>
                    <th className="hidden xl:table-cell px-4 py-3 text-left whitespace-nowrap">Browser</th>
                    <th className="hidden xl:table-cell px-4 py-3 text-left whitespace-nowrap">OS</th>
                    <th className="hidden xl:table-cell px-4 py-3 text-left whitespace-nowrap">Device</th>
                    <th className="hidden xl:table-cell px-4 py-3 text-left whitespace-nowrap">Referrer</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Visitor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.items.map((log, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600 font-variant-numeric tabular-nums">
                        {format(parseISO(log.createdAt), "yyyy-MM-dd HH:mm:ss")}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">
                        go/{log.slug}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3 max-w-xs truncate text-gray-600" title={log.url}>
                        {log.url}
                      </td>
                      <td className="hidden xl:table-cell px-4 py-3 whitespace-nowrap text-gray-600">{log.browser ?? "-"}</td>
                      <td className="hidden xl:table-cell px-4 py-3 whitespace-nowrap text-gray-600">{log.os ?? "-"}</td>
                      <td className="hidden xl:table-cell px-4 py-3 whitespace-nowrap text-gray-600">{log.deviceType ?? "-"}</td>
                      <td className="hidden xl:table-cell px-4 py-3 max-w-[200px]">
                        {log.referrer ? (
                          <span
                            className="block truncate text-gray-500 cursor-default"
                            title={log.referrer}
                          >
                            {log.referrer}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {log.isBot ? (
                          <span className="inline-block px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-700">bot</span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-xs bg-teal-50 text-teal-700">human</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                Showing {(result.pageNumber - 1) * result.pageSize + 1}–
                {Math.min(result.pageNumber * result.pageSize, result.totalItems)} of{" "}
                {result.totalItems.toLocaleString()} entries
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(result.totalPages, p + 1))}
                  disabled={page >= result.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50"
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  try {
    const { token } = await auth0.getAccessToken(context.req, context.res);
    const session = await auth0.getSession(context.req);
    const today = new Date().toISOString().slice(0, 10);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    return {
      props: {
        user: session?.user ?? null,
        isAdmin: hasPermission(token || "", "golinks:admin"),
        today,
        sevenDaysAgo,
      },
    };
  } catch {
    return { redirect: { destination: "/auth/login?returnTo=/logs", permanent: false } };
  }
};

export default LogsPage;
