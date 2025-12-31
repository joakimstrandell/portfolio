import AnimateContent from '@/components/AnimateContent';
import { Page, PageContent } from '@/components/page';
import { getPosts } from '@/lib/mdx';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import Image from 'next/image';

export default function Blog() {
  const posts = getPosts();

  return (
    <Page>
      <PageContent>
        <AnimateContent className="prose dark:prose-invert">
          <h1>Work</h1>
          <p>
            A collection of client projects, concepts, and thoughts — things I’ve built or learned while designing and
            developing digital products.
          </p>
          <h2>Sorry, this page is still under construction.</h2>
          <Image
            src="/wip.jpeg"
            alt="Old man laptop"
            className="rounded"
            layout="responsive"
            width={1000}
            height={1000}
          />
          <p>
            Maybe this is not the best place to be right now. To be frank, this page is not even necessary. Sorry for
            leading you down this path, you are a trooper. Check back in a few weeks for more content, and a happy new
            year! For now you can check out my <Link href="/about">about</Link> page.
          </p>
          {/* <div className="mt-10 flex flex-col gap-8">
            {posts.map((post) => (
              <Link key={post.slug} href={`/work/${post.slug}`} className="group block">
                <article className="flex flex-col gap-2">
                  <h2 className="m-0 p-0 text-xl font-semibold decoration-2 underline-offset-4 group-hover:underline">
                    {post.metadata.title}
                  </h2>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">{post.metadata.date}</div>
                  {post.metadata.description && (
                    <p className="m-0 p-0 text-neutral-600 dark:text-neutral-300">{post.metadata.description}</p>
                  )}
                </article>
              </Link>
            ))}
          </div> */}
        </AnimateContent>
      </PageContent>
      <Footer />
    </Page>
  );
}
