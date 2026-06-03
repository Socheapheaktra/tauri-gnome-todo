import ReactMarkdown, { type Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

type TaskDescriptionProps = {
  markdown: string;
  className?: string;
  variant?: "compact" | "full";
};

const markdownComponents: Components = {
  a: ({ className, ...props }) => (
    <a
      className={cn("font-medium text-blue-700 underline underline-offset-2 dark:text-blue-300", className)}
      rel="noreferrer"
      target="_blank"
      {...props}
    />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "border-l-2 border-zinc-300 pl-3 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400",
        className
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[0.9em] text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
        className
      )}
      {...props}
    />
  ),
  h1: ({ className, ...props }) => (
    <h1 className={cn("text-xl font-semibold text-zinc-950 dark:text-zinc-100", className)} {...props} />
  ),
  h2: ({ className, ...props }) => (
    <h2 className={cn("text-lg font-semibold text-zinc-950 dark:text-zinc-100", className)} {...props} />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={cn("text-base font-semibold text-zinc-950 dark:text-zinc-100", className)} {...props} />
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("border-zinc-200 dark:border-zinc-800", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("list-decimal space-y-1 pl-5", className)} {...props} />
  ),
  li: ({ className, ...props }) => <li className={cn("pl-1", className)} {...props} />,
  p: ({ className, ...props }) => <p className={cn("leading-6", className)} {...props} />,
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "overflow-x-auto rounded-md bg-zinc-100 p-3 font-mono text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
        className
      )}
      {...props}
    />
  ),
  table: ({ className, ...props }) => (
    <div className="overflow-x-auto">
      <table className={cn("w-full border-collapse text-sm", className)} {...props} />
    </div>
  ),
  tbody: ({ className, ...props }) => <tbody className={className} {...props} />,
  td: ({ className, ...props }) => (
    <td className={cn("border border-zinc-200 px-2 py-1 dark:border-zinc-800", className)} {...props} />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "border border-zinc-200 bg-zinc-50 px-2 py-1 text-left font-medium dark:border-zinc-800 dark:bg-zinc-900",
        className
      )}
      {...props}
    />
  ),
  thead: ({ className, ...props }) => <thead className={className} {...props} />,
  ul: ({ className, ...props }) => <ul className={cn("list-disc space-y-1 pl-5", className)} {...props} />
};

const compactComponents: Components = {
  ...markdownComponents,
  a: ({ className, ...props }) => (
    <a
      className={cn("font-medium text-blue-700 underline underline-offset-2 dark:text-blue-300", className)}
      onClick={(event) => event.stopPropagation()}
      rel="noreferrer"
      target="_blank"
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("list-decimal space-y-0.5 pl-5", className)} {...props} />
  ),
  p: ({ className, ...props }) => <p className={cn("leading-5", className)} {...props} />,
  strong: ({ className, ...props }) => <strong className={cn("font-semibold", className)} {...props} />,
  ul: ({ className, ...props }) => <ul className={cn("list-disc space-y-0.5 pl-5", className)} {...props} />
};

export function TaskDescription({
  markdown,
  className,
  variant = "full"
}: TaskDescriptionProps) {
  const trimmedMarkdown = markdown.trim();

  if (!trimmedMarkdown) {
    return null;
  }

  if (variant === "compact") {
    return (
      <div className={cn("space-y-1 text-sm text-zinc-600 dark:text-zinc-400", className)}>
        <ReactMarkdown
          allowedElements={["a", "br", "code", "del", "em", "li", "ol", "p", "strong", "ul"]}
          components={compactComponents}
          remarkPlugins={[remarkGfm, remarkBreaks]}
          unwrapDisallowed
        >
          {trimmedMarkdown}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3 text-sm text-zinc-700 dark:text-zinc-300", className)}>
      <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm, remarkBreaks]}>
        {trimmedMarkdown}
      </ReactMarkdown>
    </div>
  );
}
