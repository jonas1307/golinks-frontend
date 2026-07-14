import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { ActivityChart } from "./ActivityChart";
import { ILink } from "../interfaces/ILink";
import { IPagedResult } from "../interfaces/IPagedResult";
import SyncLoader from "react-spinners/SyncLoader";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

const isLimitReached = (link: ILink) =>
  link.maxUsage != null && link.totalUsage >= link.maxUsage;

const isDateExpired = (link: ILink) =>
  link.expiresAt != null && new Date(link.expiresAt) <= new Date();

const LinkStatusBadge = ({ link }: { link: ILink }) => {
  if (isLimitReached(link)) {
    return (
      <span className="text-xs px-1.5 py-0.5 rounded font-medium bg-red-100 text-red-700">
        Limit reached
      </span>
    );
  }
  if (link.expiresAt) {
    const expired = isDateExpired(link);
    return (
      <span
        className={`text-xs px-1.5 py-0.5 rounded font-medium ${
          expired ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"
        }`}
      >
        {expired
          ? "Expired"
          : `Expires at ${new Date(link.expiresAt).toLocaleDateString()}`}
      </span>
    );
  }
  return null;
};

export interface ILinkListingProps {
  metricRange: string;
  search: string;
  isAdmin: boolean;
  page: number;
  listVersion: number;
  onEditLink: (id: string) => void;
  onDeleteLink: () => void;
  onPaginationChange: (totalPages: number) => void;
}

export const LinkListing: FunctionComponent<ILinkListingProps> = ({
  metricRange,
  search,
  isAdmin,
  page,
  listVersion,
  onEditLink,
  onDeleteLink,
  onPaginationChange,
}) => {
  const [links, setLinks] = useState<ILink[] | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setLinks(undefined);

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/metrics?metricRange=${metricRange}&pageNumber=${page}${search ? `&search=${encodeURIComponent(search)}` : ""}`
        );
        if (!res.ok) throw new Error("Failed to fetch links");
        const data: IPagedResult<ILink> = await res.json();
        setLinks(data.items);
        onPaginationChange(data.totalPages);
      } catch {
        setLinks([]);
        onPaginationChange(0);
      }
    };

    fetchData();
  }, [metricRange, search, page, listVersion, onPaginationChange]);

  const handleDelete = async (link: ILink) => {
    if (!confirm(`Delete go/${link.slug}? This action cannot be undone.`)) return;
    setDeletingId(link.id);
    try {
      const res = await fetch(`/api/links/${link.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success(`go/${link.slug} deleted.`);
      onDeleteLink();
    } catch {
      toast.error("Failed to delete link.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!links) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <SyncLoader
          margin={5}
          size={10}
          speedMultiplier={0.5}
          color="#0d9488"
        />
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500">
        <p>No links found.</p>
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
      <div className="space-y-8 md:space-y-0">
        {links &&
          links.map((link) => (
            <Fragment key={link.id}>
              <div
                className={`py-3 hidden md:grid grid-cols-7 gap-x-3 border border-t-0 border-slate-300 ${isDateExpired(link) || isLimitReached(link) ? "opacity-50" : ""}`}
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <h2 className="text-lg font-bold">
                    <a href={`/${link.slug}`}>go/{link.slug}</a>
                  </h2>
                  <div className="h-5 flex items-center">
                    <LinkStatusBadge link={link} />
                  </div>
                </div>

                <div
                  className={`flex items-center overflow-hidden ${
                    isAdmin ? "col-span-2" : "col-span-3"
                  }`}
                >
                  <span className="text-xs text-gray-800 truncate">
                    {link.url}
                  </span>
                </div>

                <div className="col-span-2 h-40">
                  <ActivityChart
                    metrics={link.metrics}
                    metricRange={metricRange}
                    height="100%"
                  />
                </div>

                <div className="grid justify-center items-center">
                  <span className="text-xs font-bold">{link.totalUsage}</span>
                </div>

                {isAdmin && (
                  <div className="flex justify-center items-center gap-2">
                    <button
                      className="p-2 rounded-md bg-teal-600 text-white hover:bg-teal-700"
                      onClick={() => onEditLink(link.id)}
                      title="Edit"
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="p-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                      onClick={() => handleDelete(link)}
                      disabled={deletingId === link.id}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                )}
              </div>

              <div
                className={`block md:hidden px-4 py-2 m-auto w-5/6 border border-gray-200 rounded-md shadow-md mt-4 ${isDateExpired(link) || isLimitReached(link) ? "opacity-50" : ""}`}
              >
                <div className="flex items-center justify-between h-10">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">
                      <a href={`/${link.slug}`}>go/{link.slug}</a>
                    </h2>
                    <LinkStatusBadge link={link} />
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-md bg-teal-600 text-white hover:bg-teal-700"
                        onClick={() => onEditLink(link.id)}
                        title="Edit"
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="p-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        onClick={() => handleDelete(link)}
                        disabled={deletingId === link.id}
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  )}
                </div>

                <div className="my-2 overflow-hidden">
                  <span className="text-xs block truncate">{link.url}</span>
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
            </Fragment>
          ))}
      </div>
    </div>
  );
};
