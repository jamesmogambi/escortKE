"use server";

import { connectToDB } from "@/lib/mongoose";
import { BlogCategory, BlogPost } from "@/models/Blog";
import mongoose from "mongoose";

interface GetBlogPostsOptions {
  page?: number;
  limit?: number;
  categorySlug?: string;
  tag?: string;
  authorId?: string;
  featuredOnly?: boolean;
  searchQuery?: string;
  sortBy?: "newest" | "popular" | "featured";
}

export async function getBlogPosts(options: GetBlogPostsOptions = {}) {
  try {
    await connectToDB();

    const {
      page = 1,
      limit = 12,
      categorySlug,
      tag,
      authorId,
      featuredOnly = false,
      searchQuery,
      sortBy = "newest",
    } = options;

    const skip = (page - 1) * limit;
    const query: any = { isPublished: true };

    // Apply filters
    if (categorySlug) {
      const category = await BlogCategory.findOne({ slug: categorySlug });
      if (category) {
        query.category = category._id;
      }
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (authorId && mongoose.Types.ObjectId.isValid(authorId)) {
      query.author = new mongoose.Types.ObjectId(authorId);
    }

    if (featuredOnly) {
      query.isFeatured = true;
    }

    if (searchQuery && searchQuery.trim()) {
      query.$text = { $search: searchQuery };
    }

    // Build sort
    let sort: any = { publishedAt: -1 };
    if (sortBy === "popular") {
      sort = { views: -1, publishedAt: -1 };
    } else if (sortBy === "featured") {
      sort = { isFeatured: -1, publishedAt: -1 };
    }

    // Execute query
    const [posts, total, categories] = await Promise.all([
      BlogPost.find(query)
        .populate("category", "name slug")
        .populate("author", "name avatar role")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      BlogPost.countDocuments(query),
      BlogCategory.find({ isActive: true }).lean().exec(),
    ]);

    // Get popular tags
    const popularTags = await BlogPost.aggregate([
      { $match: { isPublished: true } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        posts: JSON.parse(JSON.stringify(posts)),
        categories: JSON.parse(JSON.stringify(categories)),
        popularTags: popularTags.map((tag) => ({
          name: tag._id,
          count: tag.count,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return {
      success: false,
      error: "Failed to fetch blog posts",
    };
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    await connectToDB();

    // Increment view count
    await BlogPost.findOneAndUpdate(
      { slug, isPublished: true },
      { $inc: { views: 1 } },
    );

    const post: any = await BlogPost.findOne({ slug, isPublished: true })
      .populate("category", "name slug")
      .populate("author", "name avatar bio role")
      .populate("relatedPosts", "title slug excerpt featuredImage publishedAt")
      .lean()
      .exec();

    if (!post) {
      return { success: false, error: "Blog post not found" };
    }

    // Get related posts (same category, excluding current post)
    const relatedPosts = await BlogPost.find({
      category: post.category,
      isPublished: true,
      _id: { $ne: post._id },
    })
      .select("title slug excerpt featuredImage publishedAt readingTime")
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean()
      .exec();

    // Get previous and next posts
    const [prevPost, nextPost] = await Promise.all([
      BlogPost.findOne({
        publishedAt: { $lt: post.publishedAt },
        isPublished: true,
      })
        .select("title slug")
        .sort({ publishedAt: -1 })
        .lean(),
      BlogPost.findOne({
        publishedAt: { $gt: post.publishedAt },
        isPublished: true,
      })
        .select("title slug")
        .sort({ publishedAt: 1 })
        .lean(),
    ]);

    return {
      success: true,
      data: {
        post: JSON.parse(JSON.stringify(post)),
        relatedPosts: JSON.parse(JSON.stringify(relatedPosts)),
        navigation: {
          prev: prevPost,
          next: nextPost,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return {
      success: false,
      error: "Failed to fetch blog post",
    };
  }
}

export async function getBlogCategories() {
  try {
    await connectToDB();

    const categories = await BlogCategory.find({ isActive: true })
      .sort({ name: 1 })
      .lean()
      .exec();

    // Get post count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await BlogPost.countDocuments({
          category: category._id,
          isPublished: true,
        });
        return { ...category, postCount: count };
      }),
    );

    return {
      success: true,
      data: JSON.parse(JSON.stringify(categoriesWithCount)),
    };
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return {
      success: false,
      error: "Failed to fetch blog categories",
    };
  }
}

export async function searchBlogPosts(query: string, limit: number = 5) {
  try {
    await connectToDB();

    const posts = await BlogPost.find(
      { $text: { $search: query }, isPublished: true },
      { score: { $meta: "textScore" } },
    )
      .select("title slug excerpt featuredImage publishedAt readingTime")
      .populate("category", "name")
      .sort({ score: { $meta: "textScore" } })
      .limit(limit)
      .lean()
      .exec();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(posts)),
    };
  } catch (error) {
    console.error("Error searching blog posts:", error);
    return {
      success: false,
      error: "Failed to search blog posts",
    };
  }
}

export async function getFeaturedPosts(limit: number = 3) {
  try {
    await connectToDB();

    const posts = await BlogPost.find({ isPublished: true, isFeatured: true })
      .select("title slug excerpt featuredImage publishedAt readingTime author")
      .populate("author", "name")
      .populate("category", "name")
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(posts)),
    };
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return {
      success: false,
      error: "Failed to fetch featured posts",
    };
  }
}

export async function getPopularPosts(limit: number = 5) {
  try {
    await connectToDB();

    const posts = await BlogPost.find({ isPublished: true })
      .select("title slug excerpt featuredImage publishedAt readingTime views")
      .sort({ views: -1, publishedAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(posts)),
    };
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    return {
      success: false,
      error: "Failed to fetch popular posts",
    };
  }
}
