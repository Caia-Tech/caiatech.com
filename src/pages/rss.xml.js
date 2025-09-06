import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('articles');
  
  // Sort posts by date, newest first
  const sortedPosts = posts.sort((a, b) => {
    const dateA = new Date(a.data.updatedDate || a.data.pubDate);
    const dateB = new Date(b.data.updatedDate || b.data.pubDate);
    return dateB.getTime() - dateA.getTime();
  });

  return rss({
    title: 'Caia Tech - Computer Science Research & AI',
    description: 'Latest articles on transformer architectures, Kubernetes, distributed systems, and AI research from Caia Tech.',
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.pubDate),
      description: post.data.description,
      link: `/articles/${post.slug}/`,
      categories: post.data.tags || [],
      author: `${post.data.author || 'Caia Tech'} <owner@caiatech.com>`,
      customData: `
        <language>en-us</language>
        ${post.data.image ? `<enclosure url="${context.site}${post.data.image}" type="image/jpeg" />` : ''}
        ${post.data.updatedDate ? `<lastBuildDate>${new Date(post.data.updatedDate).toUTCString()}</lastBuildDate>` : ''}
      `,
    })),
    customData: `
      <language>en-us</language>
      <copyright>Copyright ${new Date().getFullYear()} Caia Tech</copyright>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <docs>https://www.rssboard.org/rss-specification</docs>
      <generator>Astro v5</generator>
      <managingEditor>owner@caiatech.com (Caia Tech)</managingEditor>
      <webMaster>owner@caiatech.com (Caia Tech)</webMaster>
      <ttl>60</ttl>
      <image>
        <url>https://caiatech.com/favicon.svg</url>
        <title>Caia Tech</title>
        <link>https://caiatech.com</link>
      </image>
    `,
    stylesheet: false,
  });
}