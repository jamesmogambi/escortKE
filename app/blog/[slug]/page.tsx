import { getBlogPostBySlug, getBlogPosts } from "@/actions/blog";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";
import BlogArticle from "./BlogArticle";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  try {
    const { slug } = await params;
    const res = await getBlogPostBySlug(slug);
    const post = res?.data?.post;

    if (!post) {
      return {
        title: "Post Not Found",
        description: "The requested blog post could not be found.",
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yoursite.com";
    const postUrl = `${baseUrl}/blog/${slug}`;

    // Get parent metadata (from layout)
    const previousImages = (await parent).openGraph?.images || [];

    return {
      title: post.title,
      description: post.excerpt || post.metaDescription || `Read ${post.title}`,
      alternates: {
        canonical: postUrl,
      },
      openGraph: {
        title: post.title,
        description: post.excerpt || post.metaDescription || post.title,
        url: postUrl,
        siteName: "Your Site Name",
        images: [
          {
            url: post.coverImage || `${baseUrl}/og-default.jpg`,
            width: 1200,
            height: 630,
            alt: post.title,
          },
          ...previousImages,
        ],
        locale: "en_US",
        type: "article",
        publishedTime: post.publishedAt || post.createdAt,
        modifiedTime: post.updatedAt || post.publishedAt || post.createdAt,
        authors: post.author?.name ? [post.author.name] : undefined,
        tags: post.categories || post.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt || post.metaDescription || post.title,
        images: [post.coverImage || `${baseUrl}/og-default.jpg`],
        creator: "@yourtwitterhandle",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "An error occurred while loading the blog post.",
    };
  }
}

export async function generateStaticParams() {
  try {
    // const res = await getBlogPosts(100);
    const res: any = await getBlogPosts({
      page: 1,
      limit: 100,
      sortBy: "newest",
    });

    const posts = res?.data?.posts || [];

    return posts.map((post: { slug: string }) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Revalidate every hour
export const revalidate = 3600;

const Page = async ({ params }: Props) => {
  try {
    const { slug } = await params;
    const res = await getBlogPostBySlug(slug);
    const post = res?.data?.post;

    if (!post) {
      notFound();
    }

    // Generate JSON-LD structured data
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yoursite.com";
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt || post.metaDescription || post.title,
      image: post.coverImage || `${baseUrl}/og-default.jpg`,
      datePublished: post.publishedAt || post.createdAt,
      dateModified: post.updatedAt || post.publishedAt || post.createdAt,
      author: {
        "@type": "Person",
        name: post.author?.name || "Your Site Name",
        url: post.author?.url || baseUrl,
      },
      url: `${baseUrl}/blog/${slug}`,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${baseUrl}/blog/${slug}`,
      },
      publisher: {
        "@type": "Organization",
        name: "Your Site Name",
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/logo.png`,
        },
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BlogArticle blog={post} />
      </>
    );
  } catch (error) {
    console.error("Error loading blog post:", error);
    notFound();
  }
};

export default Page;
