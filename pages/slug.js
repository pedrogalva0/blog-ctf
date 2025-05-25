import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import Layout from '@/components/layout';

export default function SlugPage({ frontmatter, content }) {
  return (
    <Layout>
      <article className="prose prose-invert max-w-none p-8 bg-black text-green-400 font-mono">
        <h1>{frontmatter.title}</h1>
        <p className="text-sm text-green-500">{frontmatter.date}</p>
        <div dangerouslySetInnerHTML={{ __html: marked.parse(content) }} />
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const files = fs.readdirSync(postsDirectory);

  const paths = files.map(filename => ({
    params: { slug: filename.replace(/\.md$/, '') },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const slug = params.slug;

  const markdownWithMeta = fs.readFileSync(path.join(postsDirectory, slug + '.md'), 'utf-8');
  const { data: frontmatter, content } = matter(markdownWithMeta);

  return {
    props: {
      frontmatter,
      content,
    },
  };
}
