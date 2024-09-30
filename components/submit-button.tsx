"use client";

import { useFormStatus } from "react-dom";
import { LoaderIcon } from "@/components/icons";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type={pending ? "button" : "submit"}
      aria-disabled={pending}
      className="relative flex w-full flex-row items-center justify-center gap-4 rounded-md bg-zinc-900 p-2 text-sm text-zinc-50 transition-all hover:bg-zinc-800 focus:outline-none dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      {children}
      {pending && (
        <span className="absolute right-4 animate-spin">
          <LoaderIcon />
        </span>
      )}
      <span aria-live="polite" className="sr-only" role="status">
        {pending ? "Loading" : "Submit form"}
      </span>
    </button>
  );
}
