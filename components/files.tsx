"use client";

import useSWR from "swr";
import {
  CheckedSquare,
  InfoIcon,
  LoaderIcon,
  TrashIcon,
  UncheckedSquare,
  UploadIcon,
} from "./icons";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { fetcher } from "@/utils/functions";
import cx from "classnames";
import { motion } from "framer-motion";
import { useOnClickOutside, useWindowSize } from "usehooks-ts";

export const Files = ({
  selectedFilePathnames,
  setSelectedFilePathnames,
  setIsFilesVisible,
}: {
  selectedFilePathnames: string[];
  setSelectedFilePathnames: Dispatch<SetStateAction<string[]>>;
  setIsFilesVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);
  const [deleteQueue, setDeleteQueue] = useState<Array<string>>([]);
  const {
    data: files,
    mutate,
    isLoading,
  } = useSWR<
    Array<{
      pathname: string;
    }>
  >("api/files/list", fetcher, {
    fallbackData: [],
  });

  const { width } = useWindowSize();
  const isDesktop = width > 768;

  const drawerRef = useRef(null);
  useOnClickOutside([drawerRef], () => {
    setIsFilesVisible(false);
  });

  return (
    <motion.div
      className="fixed bg-zinc-900/50 h-dvh w-dvw top-0 left-0 z-40 flex flex-row justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={cx(
          "fixed p-4 flex flex-col gap-4 bg-white dark:bg-zinc-800 z-30",
          { "w-dvw h-96 bottom-0 right-0": !isDesktop },
          { "w-[600px] h-96 rounded-lg": isDesktop },
        )}
        initial={{
          y: "100%",
          scale: isDesktop ? 0.9 : 1,
          opacity: isDesktop ? 0 : 1,
        }}
        animate={{ y: "0%", scale: 1, opacity: 1 }}
        exit={{
          y: "100%",
          scale: isDesktop ? 0.9 : 1,
          opacity: isDesktop ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        ref={drawerRef}
      >
        <div className="flex flex-row justify-between items-center">
          <div className="text-sm flex flex-row gap-3">
            <div className="text-zinc-900 dark:text-zinc-300">
              Manage Knowledge Base
            </div>
          </div>

          <input
            name="file"
            ref={inputFileRef}
            type="file"
            required
            className="opacity-0 pointer-events-none w-1"
            accept="application/pdf"
            multiple={false}
            onChange={async (event) => {
              const file = event.target.files![0];

              if (file) {
                setUploadQueue((currentQueue) => [...currentQueue, file.name]);

                await fetch(`/api/files/upload?filename=${file.name}`, {
                  method: "POST",
                  body: file,
                });

                setUploadQueue((currentQueue) =>
                  currentQueue.filter((filename) => filename !== file.name),
                );

                mutate([...(files || []), { pathname: file.name }]);
              }
            }}
          />

          <div
            className="bg-zinc-900 text-zinc-50 hover:bg-zinc-800 flex flex-row gap-2 items-center dark:text-zinc-800 text-sm dark:bg-zinc-100 rounded-md p-1 px-2 dark:hover:bg-zinc-200 cursor-pointer"
            onClick={() => {
              inputFileRef.current?.click();
            }}
          >
            <UploadIcon />
            <div>Upload a file</div>
          </div>
        </div>

        <div className="flex flex-col h-full overflow-y-scroll">
          {isLoading ? (
            <div className="flex flex-col">
              {[44, 32, 52].map((item) => (
                <div
                  key={item}
                  className="flex flex-row gap-4 p-2 border-b dark:border-zinc-700 items-center"
                >
                  <div className="size-4 bg-zinc-200 dark:bg-zinc-600 animate-pulse" />
                  <div
                    className={`w-${item} h-4 bg-zinc-200 dark:bg-zinc-600 animate-pulse`}
                  />
                  <div className="h-[24px] w-1" />
                </div>
              ))}
            </div>
          ) : null}

          {!isLoading &&
          files?.length === 0 &&
          uploadQueue.length === 0 &&
          deleteQueue.length === 0 ? (
            <div className="flex flex-col gap-4 items-center justify-center h-full">
              <div className="flex flex-row gap-2 items-center text-zinc-500 dark:text-zinc-400 text-sm">
                <InfoIcon />
                <div>No files found</div>
              </div>
            </div>
          ) : null}

          {files?.map((file: any) => (
            <div
              key={file.pathname}
              className={`flex flex-row p-2 border-b dark:border-zinc-700 ${
                selectedFilePathnames.includes(file.pathname)
                  ? "bg-zinc-100 dark:bg-zinc-700 dark:border-zinc-600"
                  : ""
              }`}
            >
              <div
                className="flex flex-row items-center justify-between w-full gap-4"
                onClick={() => {
                  setSelectedFilePathnames((currentSelections) => {
                    if (currentSelections.includes(file.pathname)) {
                      return currentSelections.filter(
                        (path) => path !== file.pathname,
                      );
                    } else {
                      return [...currentSelections, file.pathname];
                    }
                  });
                }}
              >
                <div
                  className={cx(
                    "cursor-pointer",
                    selectedFilePathnames.includes(file.pathname) &&
                      !deleteQueue.includes(file.pathname)
                      ? "text-blue-600 dark:text-zinc-50"
                      : "text-zinc-500",
                  )}
                >
                  {deleteQueue.includes(file.pathname) ? (
                    <div className="animate-spin">
                      <LoaderIcon />
                    </div>
                  ) : selectedFilePathnames.includes(file.pathname) ? (
                    <CheckedSquare />
                  ) : (
                    <UncheckedSquare />
                  )}
                </div>

                <div className="flex flex-row justify-between w-full">
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    {file.pathname}
                  </div>
                </div>
              </div>

              <div
                className="text-zinc-500 hover:bg-red-100 dark:text-zinc-500 hover:dark:bg-zinc-700 hover:text-red-500 p-1 px-2 cursor-pointer rounded-md"
                onClick={async () => {
                  setDeleteQueue((currentQueue) => [
                    ...currentQueue,
                    file.pathname,
                  ]);

                  await fetch(`/api/files/delete?fileurl=${file.url}`, {
                    method: "DELETE",
                  });

                  setDeleteQueue((currentQueue) =>
                    currentQueue.filter(
                      (filename) => filename !== file.pathname,
                    ),
                  );

                  setSelectedFilePathnames((currentSelections) =>
                    currentSelections.filter((path) => path !== file.pathname),
                  );

                  mutate(files.filter((f) => f.pathname !== file.pathname));
                }}
              >
                <TrashIcon />
              </div>
            </div>
          ))}

          {uploadQueue.map((fileName) => (
            <div
              key={fileName}
              className="flex flex-row justify-between p-2 gap-4 items-center"
            >
              <div className="text-zinc-500">
                <div className="animate-spin">
                  <LoaderIcon />
                </div>
              </div>

              <div className="flex flex-row justify-between w-full">
                <div className="text-sm text-zinc-400 dark:text-zinc-400">
                  {fileName}
                </div>
              </div>

              <div className="h-[24px] w-2" />
            </div>
          ))}
        </div>

        <div className="flex flex-row justify-end">
          <div className="text-zinc-500 dark:text-zinc-400 text-sm">
            {`${selectedFilePathnames.length}/${files?.length}`} Selected
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
