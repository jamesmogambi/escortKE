// // tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       animation: {
//         fadeIn: "fadeIn 0.5s ease-out",
//         slideUp: "slideUp 0.3s ease-out",
//       },
//       keyframes: {
//         fadeIn: {
//           "0%": { opacity: "0", transform: "translateY(10px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//         slideUp: {
//           "0%": { transform: "translateY(20px)", opacity: "0" },
//           "100%": { transform: "translateY(0)", opacity: "1" },
//         },
//       },
//     },
//   },
// };import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Blog | Latest Articles & Insights | Your Site Name",
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
