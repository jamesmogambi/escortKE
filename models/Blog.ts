// import mongoose, { Schema, Document, Types } from "mongoose";

// export interface IBlogCategory extends Document {
//   name: string;
//   slug: string;
//   description?: string;
//   isActive: boolean;
// }

// export interface IBlogAuthor extends Document {
//   name: string;
//   email: string;
//   bio?: string;
//   avatar?: string;
//   role: "admin" | "editor" | "contributor";
//   isActive: boolean;
// }

// export interface IBlogPost extends Document {
//   title: string;
//   slug: string;
//   excerpt: string;
//   content: string;
//   featuredImage?: string;
//   images: string[];
//   category: Types.ObjectId;
//   author: Types.ObjectId;
//   tags: string[];
//   metaTitle?: string;
//   metaDescription?: string;
//   keywords: string[];
//   isPublished: boolean;
//   publishedAt?: Date;
//   isFeatured: boolean;
//   readingTime: number;
//   wordCount: number;
//   views: number;
//   likes: number;
//   commentsCount: number;
//   // For SEO
//   relatedPosts: Types.ObjectId[];
// }

// const BlogCategorySchema = new Schema<IBlogCategory>(
//   {
//     name: { type: String, required: true, trim: true },
//     slug: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       lowercase: true,
//     },
//     description: { type: String, trim: true },
//     isActive: { type: Boolean, default: true },
//   },
//   { timestamps: true },
// );

// const BlogAuthorSchema = new Schema<IBlogAuthor>(
//   {
//     name: { type: String, required: true, trim: true },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       lowercase: true,
//     },
//     bio: { type: String, trim: true },
//     avatar: { type: String, trim: true },
//     role: {
//       type: String,
//       enum: ["admin", "editor", "contributor"],
//       default: "contributor",
//     },
//     isActive: { type: Boolean, default: true },
//   },
//   { timestamps: true },
// );

// const BlogPostSchema = new Schema<IBlogPost>(
//   {
//     title: { type: String, required: true, trim: true },
//     slug: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       lowercase: true,
//     },
//     excerpt: { type: String, required: true, trim: true },
//     content: { type: String, required: true },
//     featuredImage: { type: String, trim: true },
//     images: [{ type: String }],
//     category: {
//       type: Schema.Types.ObjectId,
//       ref: "BlogCategory",
//       required: true,
//     },
//     author: { type: Schema.Types.ObjectId, ref: "BlogAuthor", required: true },
//     tags: [{ type: String, trim: true }],
//     metaTitle: { type: String, trim: true },
//     metaDescription: { type: String, trim: true },
//     keywords: [{ type: String, trim: true }],
//     isPublished: { type: Boolean, default: false, index: true },
//     publishedAt: { type: Date },
//     isFeatured: { type: Boolean, default: false, index: true },
//     readingTime: { type: Number, default: 5, min: 1 }, // in minutes
//     wordCount: { type: Number, default: 0 },
//     views: { type: Number, default: 0 },
//     likes: { type: Number, default: 0 },
//     commentsCount: { type: Number, default: 0 },
//     relatedPosts: [{ type: Schema.Types.ObjectId, ref: "BlogPost" }],
//   },
//   { timestamps: true },
// );

// // Indexes
// BlogPostSchema.index({ slug: 1, isPublished: 1 });
// BlogPostSchema.index({ category: 1, isPublished: 1 });
// BlogPostSchema.index({ author: 1, isPublished: 1 });
// BlogPostSchema.index({ tags: 1, isPublished: 1 });
// BlogPostSchema.index({ isFeatured: 1, publishedAt: -1 });
// BlogPostSchema.index({ views: -1, publishedAt: -1 });
// BlogPostSchema.index({ title: "text", excerpt: "text", content: "text" });

// // Pre-save middleware to calculate reading time and word count
// BlogPostSchema.pre("save", function (next) {
//   // Calculate word count
//   const words = this.content.split(/\s+/).length;
//   this.wordCount = words;

//   // Calculate reading time (average 200 words per minute)
//   this.readingTime = Math.max(1, Math.ceil(words / 200));

//   // Set publishedAt if publishing for first time
//   if (this.isPublished && !this.publishedAt) {
//     this.publishedAt = new Date();
//   }

//   // Generate meta fields if not provided
//   if (!this.metaTitle) {
//     this.metaTitle = this.title;
//   }
//   if (!this.metaDescription) {
//     this.metaDescription = this.excerpt.substring(0, 160);
//   }

//   next();
// });

// export const BlogCategory =
//   mongoose.models.BlogCategory ||
//   mongoose.model<IBlogCategory>("BlogCategory", BlogCategorySchema);

// export const BlogAuthor =
//   mongoose.models.BlogAuthor ||
//   mongoose.model<IBlogAuthor>("BlogAuthor", BlogAuthorSchema);

// export const BlogPost =
//   mongoose.models.BlogPost ||
//   mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

import mongoose, { Schema, Document, Types } from "mongoose";

export interface IResourceLink extends Document {
  title: string;
  url: string;
  description?: string;
  type: "article" | "video" | "podcast" | "tool" | "external" | "internal";
  blogPost: Types.ObjectId;
  category?: string;
  isSponsored: boolean;
  clicks: number;
  isActive: boolean;
}

export interface IBlogComment extends Document {
  blogPost: Types.ObjectId;
  user: Types.ObjectId;
  name: string;
  email: string;
  content: string;
  isApproved: boolean;
  isAuthor: boolean;
  parentComment?: Types.ObjectId;
  likes: number;
  reports: number;
  userIp?: string;
  userAgent?: string;
}

export interface IBlogCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  postCount?: number;
  colorCode?: string;
  icon?: string;
}

export interface IBlogAuthor extends Document {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  role: "admin" | "editor" | "contributor" | "guest";
  isActive: boolean;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
  expertise?: string[];
}

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  images: string[];
  category: Types.ObjectId;
  author: Types.ObjectId;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  isPublished: boolean;
  publishedAt?: Date;
  isFeatured: boolean;
  readingTime: number;
  wordCount: number;
  views: number;
  likes: number;
  shares: number;
  commentsCount: number;
  // Resource links section
  resourceSectionTitle?: string;
  resourceSectionDescription?: string;
  // Related content
  relatedPosts: Types.ObjectId[];
  // SEO fields
  canonicalUrl?: string;
  ogImage?: string;

  // Virtual populated fields
  resources?: IResourceLink[];
  comments?: IBlogComment[];
  categoryDetails?: IBlogCategory;
  authorDetails?: IBlogAuthor;
  relatedPostsDetails?: IBlogPost[];
}

// Resource Link Schema
const ResourceLinkSchema = new Schema<IResourceLink>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    type: {
      type: String,
      enum: ["article", "video", "podcast", "tool", "external", "internal"],
      default: "external",
      index: true,
    },
    blogPost: {
      type: Schema.Types.ObjectId,
      ref: "BlogPost",
      required: true,
      index: true,
    },
    category: {
      type: String,
      trim: true,
      index: true,
    },
    isSponsored: {
      type: Boolean,
      default: false,
    },
    clicks: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const BlogCommentSchema = new Schema<IBlogComment>(
  {
    blogPost: {
      type: Schema.Types.ObjectId,
      ref: "BlogPost",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 2000,
    },
    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
    isAuthor: {
      type: Boolean,
      default: false,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "BlogComment",
      default: null,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    reports: {
      type: Number,
      default: 0,
      min: 0,
    },
    userIp: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const BlogCategorySchema = new Schema<IBlogCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    colorCode: {
      type: String,
      trim: true,
      default: "#3b82f6", // Default blue color
    },
    icon: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const BlogAuthorSchema = new Schema<IBlogAuthor>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    avatar: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "editor", "contributor", "guest"],
      default: "contributor",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    socialLinks: {
      twitter: { type: String, trim: true },
      facebook: { type: String, trim: true },
      instagram: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      website: { type: String, trim: true },
    },
    expertise: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String,
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "BlogAuthor",
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    readingTime: {
      type: Number,
      default: 5,
      min: 1,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    shares: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Resource links section
    resourceSectionTitle: {
      type: String,
      trim: true,
      default: "Useful Resources & Links",
    },
    resourceSectionDescription: {
      type: String,
      trim: true,
    },
    // Related content
    relatedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "BlogPost",
      },
    ],
    // SEO fields
    canonicalUrl: {
      type: String,
      trim: true,
    },
    ogImage: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for ResourceLink
ResourceLinkSchema.index({ blogPost: 1, isActive: 1, type: 1 });
ResourceLinkSchema.index({ type: 1, clicks: -1 });
ResourceLinkSchema.index({ category: 1, isActive: 1 });
ResourceLinkSchema.index({ createdAt: -1 });

// Indexes for BlogPost
BlogPostSchema.index({ slug: 1, isPublished: 1 });
BlogPostSchema.index({ category: 1, isPublished: 1 });
BlogPostSchema.index({ author: 1, isPublished: 1 });
BlogPostSchema.index({ tags: 1, isPublished: 1 });
BlogPostSchema.index({ isFeatured: 1, publishedAt: -1 });
BlogPostSchema.index({ views: -1, publishedAt: -1 });
BlogPostSchema.index({ likes: -1, publishedAt: -1 });
BlogPostSchema.index({ commentsCount: -1, publishedAt: -1 });
BlogPostSchema.index({
  title: "text",
  excerpt: "text",
  content: "text",
  tags: "text",
});

// Indexes for BlogComment
BlogCommentSchema.index({ blogPost: 1, isApproved: 1, createdAt: -1 });
BlogCommentSchema.index({ parentComment: 1, isApproved: 1 });
BlogCommentSchema.index({ createdAt: -1 });

// Virtual for resources
BlogPostSchema.virtual("resources", {
  ref: "ResourceLink",
  localField: "_id",
  foreignField: "blogPost",
  match: { isActive: true },
  options: { sort: { type: 1, createdAt: -1 } },
});

// Virtual for comments (with nesting support)
BlogPostSchema.virtual("comments", {
  ref: "BlogComment",
  localField: "_id",
  foreignField: "blogPost",
  match: { isApproved: true, parentComment: null },
  options: { sort: { createdAt: -1 } },
});

// Virtual for nested replies
BlogCommentSchema.virtual("replies", {
  ref: "BlogComment",
  localField: "_id",
  foreignField: "parentComment",
  match: { isApproved: true },
  options: { sort: { createdAt: 1 } },
});

// Virtual for populated category
BlogPostSchema.virtual("categoryDetails", {
  ref: "BlogCategory",
  localField: "category",
  foreignField: "_id",
  justOne: true,
});

// Virtual for populated author
BlogPostSchema.virtual("authorDetails", {
  ref: "BlogAuthor",
  localField: "author",
  foreignField: "_id",
  justOne: true,
});

// Virtual for populated related posts
BlogPostSchema.virtual("relatedPostsDetails", {
  ref: "BlogPost",
  localField: "relatedPosts",
  foreignField: "_id",
});

// Virtual for resource type count
BlogPostSchema.virtual("resourceStats").get(function () {
  return {
    articles: 0,
    videos: 0,
    tools: 0,
    total: 0,
  };
});

// Middleware to update comments count
BlogCommentSchema.post("save", async function (comment) {
  if (comment.isApproved) {
    await mongoose
      .model("BlogPost")
      .findByIdAndUpdate(comment.blogPost, { $inc: { commentsCount: 1 } });
  }
});

BlogCommentSchema.post("findOneAndDelete", async function (comment) {
  if (comment.isApproved) {
    await mongoose
      .model("BlogPost")
      .findByIdAndUpdate(comment.blogPost, { $inc: { commentsCount: -1 } });
  }
});

// Middleware to handle comment replies deletion
BlogCommentSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    await mongoose.model("BlogComment").deleteMany({ parentComment: this._id });
    next();
  },
);

// Middleware to track resource link clicks
ResourceLinkSchema.statics.incrementClicks = async function (
  resourceId: string,
) {
  return this.findByIdAndUpdate(
    resourceId,
    { $inc: { clicks: 1 } },
    { new: true },
  );
};

// Pre-save middleware for BlogPost
BlogPostSchema.pre("save", function (next) {
  // Calculate word count
  const words = this.content.split(/\s+/).length;
  this.wordCount = words;

  // Calculate reading time (average 200 words per minute)
  this.readingTime = Math.max(1, Math.ceil(words / 200));

  // Set publishedAt if publishing for first time
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Generate meta fields if not provided
  if (!this.metaTitle) {
    this.metaTitle = this.title;
  }
  if (!this.metaDescription) {
    this.metaDescription = this.excerpt.substring(0, 160);
  }

  // Generate slug if not provided
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  }

  next();
});

// Static method to get popular posts
BlogPostSchema.statics.getPopularPosts = async function (limit = 10) {
  return this.find({ isPublished: true })
    .sort({ views: -1, likes: -1, commentsCount: -1 })
    .limit(limit)
    .populate("categoryDetails", "name slug colorCode icon")
    .populate("authorDetails", "name avatar role")
    .lean();
};

// Static method to get posts with resources
BlogPostSchema.statics.getPostsWithResources = async function (limit = 10) {
  return this.find({ isPublished: true })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate("resources")
    .populate("categoryDetails", "name slug")
    .lean();
};

// Static method to get popular resources
ResourceLinkSchema.statics.getPopularResources = async function (limit = 10) {
  return this.find({ isActive: true })
    .sort({ clicks: -1 })
    .limit(limit)
    .populate("blogPost", "title slug")
    .lean();
};

// Export models
export const ResourceLink =
  mongoose.models.ResourceLink ||
  mongoose.model<IResourceLink>("ResourceLink", ResourceLinkSchema);

export const BlogComment =
  mongoose.models.BlogComment ||
  mongoose.model<IBlogComment>("BlogComment", BlogCommentSchema);

export const BlogCategory =
  mongoose.models.BlogCategory ||
  mongoose.model<IBlogCategory>("BlogCategory", BlogCategorySchema);

export const BlogAuthor =
  mongoose.models.BlogAuthor ||
  mongoose.model<IBlogAuthor>("BlogAuthor", BlogAuthorSchema);

export const BlogPost =
  mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
