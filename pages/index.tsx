import { getYear } from "date-fns";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { FiLogIn } from "react-icons/fi";

const Home: NextPage = () => {
  return (
    <div className="container mx-auto px-2 xl:px-0">
      <Head>
        <title>Golinks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="h-16 flex justify-between items-center border-b border-gray-100">
        <h1 className="font-bold text-2xl">
          <Link href="/">golinks</Link>
        </h1>

        <button className="flex items-center space-x-2 border border-gray-100 hover:border-gray-200 hover:shadow-sm rounded-md py-2 px-4">
          <FiLogIn size={18} />
          <span>Login</span>
        </button>
      </header>

      <main></main>

      <footer className="h-8 flex items-center justify-center">
        <span className="text-xs md:text-base">
          &copy; {getYear(Date.now())} Jonas Amorim.
        </span>
      </footer>
    </div>
  );
};

export default Home;
