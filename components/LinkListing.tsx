import { FunctionComponent, useEffect, useState } from "react";
import { ActivityChart } from "./ActivityChart";
import { ILink } from "../interfaces/ILink";

export const LinkListing: FunctionComponent = () => {
  const [links, setLinks] = useState<ILink[] | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Actions/GetLinksWithMetrics`
      );
      setLinks((await res.json()).data);
    };

    fetchData();
  }, []);

  if (!links) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {links &&
        links.map((link) => (
          <div
            key={link.id}
            className="w-5/6 lg:w-1/2 px-4 py-2 m-auto border border-gray-200 rounded-md md:flex md:justify-between shadow-md"
          >
            <div className="grid auto-rows-min gap-2 lg:gap-4 h-32 md:flex-1">
              <div className="whitespace-nowrap overflow-ellipsis overflow-hidden">
                <h2 className="text-2xl font-bold">
                  <a href={`/${link.slug}`}>go/{link.slug}</a>
                </h2>
                <a href={link.url} className="text-xs">
                  {link.url}
                </a>
              </div>
              <div className="self-center">
                <p className="text-sm font-medium">{link.description}</p>
              </div>
              <div className="items-start self-end">
                <p className="text-xs">
                  Total Usage:{" "}
                  <span className="font-bold">
                    {link.metrics.reduce((sum, item) => {
                      return sum + item.totalClicks;
                    }, 0)}
                  </span>
                </p>
              </div>
            </div>

            <div className="border-t mt-2 pt-2 md:border-t-0 md:mt-0 md:pt-0 md:border-l md:pl-2 md:ml-2 md:w-56 border-gray-200 flex items-center justify-center">
              <ActivityChart minHeight="128px" metrics={link.metrics} />
            </div>
          </div>
        ))}
    </>
  );
};
