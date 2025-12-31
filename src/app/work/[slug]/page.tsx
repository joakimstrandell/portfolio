import { notFound } from 'next/navigation';
import { CustomMDX } from '@/components/mdx';
import { getPost, getPosts } from '@/lib/mdx';
import { Page, PageContent } from '@/components/page';
import AnimateContent from '@/components/AnimateContent';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export async function generateStaticParams() {
  const posts = getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return;
  }

  return {
    title: post.metadata.title,
    description: post.metadata.description,
  };
}

export default async function Blog({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <Page>
      <PageContent>
        <AnimateContent>
          <div className="mb-8">
            <Link
              href="/work"
              className="group inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to work
            </Link>
          </div>
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <h1 className="mb-2">{post.metadata.title}</h1>
            <div className="mb-8 text-sm text-neutral-500 dark:text-neutral-400">
              {post.metadata.date}
            </div>
            <CustomMDX source={post.content} />
          </article>
        </AnimateContent>
      </PageContent>
    </Page>
  );
}
