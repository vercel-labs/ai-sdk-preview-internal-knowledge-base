import Link from "next/link";
import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const components: Components = {
    ol: ({ children, ...props }) => {
      return (
        <ol className="ml-4 list-outside list-decimal" {...props}>
          {children}
        </ol>
      );
    },
    li: ({ children, ...props }) => {
      return (
        <li className="py-1" {...props}>
          {children}
        </li>
      );
    },
    ul: ({ children, ...props }) => {
      return (
        <ul className="ml-4 list-outside list-decimal" {...props}>
          {children}
        </ul>
      );
    },
    strong: ({ children, ...props }) => {
      return (
        <span className="font-semibold" {...props}>
          {children}
        </span>
      );
    },
    a: ({ children, href, ...props }) => {
      return (
        <Link
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noreferrer"
          href={href ?? "#"}
          {...props}
        >
          {children}
        </Link>
      );
    },
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = React.memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
