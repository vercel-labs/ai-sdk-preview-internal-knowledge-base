"use client";

import type { Message } from "ai";
import { useChat } from "ai/react";
import type { Session } from "next-auth";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Files } from "@/components/files";
import { FileIcon } from "@/components/icons";
import { Message as PreviewMessage } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";

const suggestedActions = [
  {
    title: "What's the summary",
    label: "of these documents?",
    action: "what's the summary of these documents?",
  },
  {
    title: "Who is the author",
    label: "of these documents?",
    action: "who is the author of these documents?",
  },
];

export function Chat({
  id,
  initialMessages,
  session,
}: {
  id: string;
  initialMessages: Array<Message>;
  session: Session | null;
}) {
  const [selectedFilePathnames, setSelectedFilePathnames] = useState<
    Array<string>
  >([]);
  const [isFilesVisible, setIsFilesVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted !== false && session && session.user) {
      localStorage.setItem(
        `${session.user.email}/selected-file-pathnames`,
        JSON.stringify(selectedFilePathnames),
      );
    }
  }, [selectedFilePathnames, isMounted, session]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (session && session.user) {
      setSelectedFilePathnames(
        JSON.parse(
          localStorage.getItem(
            `${session.user.email}/selected-file-pathnames`,
          ) || "[]",
        ),
      );
    }
  }, [session]);

  const { messages, handleSubmit, input, setInput, append } = useChat({
    body: { id, selectedFilePathnames },
    initialMessages,
    onFinish: () => {
      window.history.replaceState({}, "", `/${id}`);
    },
  });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div className="flex h-dvh flex-row justify-center bg-white pb-20 dark:bg-zinc-900">
      <div className="flex flex-col items-center justify-between gap-4">
        <div
          ref={messagesContainerRef}
          className="flex h-full w-dvw flex-col items-center gap-4 overflow-y-scroll"
        >
          {messages.map((message, index) => (
            <PreviewMessage
              key={`${id}-${index}`}
              role={message.role}
              content={message.content}
            />
          ))}
          <div
            ref={messagesEndRef}
            className="min-h-[24px] min-w-[24px] flex-shrink-0"
          />
        </div>

        {messages.length === 0 && (
          <div className="mx-auto grid w-full gap-2 px-4 sm:grid-cols-2 md:max-w-[500px] md:px-0">
            {suggestedActions.map((suggestedAction, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                key={index}
                className={index > 1 ? "hidden sm:block" : "block"}
              >
                <button
                  onClick={async () => {
                    append({
                      role: "user",
                      content: suggestedAction.action,
                    });
                  }}
                  className="flex w-full flex-col rounded-lg border border-zinc-200 p-2 text-left text-sm text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <span className="font-medium">{suggestedAction.title}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {suggestedAction.label}
                  </span>
                </button>
              </motion.div>
            ))}
          </div>
        )}

        <form
          className="max-w-[calc(100dvw-32px) relative flex w-full flex-row items-center gap-2 px-4 md:max-w-[500px] md:px-0"
          onSubmit={handleSubmit}
        >
          <input
            className="flex-1 rounded-md bg-zinc-100 px-2 py-1.5 text-zinc-800 outline-none dark:bg-zinc-700 dark:text-zinc-300"
            placeholder="Send a message..."
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />

          <div
            className="relative flex size-9 flex-shrink-0 cursor-pointer flex-row items-center justify-center rounded-lg bg-zinc-100 text-sm hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
            onClick={() => {
              setIsFilesVisible(!isFilesVisible);
            }}
          >
            <FileIcon />
            <motion.div
              className="absolute -right-2 -top-2 flex size-5 flex-row items-center justify-center rounded-full border-2 border-white bg-blue-500 text-xs text-blue-50 dark:border-zinc-900"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {selectedFilePathnames?.length}
            </motion.div>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {isFilesVisible && (
          <Files
            setIsFilesVisible={setIsFilesVisible}
            selectedFilePathnames={selectedFilePathnames}
            setSelectedFilePathnames={setSelectedFilePathnames}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
