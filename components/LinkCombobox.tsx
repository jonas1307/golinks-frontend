import { FunctionComponent, useEffect, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { ILink } from "../interfaces/ILink";

interface ILinkComboboxProps {
  links: ILink[];
  value: string;
  onChange: (id: string) => void;
}

export const LinkCombobox: FunctionComponent<ILinkComboboxProps> = ({ links, value, onChange }) => {
  const selectedLink = links.find((l) => l.id === value) ?? null;
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? links.filter(
        (l) =>
          l.slug.toLowerCase().includes(query.toLowerCase()) ||
          l.url.toLowerCase().includes(query.toLowerCase())
      )
    : links;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (link: ILink | null) => {
    onChange(link?.id ?? "");
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="flex items-center gap-1">
      <label className="text-sm font-medium text-gray-700 shrink-0">Link:</label>
      <div className="relative">
        {selectedLink && !open ? (
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm bg-white min-w-48">
            <span className="flex-1 text-gray-800 truncate">go/{selectedLink.slug}</span>
            <button
              onClick={() => handleSelect(null)}
              className="text-gray-400 hover:text-gray-600 shrink-0"
            >
              <FiX size={14} />
            </button>
          </div>
        ) : (
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              value={query}
              placeholder={selectedLink ? `go/${selectedLink.slug}` : "Search links…"}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              className="pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600 w-full min-w-48"
            />
          </div>
        )}

        {open && (
          <ul className="absolute z-10 mt-1 w-full min-w-64 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            <li
              onClick={() => handleSelect(null)}
              className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
            >
              All links
            </li>
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-400">No results</li>
            ) : (
              filtered.map((link) => (
                <li
                  key={link.id}
                  onClick={() => handleSelect(link)}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-teal-50 ${
                    link.id === value ? "bg-teal-50 text-teal-700 font-medium" : "text-gray-700"
                  }`}
                >
                  <span className="font-medium">go/{link.slug}</span>
                  <span className="text-xs text-gray-400 ml-2 truncate block">{link.url}</span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
