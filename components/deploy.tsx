import { motion } from "framer-motion";
import Link from "next/link";
import { GitIcon, VercelIcon } from "./icons";

export const Deploy = () => {
  return (
    <motion.div
      className="flex flex-row gap-4 items-center justify-between fixed bottom-6 text-xs "
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <Link
        target="_blank"
        href="https://github.com/vercel-labs/ai-sdk-preview-internal-knowledge-base"
        className="flex flex-row gap-2 items-center border px-2 py-1.5 rounded-md hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:text-zinc-50"
      >
        <GitIcon />
        View Source Code
      </Link>

      <Link
        target="_blank"
        href="https://vercel.com/templates/next.js/ai-sdk-internal-knowledge-base"
        className="flex flex-row gap-2 items-center bg-zinc-900 px-2 py-1.5 rounded-md text-zinc-50 hover:bg-zinc-950 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-50"
      >
        <VercelIcon size={14} />
        Deploy with Vercel
      </Link>
    </motion.div>
  );
};
