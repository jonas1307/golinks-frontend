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
import { getAccessToken } from "@auth0/nextjs-auth0";
import { hasPermission } from "../utils/hasPermission";
import { LinkPagination } from "../components/LinkPagination";

interface PageProps {
  isAdmin: boolean;
}

const Home: NextPage<PageProps> = ({ isAdmin }) => {
  const router = useRouter();
  const currentPage = Number(router.query.page ?? 1);

  const [metricRange, setMetricRange] = useState<string>("30");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [linkFormIsOpen, setLinkFormIsOpen] = useState<boolean>(false);
  const [linkFormIsEdit, setLinkFormIsEdit] = useState<boolean>(false);
  const [linkFormCurrentId, setLinkFormCurrentId] = useState<
    string | undefined
  >(undefined);

  const handlePaginationChange = useCallback(
    (pages: number) => setTotalPages(pages),
    []
  );

  const openLinkFormCreation = () => {
    setLinkFormIsEdit(false);
    setLinkFormCurrentId(undefined);
    setLinkFormIsOpen(true);
  };

  const openLinkFormEdition = (id: string) => {
    setLinkFormIsEdit(true);
    setLinkFormCurrentId(id);
    setLinkFormIsOpen(true);
  };

  const closeLinkForm = () => {
    setLinkFormCurrentId(undefined);
    setLinkFormIsOpen(false);
  };

  const onLinkSaved = () => {
    closeLinkForm();
    setRefreshTrigger((prev) => prev + 1);
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
        <LinkFilters
          metricRange={metricRange}
          setMetricRange={setMetricRange}
        />

        <LinkListing
          metricRange={metricRange}
          isAdmin={isAdmin}
          page={currentPage}
          refreshTrigger={refreshTrigger}
          openLinkFormEdition={openLinkFormEdition}
          onPaginationChange={handlePaginationChange}
        />

        {totalPages > 0 && (
          <LinkPagination currentPage={currentPage} totalPages={totalPages} />
        )}
      </main>

      <footer className="h-8 flex items-center justify-center">
        <span className="text-xs md:text-base">
          &copy; 2021-{getYear(Date.now())} Jonas Amorim.
        </span>
      </footer>

      {isAdmin && (
        <FloatingButton Icon={FiPlus} action={openLinkFormCreation} />
      )}

      {isAdmin && (
        <LinkForm
          isLinkEdit={linkFormIsEdit}
          isLinkFormOpen={linkFormIsOpen}
          closeLinkForm={closeLinkForm}
          onLinkSaved={onLinkSaved}
          id={linkFormCurrentId}
        />
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  try {
    const { accessToken } = await getAccessToken(context.req, context.res, {
      scopes: ["golinks:user"],
    });

    return {
      props: {
        isAdmin: hasPermission(accessToken || "", "golinks:admin"),
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
