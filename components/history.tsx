"use client";

import cx from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import type { Chat } from "@/drizzle/schema";
import { fetcher } from "@/utils/functions";
import { InfoIcon, MenuIcon, PencilEditIcon } from "./icons";

export const History = () => {
  const { id } = useParams();
  const pathname = usePathname();

  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const {
    data: history,
    error,
    isLoading,
    mutate,
  } = useSWR<Array<Chat>>("/api/history", fetcher, {
    fallbackData: [],
  });

  useEffect(() => {
    mutate();
  }, [pathname, mutate]);

  return (
    <>
      <div
        className="cursor-pointer text-zinc-500 dark:text-zinc-400"
        onClick={() => {
          setIsHistoryVisible(true);
        }}
      >
        <MenuIcon />
      </div>

      <AnimatePresence>
        {isHistoryVisible && (
          <>
            <motion.div
              className="fixed left-0 top-0 z-20 h-dvh w-dvw bg-zinc-900/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsHistoryVisible(false);
              }}
            />

            <motion.div
              className="fixed left-0 top-0 z-20 flex h-dvh w-80 flex-col gap-6 bg-white p-3 dark:bg-zinc-800"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
            >
              <div className="flex flex-row items-center justify-between text-sm">
                <div className="flex flex-row gap-2">
                  <div className="dark:text-zinc-300">History</div>
                  <div className="text-zinc-500 dark:text-zinc-500">
                    {history === undefined ? "loading" : history.length} chats
                  </div>
                </div>

                <Link
                  href="/"
                  className="cursor-pointer rounded-md bg-zinc-100 p-1.5 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-400 hover:dark:bg-zinc-600"
                  onClick={() => {
                    setIsHistoryVisible(false);
                  }}
                >
                  <PencilEditIcon size={14} />
                </Link>
              </div>

              <div className="flex flex-col overflow-y-scroll">
                {error && error.status === 401 ? (
                  <div className="flex h-dvh w-full flex-row items-center justify-center gap-2 text-sm text-zinc-500">
                    <InfoIcon />
                    <div>Login to save and revisit previous chats!</div>
                  </div>
                ) : null}

                {!isLoading && history?.length === 0 && !error ? (
                  <div className="flex h-dvh w-full flex-row items-center justify-center gap-2 text-sm text-zinc-500">
                    <InfoIcon />
                    <div>No chats found</div>
                  </div>
                ) : null}

                {isLoading && !error ? (
                  <div className="flex w-full flex-col">
                    {[44, 32, 28, 52].map((item) => (
                      <div
                        key={item}
                        className="border-b p-2 dark:border-zinc-700"
                      >
                        <div
                          className={`w-${item} h-[20px] animate-pulse bg-zinc-200 dark:bg-zinc-600`}
                        />
                      </div>
                    ))}
                  </div>
                ) : null}

                {history &&
                  history.map((chat) => (
                    <Link
                      href={`/${chat.id}`}
                      key={chat.id}
                      className={cx(
                        "border-b p-2 text-sm last-of-type:border-b-0 hover:bg-zinc-200 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700",
                        {
                          "bg-zinc-200 dark:bg-zinc-700": id === chat.id,
                        },
                      )}
                    >
                      {chat.messages[0].content as string}
                    </Link>
                  ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
