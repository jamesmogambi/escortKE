import React from "react";

import {CATEGORIES_FLAT, getMainCategories,} from "@/lib/blog/constants";
import CategorySection from "./CategorySection";
import {getBlogPosts} from "@/server-actions/blog.action";
import {notFound} from "next/navigation";
import {ShowMoreButton} from "./ShowMOreButton";
import BlogList from "./BlogList";
import {Metadata} from "next";
// import { getAllSubcategories, BLOG_CATEGORIES } from "../../constants/blog";

export const metadata: Metadata = {
    title: "Blog | Latest Articles & Insights | escortKE",
    description:
        "Discover our latest blog posts, articles, and insights. Stay updated with trending topics, tutorials, and industry news.",

    openGraph: {
        title: "Latest Blog Posts & Articles",
        description: "Explore our collection of blog posts and articles",
        type: "website",
        url: "https://yoursite.com/blog",
        siteName: "Your Site Name",
        images: [
            {
                url: "https://yoursite.com/images/blog-og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Blog Posts Overview",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Latest Blog Posts & Articles",
        description: "Explore our collection of blog posts and articles",
        images: ["https://yoursite.com/images/blog-twitter-image.jpg"],
        creator: "@yourtwitterhandle",
    },

    keywords: ["blog", "articles", "posts", "tutorials", "insights", "news"],

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    alternates: {
        canonical: "https://yoursite.com/blog",
    },

    // For multilingual sites
    // alternates: {
    //   languages: {
    //     'en-US': 'https://yoursite.com/blog',
    //     'es-ES': 'https://yoursite.com/es/blog',
    //   },
    // },
};

interface PageProps {
    searchParams: { page?: string };
}

const page = async ({searchParams}: PageProps) => {
    // const res = getAllSubcategories();
    const currentPage = parseInt(searchParams.page || "1");
    // Get all categories
    const allCategories = getMainCategories();

    console.log("categories flat => ", CATEGORIES_FLAT);

    // Original array remains unchanged
    console.log(CATEGORIES_FLAT.length); // Always the same

    // Using slice to get sections
    const firstSeven: any = CATEGORIES_FLAT.slice(0, 7); // Items 0-6
    const nextThree: any = CATEGORIES_FLAT.slice(7, 10); // Items 7-9
    const allRest = CATEGORIES_FLAT.slice(7); // Items 7 to end
    const lastThree = CATEGORIES_FLAT.slice(-3); // Last 3 items

    // Verify original unchanged
    console.log(firstSeven.length); // 7
    console.log(CATEGORIES_FLAT.length);

    // Get breadcrumbs for a subcategory
    // Returns: [{React category}, {React Core category}]

    const blogRes: any = await getBlogPosts({
        page: currentPage,
        limit: 20,
        sortBy: "newest",
    });

    if (!blogRes.success) {
        return notFound();
    }

    console.log("fetched blog posts ==>", blogRes);

    const {posts, pagination} = blogRes.data;
    const nextPage = currentPage + 1;
    const hasMore = currentPage < pagination.totalPages;

    return (
        <>
            <div
                className="flex w-full mx-auto flex-col-reverse  lg:max-w-[80%] min-h-screen lg;flex-col lg:flex-row gap-2 ">
                {/* categories section*/}
                <aside className=" basis-full space-y-7 lg:basis-1/3 p-6  border-green-600">
                    <CategorySection title="Sexypedia" categories={firstSeven}/>
                    <CategorySection title="Magazine" categories={nextThree}/>
                </aside>

                {/* blogs list */}
                <div className="basis-full p-8  border-amber-300 lg:flex-1">
                    {/* Posts Grid */}

                    <BlogList blogList={posts}/>

                    {/* Show More Button (Client Component) */}
                    {hasMore && (
                        <ShowMoreButton
                            nextPage={nextPage}
                            totalPosts={pagination.total}
                            currentCount={posts.length}
                        />
                    )}

                    {/* No more posts */}
                    {!hasMore && posts.length > 0 && (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center gap-2 px-6 py-3  rounded-full">
                                <span className="text-xl">✅</span>
                                <p className="font-medium ">
                                    All{" "}
                                    <span className="text-primary text-xl">{posts.length} </span>
                                    posts loaded
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default page;
