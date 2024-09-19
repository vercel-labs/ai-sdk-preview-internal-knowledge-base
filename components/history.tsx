"use client";

import { motion, AnimatePresence } from "framer-motion";
import { InfoIcon, MenuIcon, PencilEditIcon } from "./icons";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import cx from "classnames";
import { useParams, usePathname } from "next/navigation";
import { Chat } from "@/schema";
import { fetcher } from "@/utils/functions";

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
        className="dark:text-zinc-400 text-zinc-500 cursor-pointer"
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
              className="fixed bg-zinc-900/50 h-dvh w-dvw top-0 left-0 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsHistoryVisible(false);
              }}
            />

            <motion.div
              className="fixed top-0 left-0 w-80 h-dvh p-3 flex flex-col gap-6 bg-white dark:bg-zinc-800 z-20"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
            >
              <div className="text-sm flex flex-row items-center justify-between">
                <div className="flex flex-row gap-2">
                  <div className="dark:text-zinc-300">History</div>
                  <div className="dark:text-zinc-500 text-zinc-500">
                    {history === undefined ? "loading" : history.length} chats
                  </div>
                </div>

                <Link
                  href="/"
                  className="dark:text-zinc-400 dark:bg-zinc-700 hover:dark:bg-zinc-600 bg-zinc-100 hover:bg-zinc-200 p-1.5 rounded-md cursor-pointer"
                  onClick={() => {
                    setIsHistoryVisible(false);
                  }}
                >
                  <PencilEditIcon size={14} />
                </Link>
              </div>

              <div className="flex flex-col overflow-y-scroll">
                {error && error.status === 401 ? (
                  <div className="text-zinc-500 h-dvh w-full flex flex-row justify-center items-center text-sm gap-2">
                    <InfoIcon />
                    <div>Login to save and revisit previous chats!</div>
                  </div>
                ) : null}

                {!isLoading && history?.length === 0 && !error ? (
                  <div className="text-zinc-500 h-dvh w-full flex flex-row justify-center items-center text-sm gap-2">
                    <InfoIcon />
                    <div>No chats found</div>
                  </div>
                ) : null}

                {isLoading && !error ? (
                  <div className="flex flex-col w-full">
                    {[44, 32, 28, 52].map((item) => (
                      <div
                        key={item}
                        className="p-2 border-b dark:border-zinc-700"
                      >
                        <div
                          className={`w-${item} h-[20px] bg-zinc-200 dark:bg-zinc-600 animate-pulse`}
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
                        "p-2 dark:text-zinc-400 border-b dark:border-zinc-700 text-sm dark:hover:bg-zinc-700 hover:bg-zinc-200 last-of-type:border-b-0",
                        {
                          "dark:bg-zinc-700 bg-zinc-200": id === chat.id,
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
