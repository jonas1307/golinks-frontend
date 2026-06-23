import React, { useCallback, useState } from "react";
import { getYear } from "date-fns";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserProfile } from "../components/UserProfile";
import { LinkListing } from "../components/LinkListing";
import { LinkFilters } from "../components/LinkFilters";
import { FiPlus } from "react-icons/fi";
import { FloatingButton } from "../components/FloatingButton";
import { LinkForm } from "../components/LinkForm";
import { auth0 } from "../lib/auth0";
import { hasPermission } from "../utils/hasPermission";
import { LinkPagination } from "../components/LinkPagination";

interface PageProps {
  isAdmin: boolean;
}

const Home: NextPage<PageProps> = ({ isAdmin }) => {
  const router = useRouter();
  const currentPage = Number(router.query.page ?? 1);

  const [metricRange, setMetricRange] = useState<string>("30");
  const [search, setSearch] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [listVersion, setListVersion] = useState<number>(0);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedLinkId, setSelectedLinkId] = useState<string | undefined>(
    undefined
  );

  const handlePaginationChange = useCallback(
    (pages: number) => setTotalPages(pages),
    []
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    if (router.query.page) {
      router.replace({ query: { ...router.query, page: undefined } }, undefined, { shallow: true });
    }
  }, [router]);

  const openNewLink = () => {
    setIsEditMode(false);
    setSelectedLinkId(undefined);
    setIsFormOpen(true);
  };

  const openEditLink = (id: string) => {
    setIsEditMode(true);
    setSelectedLinkId(id);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setSelectedLinkId(undefined);
    setIsFormOpen(false);
  };

  const handleLinkSaved = () => {
    handleFormClose();
    setListVersion((prev) => prev + 1);
  };

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

      <main className="w-full py-4 space-y-2">
        {(totalPages !== null && totalPages > 0) || search ? (
          <LinkFilters
            metricRange={metricRange}
            setMetricRange={setMetricRange}
            search={search}
            setSearch={handleSearchChange}
          />
        ) : null}

        <LinkListing
          metricRange={metricRange}
          search={search}
          isAdmin={isAdmin}
          page={currentPage}
          listVersion={listVersion}
          onEditLink={openEditLink}
          onPaginationChange={handlePaginationChange}
        />

        {totalPages !== null && totalPages > 0 && (
          <LinkPagination currentPage={currentPage} totalPages={totalPages} />
        )}
      </main>

      <footer className="h-8 flex items-center justify-center">
        <span className="text-xs md:text-base">
          &copy; 2021-{getYear(Date.now())} Jonas Amorim.
        </span>
      </footer>

      {isAdmin && (
        <FloatingButton Icon={FiPlus} action={openNewLink} />
      )}

      {isAdmin && (
        <LinkForm
          isEditMode={isEditMode}
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSave={handleLinkSaved}
          id={selectedLinkId}
        />
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  try {
    const { token } = await auth0.getAccessToken(context.req, context.res);

    return {
      props: {
        isAdmin: hasPermission(token || "", "golinks:admin"),
      },
    };
  } catch {
    return {
      props: {
        isAdmin: false,
      },
    };
  }
};

export default Home;
