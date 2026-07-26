import React, { useCallback, useEffect, useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { auth0 } from "../lib/auth0";
import { hasPermission } from "../utils/hasPermission";
import { AppHeader } from "../components/AppHeader";
import { HeatmapChart } from "../components/HeatmapChart";
import { BreakdownBar } from "../components/BreakdownBar";
import { PieBreakdown } from "../components/PieBreakdown";
import { ClicksOverTimeChart } from "../components/ClicksOverTimeChart";
import { IDashboard } from "../interfaces/IDashboard";
import { ILink } from "../interfaces/ILink";
import { SelectComponent } from "../components/SelectComponent";
import { LinkCombobox } from "../components/LinkCombobox";
import { getYear } from "date-fns";

interface PageProps {
  user?: { picture?: string; name?: string } | null;
}

const PERIOD_OPTIONS = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "60", label: "60 days" },
  { value: "90", label: "90 days" },
];

const Dashboard: NextPage<PageProps> = ({ user }) => {
  const [days, setDays] = useState("30");
  const [linkId, setLinkId] = useState("");
  const [excludeBots, setExcludeBots] = useState(false);
  const [links, setLinks] = useState<ILink[]>([]);
  const [data, setData] = useState<IDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [backfilling, setBackfilling] = useState(false);
  const [backfillResult, setBackfillResult] = useState<{ updated: number; skipped: number } | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/metrics?metricRange=30&pageSize=200`)
      .then((r) => r.json())
      .then((p) => setLinks(p.items ?? []))
      .catch(() => {});
  }, []);

  const fetchDashboard = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ days });
    if (linkId) params.set("linkId", linkId);
    if (excludeBots) params.set("excludeBots", "true");

    fetch(`/api/dashboard?${params}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [days, linkId, excludeBots]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleBackfill = async () => {
    setBackfilling(true);
    setBackfillResult(null);
    try {
      const res = await fetch("/api/dashboard/backfill-ua", { method: "POST" });
      const json = await res.json();
      setBackfillResult(json);
      fetchDashboard();
    } catch {
      // silent
    } finally {
      setBackfilling(false);
    }
  };

  return (
    <div className="container mx-auto px-2 xl:px-0">
      <Head>
        <title>go/links — dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppHeader user={user} isAdmin={true} />

      <main className="w-full py-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <SelectComponent
            id="period"
            label="Period"
            options={PERIOD_OPTIONS}
            selectedValue={days}
            onChange={setDays}
          />
          <LinkCombobox links={links} value={linkId} onChange={setLinkId} />
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={excludeBots}
              onChange={(e) => setExcludeBots(e.target.checked)}
              className="accent-teal-600"
            />
            Exclude bots
          </label>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={handleBackfill}
              disabled={backfilling}
              className="text-xs px-3 py-1.5 border border-gray-200 rounded-md text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50"
            >
              {backfilling ? "Running backfill…" : "Backfill UA data"}
            </button>
            {backfillResult && (
              <span className="text-xs text-gray-400">
                {backfillResult.updated} updated, {backfillResult.skipped} skipped
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : !data ? (
          <p className="text-sm text-red-400">Failed to load dashboard data.</p>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Total clicks" value={data.totalClicks} />
              <StatCard label="Human clicks" value={data.totalClicks - data.botClicks} />
              <StatCard label="Bot clicks" value={data.botClicks} />
            </div>

            {/* Clicks over time */}
            <Section title="Clicks over time">
              <ClicksOverTimeChart data={data.clicksOverTime ?? []} />
            </Section>

            {/* Pie breakdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Section title="Device">
                <PieBreakdown data={data.byDevice} />
                {(data.byDeviceModel?.length ?? 0) > 0 && (
                  <>
                    <p className="text-xs text-gray-400 uppercase tracking-wide pt-2">Models</p>
                    <BreakdownBar data={data.byDeviceModel ?? []} />
                  </>
                )}
              </Section>
              <Section title="Browser">
                <BreakdownBar data={data.byBrowser} />
              </Section>
              <Section title="OS">
                <PieBreakdown data={data.byOs} />
              </Section>
            </div>

            {/* Heatmap */}
            <Section title="Hour × day of week">
              <HeatmapChart data={data.heatmap} />
            </Section>
          </>
        )}
      </main>

      <footer className="h-8 flex items-center justify-center">
        <span className="text-xs md:text-base">
          &copy; 2021-{getYear(Date.now())} Jonas Amorim.
        </span>
      </footer>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="border border-gray-100 rounded-lg p-4 shadow-sm">
    <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
    <p className="text-2xl font-bold text-gray-800 mt-1">{value.toLocaleString()}</p>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border border-gray-100 rounded-lg p-4 shadow-sm space-y-3">
    <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</h2>
    {children}
  </div>
);

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  try {
    const { token } = await auth0.getAccessToken(context.req, context.res);
    const session = await auth0.getSession(context.req);

    if (!hasPermission(token || "", "golinks:admin")) {
      return { redirect: { destination: "/", permanent: false } };
    }

    return { props: { user: session?.user ?? null } };
  } catch {
    return { redirect: { destination: "/auth/login", permanent: false } };
  }
};

export default Dashboard;
