import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content/work');

export type Post = {
  slug: string;
  metadata: PostMetadata;
  content: string;
};

export type PostMetadata = {
  title?: string;
  date?: string;
  description?: string;
  [key: string]: unknown;
};

export function getPosts(): Post[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const files = fs.readdirSync(contentDirectory);

  const posts = files.map((fileName) => {
    const slug = fileName.replace(/\.mdx?$/, '');
    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      metadata: data,
      content,
    };
  });

  return posts.sort((a, b) => {
    if (a.metadata.date && b.metadata.date) {
      return a.metadata.date > b.metadata.date ? -1 : 1;
    }
    return 0;
  });
}

export function getPost(slug: string): Post | null {
  const fullPath = path.join(contentDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    metadata: data,
    content,
  };
}
