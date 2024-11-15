import { FunctionComponent, useEffect, useState } from "react";
import { ActivityChart } from "./ActivityChart";
import { ILink } from "../interfaces/ILink";
import SyncLoader from "react-spinners/SyncLoader";
import { FiEdit } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";

export interface ILinkListingProps {
  metricRange: string;
  isAdmin: boolean;
  openLinkFormEdition: (id: string) => void;
}

export const LinkListing: FunctionComponent<ILinkListingProps> = ({
  metricRange,
  isAdmin,
  openLinkFormEdition,
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
      <div className="space-y-8 md:space-x-0">
        {links &&
          links.map((link) => (
            <>
              <div
                key={uuidv4()}
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
                    <button
                      className="p-2 rounded-md bg-teal-600 text-white"
                      onClick={() => openLinkFormEdition(link.id)}
                    >
                      <FiEdit />
                    </button>
                  </div>
                )}
              </div>

              <div
                key={uuidv4()}
                className="block md:hidden px-4 py-2 m-auto w-5/6 border border-gray-200 rounded-md shadow-md"
              >
                <div className="flex items-center justify-between h-10">
                  <h2 className="text-2xl font-bold">
                    <a href={`/${link.slug}`}>go/{link.slug}</a>
                  </h2>

                  {isAdmin && (
                    <button
                      className="p-2 rounded-md bg-teal-600 text-white"
                      onClick={() => openLinkFormEdition(link.id)}
                    >
                      <FiEdit />
                    </button>
                  )}
                </div>

                <div className="my-2 whitespace-nowrap overflow-ellipsis overflow-hidden">
                  <span className="text-xs">{link.url}</span>
                </div>

                <div className="my-4">
                  <p className="text-xs">
                    Total Usage:{" "}
                    <span className="font-bold">{link.totalUsage}</span>
                  </p>
                </div>

                <div className="border-t mt-2 pt-2 w-50 md:border-t-0 md:mt-0 md:pt-0 md:border-l md:pl-2 md:ml-2 border-gray-200">
                  <ActivityChart
                    metrics={link.metrics}
                    metricRange={metricRange}
                    baseValue={0}
                    aspect={1.75}
                  />
                </div>
              </div>
            </>
          ))}
      </div>
    </div>
  );
};
