import { FunctionComponent, useEffect, useState } from "react";
import { ActivityChart } from "./ActivityChart";
import { ILink } from "../interfaces/ILink";
import SyncLoader from "react-spinners/SyncLoader";
import { FiEdit } from "react-icons/fi";

export interface ILinkListingProps {
  metricRange: string;
  isAdmin: boolean;
}

export const LinkListing: FunctionComponent<ILinkListingProps> = ({
  metricRange,
  isAdmin,
}) => {
  const [links, setLinks] = useState<ILink[] | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Actions/GetLinksWithMetrics?MetricRange=${metricRange}`
      );
      setLinks((await res.json()).data);
    };

    fetchData();
  }, [metricRange]);

  if (!links) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <SyncLoader
          margin={5}
          size={10}
          speedMultiplier={0.5}
          color="#0d9488"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="py-2 hidden md:grid grid-cols-7 gap-x-3 rounded-t-xl border border-slate-300 bg-gray-50 uppercase text-sm text-gray-800">
        <div className="flex items-center justify-center">Alias</div>
        <div
          className={`flex items-center justify-center ${
            isAdmin ? "col-span-2" : "col-span-3"
          }`}
        >
          Destination
        </div>
        <div className="flex items-center justify-center col-span-2">
          Metrics
        </div>
        <div className="flex items-center justify-center">Total Usage</div>
        {isAdmin && (
          <div className="flex items-center justify-center">Actions</div>
        )}
      </div>
      <div className="">
        {links &&
          links.map((link) => (
            <>
              <div
                key={link.id}
                className="py-3 hidden md:grid grid-cols-7 gap-x-3 border border-t-0 border-slate-300"
              >
                <div className="grid justify-center items-center">
                  <h2 className="text-lg font-bold">
                    <a href={`/${link.slug}`}>go/{link.slug}</a>
                  </h2>
                </div>

                <div
                  className={`grid items-center whitespace-nowrap overflow-ellipsis overflow-hidden ${
                    isAdmin ? "col-span-2" : "col-span-3"
                  }`}
                >
                  <span className="text-xs text-gray-800">{link.url}</span>
                </div>

                <div className="grid items-center justify-center col-span-2 h-40">
                  <ActivityChart
                    metrics={link.metrics}
                    metricRange={metricRange}
                  />
                </div>

                <div className="grid justify-center items-center">
                  <span className="text-xs font-bold">{link.totalUsage}</span>
                </div>

                {isAdmin && (
                  <div className="grid justify-center items-center">
                    <button className="p-2 rounded-md bg-teal-600 text-white">
                      <FiEdit />
                    </button>
                  </div>
                )}
              </div>

              <div
                key={link.id}
                className="w-5/6 lg:w-1/2 px-4 py-2 m-auto border border-gray-200 rounded-md block md:hidden md:justify-between shadow-md"
              >
                <div className="grid auto-rows-min gap-2 lg:gap-4 h-32 md:flex-1">
                  <div className="whitespace-nowrap overflow-ellipsis overflow-hidden">
                    <h2 className="text-2xl font-bold">
                      <a href={`/${link.slug}`}>go/{link.slug}</a>
                    </h2>
                    <span className="text-xs">{link.url}</span>
                  </div>
                  <div className="self-center">
                    <p className="text-sm font-medium">{link.description}</p>
                  </div>
                  <div className="items-start self-end">
                    <p className="text-xs">
                      Total Usage:{" "}
                      <span className="font-bold">{link.totalUsage}</span>
                    </p>
                  </div>
                </div>

                <div className="border-t mt-2 pt-2 md:border-t-0 md:mt-0 md:pt-0 md:border-l md:pl-2 md:ml-2 md:w-56 border-gray-200 flex items-center justify-center">
                  <ActivityChart
                    metrics={link.metrics}
                    metricRange={metricRange}
                  />
                </div>
              </div>
            </>
          ))}
      </div>
    </div>
  );
};
