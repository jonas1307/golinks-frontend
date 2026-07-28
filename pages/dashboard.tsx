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
  isAdmin?: boolean;
}

const PERIOD_OPTIONS = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "60", label: "60 days" },
  { value: "90", label: "90 days" },
];

const Dashboard: NextPage<PageProps> = ({ user, isAdmin }) => {
  const [days, setDays] = useState("30");
  const [linkId, setLinkId] = useState("");
  const [excludeBots, setExcludeBots] = useState(false);
  const [links, setLinks] = useState<ILink[]>([]);
  const [data, setData] = useState<IDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/links?pageSize=50`)
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

  return (
    <div className="container mx-auto px-2 xl:px-0">
      <Head>
        <title>go/links — dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppHeader user={user} isAdmin={isAdmin} />

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
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : !data ? (
          <p className="text-sm text-red-400">Failed to load dashboard data.</p>
        ) : (
          <>
            {/* Visit stats */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Total visits" value={data.totalClicks} />
              <StatCard label="Human visits" value={data.totalClicks - data.botClicks} />
              <StatCard label="Bot visits" value={data.botClicks} />
            </div>

            {/* Visitor stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Unique visitors" value={data.uniqueVisitors} />
              <StatCard label="New visitors" value={data.newVisitors} />
              <StatCard label="Returning visitors" value={data.returningVisitors} />
              <StatCard label="Avg visits / visitor" value={data.avgClicksPerVisitor.toFixed(1)} />
            </div>

            {/* Visits over time */}
            <Section title="Visits over time">
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
            <Section title="Traffic pattern">
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

const StatCard = ({ label, value }: { label: string; value: number | string }) => (
  <div className="border border-gray-100 rounded-lg p-4 shadow-sm">
    <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
    <p className="text-2xl font-bold text-gray-800 mt-1">
      {typeof value === "number" ? value.toLocaleString() : value}
    </p>
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

    return {
      props: {
        user: session?.user ?? null,
        isAdmin: hasPermission(token || "", "golinks:admin"),
      },
    };
  } catch {
    return { redirect: { destination: "/auth/login?returnTo=/dashboard", permanent: false } };
  }
};

export default Dashboard;
