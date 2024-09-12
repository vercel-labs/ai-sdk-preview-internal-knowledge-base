"use client";

import { LoaderIcon } from "@/components/icons";
import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type={pending ? "button" : "submit"}
      aria-disabled={pending}
      className="relative flex flex-row gap-4 p-2 w-full items-center justify-center rounded-md bg-zinc-900 text-zinc-50 hover:bg-zinc-800 text-sm transition-all focus:outline-none dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      {children}
      {pending && (
        <span className="animate-spin absolute right-4">
          <LoaderIcon />
        </span>
      )}
      <span aria-live="polite" className="sr-only" role="status">
        {pending ? "Loading" : "Submit form"}
      </span>
    </button>
  );
}
