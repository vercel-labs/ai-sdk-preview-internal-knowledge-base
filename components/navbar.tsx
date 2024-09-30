import Link from "next/link";
import { auth, signOut } from "@/app/(auth)/auth";
import { History } from "./history";

export const Navbar = async () => {
  const session = await auth();

  return (
    <div className="absolute left-0 top-0 z-30 flex w-dvw flex-row items-center justify-between border-b bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-row items-center gap-3">
        <History />
        <div className="text-sm dark:text-zinc-300">
          Internal Knowledge Base
        </div>
      </div>

      {session ? (
        <div className="group relative cursor-pointer rounded-md px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <div className="z-10 text-sm dark:text-zinc-400">
            {session.user?.email}
          </div>
          <div className="absolute right-0 top-6 hidden w-full flex-col pt-5 group-hover:flex">
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                className="w-full rounded-md bg-red-500 p-1 text-sm text-red-50 hover:bg-red-600"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      ) : (
        <Link
          href="login"
          className="rounded-md bg-zinc-900 p-1 px-2 text-sm text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Login
        </Link>
      )}
    </div>
  );
};
