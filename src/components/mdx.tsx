import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import React from 'react';

const components = {
  h1: (props: React.ComponentPropsWithoutRef<'h1'>) => (
    <h1 {...props} className="mt-8 scroll-m-20 text-4xl font-bold tracking-tight first:mt-0" />
  ),
  h2: (props: React.ComponentPropsWithoutRef<'h2'>) => (
    <h2
      {...props}
      className="mt-10 scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight first:mt-0 dark:border-b-slate-700"
    />
  ),
  h3: (props: React.ComponentPropsWithoutRef<'h3'>) => (
    <h3 {...props} className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight" />
  ),
  h4: (props: React.ComponentPropsWithoutRef<'h4'>) => (
    <h4 {...props} className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight" />
  ),
  h5: (props: React.ComponentPropsWithoutRef<'h5'>) => (
    <h5 {...props} className="mt-8 scroll-m-20 text-lg font-semibold tracking-tight" />
  ),
  h6: (props: React.ComponentPropsWithoutRef<'h6'>) => (
    <h6 {...props} className="mt-8 scroll-m-20 text-base font-semibold tracking-tight" />
  ),
  a: ({ href, children, ...props }: React.ComponentPropsWithoutRef<'a'>) => {
    const className = 'font-medium underline underline-offset-4';
    if (href?.startsWith('/')) {
      return (
        <Link href={href} className={className} {...props}>
          {children}
        </Link>
      );
    }
    if (href?.startsWith('#')) {
      return (
        <a href={href} className={className} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  },
  p: (props: React.ComponentPropsWithoutRef<'p'>) => (
    <p {...props} className="leading-7 [&:not(:first-child)]:mt-6" />
  ),
  ul: (props: React.ComponentPropsWithoutRef<'ul'>) => (
    <ul {...props} className="my-6 ml-6 list-disc [&>li]:mt-2" />
  ),
  ol: (props: React.ComponentPropsWithoutRef<'ol'>) => (
    <ol {...props} className="my-6 ml-6 list-decimal [&>li]:mt-2" />
  ),
  li: (props: React.ComponentPropsWithoutRef<'li'>) => <li {...props} />,
  blockquote: (props: React.ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      {...props}
      className="mt-6 border-l-2 border-slate-300 pl-6 italic text-slate-800 dark:border-slate-600 dark:text-slate-200"
    />
  ),
  img: (props: React.ComponentPropsWithoutRef<'img'>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      className="rounded-md border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
      alt={props.alt}
    />
  ),
  hr: ({ ...props }: React.ComponentPropsWithoutRef<'hr'>) => (
    <hr className="my-4 md:my-8" {...props} />
  ),
  table: ({ ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full" {...props} />
    </div>
  ),
  tr: ({ ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="m-0 border-t p-0 even:bg-muted" {...props} />
  ),
  th: ({ ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),
  td: ({ ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),
  pre: ({ ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-black py-4 dark:bg-zinc-900"
      {...props}
    />
  ),
  code: ({ ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="relative rounded border bg-slate-300/[0.2] px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-slate-900 dark:text-slate-200"
      {...props}
    />
  ),
};

export function CustomMDX(props: React.ComponentProps<typeof MDXRemote>) {
  return (
    <div className="mdx">
      <MDXRemote
        {...props}
        components={{ ...components, ...(props.components || {}) }}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              [
                rehypePrettyCode,
                {
                  theme: 'github-dark',
                  keepBackground: false,
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}
