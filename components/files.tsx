"use client";

import type { ListBlobResultBlob } from "@vercel/blob";
import cx from "classnames";
import { motion } from "framer-motion";
import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import useSWR from "swr";
import { useOnClickOutside, useWindowSize } from "usehooks-ts";
import { fetcher } from "@/utils/functions";
import {
  CheckedSquare,
  InfoIcon,
  LoaderIcon,
  TrashIcon,
  UncheckedSquare,
  UploadIcon,
} from "./icons";

type FilesListResult = Pick<ListBlobResultBlob, "pathname" | "url">;

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
  } = useSWR<FilesListResult[]>("api/files/list", fetcher, {
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
      className="fixed left-0 top-0 z-40 flex h-dvh w-dvw flex-row items-center justify-center bg-zinc-900/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={cx(
          "fixed z-30 flex flex-col gap-4 bg-white p-4 dark:bg-zinc-800",
          { "bottom-0 right-0 h-96 w-dvw": !isDesktop },
          { "h-96 w-[600px] rounded-lg": isDesktop },
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
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row gap-3 text-sm">
            <div className="text-zinc-900 dark:text-zinc-300">
              Manage Knowledge Base
            </div>
          </div>

          <input
            name="file"
            ref={inputFileRef}
            type="file"
            required
            className="pointer-events-none w-1 opacity-0"
            accept="application/pdf"
            multiple={false}
            onChange={async (event) => {
              const file = event.target.files![0];

              if (file) {
                setUploadQueue((currentQueue) => [...currentQueue, file.name]);

                const response = await fetch(
                  `/api/files/upload?filename=${file.name}`,
                  {
                    method: "POST",
                    body: file,
                  },
                );
                const newFile = (await response.json()) as FilesListResult;

                setUploadQueue((currentQueue) =>
                  currentQueue.filter((filename) => filename !== file.name),
                );

                mutate([...(files || []), { ...newFile }]);
              }
            }}
          />

          <div
            className="flex cursor-pointer flex-row items-center gap-2 rounded-md bg-zinc-900 p-1 px-2 text-sm text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-800 dark:hover:bg-zinc-200"
            onClick={() => {
              inputFileRef.current?.click();
            }}
          >
            <UploadIcon />
            <div>Upload a file</div>
          </div>
        </div>

        <div className="flex h-full flex-col overflow-y-scroll">
          {isLoading ? (
            <div className="flex flex-col">
              {[44, 32, 52].map((item) => (
                <div
                  key={item}
                  className="flex flex-row items-center gap-4 border-b p-2 dark:border-zinc-700"
                >
                  <div className="size-4 animate-pulse bg-zinc-200 dark:bg-zinc-600" />
                  <div
                    className={`w-${item} h-4 animate-pulse bg-zinc-200 dark:bg-zinc-600`}
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
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <div className="flex flex-row items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <InfoIcon />
                <div>No files found</div>
              </div>
            </div>
          ) : null}

          {files?.map((file) => (
            <div
              key={file.pathname}
              className={`flex flex-row border-b p-2 dark:border-zinc-700 ${
                selectedFilePathnames.includes(file.pathname)
                  ? "bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-700"
                  : ""
              }`}
            >
              <div
                className="flex w-full flex-row items-center justify-between gap-4"
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

                <div className="flex w-full flex-row justify-between">
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    {file.pathname}
                  </div>
                </div>
              </div>

              <div
                className="cursor-pointer rounded-md p-1 px-2 text-zinc-500 hover:bg-red-100 hover:text-red-500 dark:text-zinc-500 hover:dark:bg-zinc-700"
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
              className="flex flex-row items-center justify-between gap-4 p-2"
            >
              <div className="text-zinc-500">
                <div className="animate-spin">
                  <LoaderIcon />
                </div>
              </div>

              <div className="flex w-full flex-row justify-between">
                <div className="text-sm text-zinc-400 dark:text-zinc-400">
                  {fileName}
                </div>
              </div>

              <div className="h-[24px] w-2" />
            </div>
          ))}
        </div>

        <div className="flex flex-row justify-end">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            {`${selectedFilePathnames.length}/${files?.length}`} Selected
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
