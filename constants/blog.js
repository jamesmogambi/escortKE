export const BLOG_CATEGORIES = {
  // Development Categories
  DEVELOPMENT: {
    id: "development",
    name: "Development",
    slug: "development",
    color: "#3b82f6",
    description: "Programming, frameworks, and development tools",
    subcategories: {
      FRONTEND: {
        id: "frontend-development",
        name: "Frontend Development",
        slug: "frontend-development",
        color: "#60a5fa",
        description: "HTML, CSS, JavaScript, React, Vue, Angular",
        icon: "monitor",
      },
      BACKEND: {
        id: "backend-development",
        name: "Backend Development",
        slug: "backend-development",
        color: "#1d4ed8",
        description: "Node.js, Python, Java, APIs, Server Architecture",
        icon: "server",
      },
    },
  },

  // JavaScript Ecosystem
  JAVASCRIPT: {
    id: "javascript",
    name: "JavaScript",
    slug: "javascript",
    color: "#f59e0b",
    description: "Everything JavaScript - from basics to advanced concepts",
    subcategories: {
      LANGUAGE: {
        id: "javascript-language",
        name: "JavaScript Language",
        slug: "javascript-language",
        color: "#fbbf24",
        description: "ES6+, TypeScript, language features, best practices",
        icon: "code",
      },
      FRAMEWORKS: {
        id: "javascript-frameworks",
        name: "JavaScript Frameworks",
        slug: "javascript-frameworks",
        color: "#d97706",
        description: "React, Vue, Angular, Svelte and other frameworks",
        icon: "layout",
      },
    },
  },

  // React Ecosystem
  REACT: {
    id: "react",
    name: "React",
    slug: "react",
    color: "#61dafb",
    description: "React.js library and ecosystem",
    subcategories: {
      CORE: {
        id: "react-core",
        name: "React Core",
        slug: "react-core",
        color: "#38bdf8",
        description: "Components, hooks, state management, performance",
        icon: "atom",
      },
      ECOSYSTEM: {
        id: "react-ecosystem",
        name: "React Ecosystem",
        slug: "react-ecosystem",
        color: "#0ea5e9",
        description: "Next.js, Redux, React Router, testing libraries",
        icon: "package",
      },
    },
  },

  // Backend & APIs
  BACKEND: {
    id: "backend",
    name: "Backend & APIs",
    slug: "backend",
    color: "#10b981",
    description: "Server-side development and API design",
    subcategories: {
      NODE: {
        id: "nodejs",
        name: "Node.js",
        slug: "nodejs",
        color: "#34d399",
        description: "Node.js runtime, Express, NestJS, Deno",
        icon: "node-js",
      },
      APIS: {
        id: "apis",
        name: "APIs & Microservices",
        slug: "apis",
        color: "#059669",
        description: "REST, GraphQL, gRPC, API design patterns",
        icon: "cloud",
      },
    },
  },

  // Database Technologies
  DATABASE: {
    id: "database",
    name: "Database",
    slug: "database",
    color: "#8b5cf6",
    description: "Database systems, management, and optimization",
    subcategories: {
      SQL: {
        id: "sql-databases",
        name: "SQL Databases",
        slug: "sql-databases",
        color: "#a78bfa",
        description: "PostgreSQL, MySQL, SQL Server, relational databases",
        icon: "database",
      },
      NOSQL: {
        id: "nosql-databases",
        name: "NoSQL Databases",
        slug: "nosql-databases",
        color: "#7c3aed",
        description: "MongoDB, Redis, Cassandra, document databases",
        icon: "layers",
      },
    },
  },

  // DevOps & Cloud
  DEVOPS: {
    id: "devops",
    name: "DevOps & Cloud",
    slug: "devops",
    color: "#ef4444",
    description: "Deployment, infrastructure, and cloud services",
    subcategories: {
      INFRASTRUCTURE: {
        id: "devops-infrastructure",
        name: "Infrastructure",
        slug: "devops-infrastructure",
        color: "#f87171",
        description: "Docker, Kubernetes, CI/CD, infrastructure as code",
        icon: "hard-drive",
      },
      CLOUD: {
        id: "cloud-platforms",
        name: "Cloud Platforms",
        slug: "cloud-platforms",
        color: "#dc2626",
        description: "AWS, Azure, Google Cloud, cloud services",
        icon: "cloud",
      },
    },
  },

  // Web Performance
  PERFORMANCE: {
    id: "performance",
    name: "Web Performance",
    slug: "performance",
    color: "#f97316",
    description: "Optimization, speed, and performance techniques",
    subcategories: {
      OPTIMIZATION: {
        id: "performance-optimization",
        name: "Optimization",
        slug: "performance-optimization",
        color: "#fb923c",
        description: "Load times, bundle size, caching strategies",
        icon: "zap",
      },
      MONITORING: {
        id: "performance-monitoring",
        name: "Monitoring & Metrics",
        slug: "performance-monitoring",
        color: "#ea580c",
        description: "Analytics, monitoring tools, performance testing",
        icon: "bar-chart",
      },
    },
  },

  // Security
  SECURITY: {
    id: "security",
    name: "Security",
    slug: "security",
    color: "#dc2626",
    description: "Web security, authentication, and best practices",
    subcategories: {
      WEB_SECURITY: {
        id: "web-security",
        name: "Web Security",
        slug: "web-security",
        color: "#f87171",
        description: "OWASP, vulnerabilities, security headers, HTTPS",
        icon: "shield",
      },
      AUTH: {
        id: "authentication",
        name: "Authentication & Authorization",
        slug: "authentication",
        color: "#ef4444",
        description: "JWT, OAuth, sessions, user management",
        icon: "lock",
      },
    },
  },

  // Tools & Workflow
  TOOLS: {
    id: "tools",
    name: "Tools & Workflow",
    slug: "tools",
    color: "#06b6d4",
    description: "Development tools, editors, and workflow optimization",
    subcategories: {
      EDITORS: {
        id: "editors-ide",
        name: "Editors & IDEs",
        slug: "editors-ide",
        color: "#22d3ee",
        description: "VS Code, WebStorm, extensions, setup guides",
        icon: "code",
      },
      WORKFLOW: {
        id: "workflow",
        name: "Development Workflow",
        slug: "workflow",
        color: "#0891b2",
        description: "Git, npm/yarn, scripts, automation",
        icon: "git-branch",
      },
    },
  },

  // Career & Learning
  CAREER: {
    id: "career",
    name: "Career & Learning",
    slug: "career",
    color: "#8b5cf6",
    description: "Career development, learning resources, and soft skills",
    subcategories: {
      LEARNING: {
        id: "learning-resources",
        name: "Learning Resources",
        slug: "learning-resources",
        color: "#a78bfa",
        description: "Tutorials, courses, books, and study guides",
        icon: "book-open",
      },
      CAREER_GROWTH: {
        id: "career-growth",
        name: "Career Growth",
        slug: "career-growth",
        color: "#7c3aed",
        description: "Interview prep, resumes, career advancement",
        icon: "trending-up",
      },
    },
  },
};

// Helper function to get all main categories
export const getMainCategories = () => {
  return Object.values(BLOG_CATEGORIES).map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    color: cat.color,
    description: cat.description,
  }));
};

// Helper function to get all subcategories (flattened)
export const getAllSubcategories = () => {
  const subcategories = [];

  Object.values(BLOG_CATEGORIES).forEach((category) => {
    Object.values(category.subcategories).forEach((subcategory) => {
      subcategories.push({
        ...subcategory,
        parentCategory: {
          id: category.id,
          name: category.name,
          slug: category.slug,
        },
      });
    });
  });

  return subcategories;
};

// Helper function to get subcategories for a specific category
export const getSubcategories = (categoryId) => {
  const category = BLOG_CATEGORIES[categoryId.toUpperCase()];
  return category ? Object.values(category.subcategories) : [];
};

// Generate database-ready category objects
export const generateCategoryData = () => {
  const mainCategories = [];
  const subCategories = [];

  Object.values(BLOG_CATEGORIES).forEach((category, index) => {
    // Main category
    const mainCategoryId = new Types.ObjectId();
    mainCategories.push({
      _id: mainCategoryId,
      name: category.name,
      slug: category.slug,
      description: category.description,
      colorCode: category.color,
      icon: "folder", // default icon for main categories
      isActive: true,
      isMainCategory: true,
      order: index + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Subcategories
    Object.values(category.subcategories).forEach((subcategory, subIndex) => {
      subCategories.push({
        _id: new Types.ObjectId(),
        name: subcategory.name,
        slug: subcategory.slug,
        description: subcategory.description,
        colorCode: subcategory.color,
        icon: subcategory.icon,
        parentCategory: mainCategoryId,
        isActive: true,
        isMainCategory: false,
        order: subIndex + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  });

  return { mainCategories, subCategories };
};

// Alternative: Single-level categories with parent reference
export const ALL_CATEGORIES_WITH_PARENT = {
  // Main Categories
  DEVELOPMENT: {
    _id: new Types.ObjectId("64a1b2c3d4e5f67890123456"),
    name: "Development",
    slug: "development",
    description: "Programming, frameworks, and development tools",
    colorCode: "#3b82f6",
    icon: "folder",
    isActive: true,
    parentCategory: null,
    level: 0,
  },

  // Development Subcategories
  FRONTEND: {
    _id: new Types.ObjectId("64a1b2c3d4e5f67890123457"),
    name: "Frontend Development",
    slug: "frontend-development",
    description: "HTML, CSS, JavaScript, React, Vue, Angular",
    colorCode: "#60a5fa",
    icon: "monitor",
    isActive: true,
    parentCategory: new Types.ObjectId("64a1b2c3d4e5f67890123456"),
    level: 1,
  },

  BACKEND: {
    _id: new Types.ObjectId("64a1b2c3d4e5f67890123458"),
    name: "Backend Development",
    slug: "backend-development",
    description: "Node.js, Python, Java, APIs, Server Architecture",
    colorCode: "#1d4ed8",
    icon: "server",
    isActive: true,
    parentCategory: new Types.ObjectId("64a1b2c3d4e5f67890123456"),
    level: 1,
  },

  // Main Category: JavaScript
  JAVASCRIPT: {
    _id: new Types.ObjectId("64a1b2c3d4e5f67890123459"),
    name: "JavaScript",
    slug: "javascript",
    description: "Everything JavaScript - from basics to advanced concepts",
    colorCode: "#f59e0b",
    icon: "folder",
    isActive: true,
    parentCategory: null,
    level: 0,
  },

  // JavaScript Subcategories
  JAVASCRIPT_LANG: {
    _id: new Types.ObjectId("64a1b2c3d4e5f6789012345a"),
    name: "JavaScript Language",
    slug: "javascript-language",
    description: "ES6+, TypeScript, language features, best practices",
    colorCode: "#fbbf24",
    icon: "code",
    isActive: true,
    parentCategory: new Types.ObjectId("64a1b2c3d4e5f67890123459"),
    level: 1,
  },

  JS_FRAMEWORKS: {
    _id: new Types.ObjectId("64a1b2c3d4e5f6789012345b"),
    name: "JavaScript Frameworks",
    slug: "javascript-frameworks",
    description: "React, Vue, Angular, Svelte and other frameworks",
    colorCode: "#d97706",
    icon: "layout",
    isActive: true,
    parentCategory: new Types.ObjectId("64a1b2c3d4e5f67890123459"),
    level: 1,
  },

  // Main Category: React
  REACT: {
    _id: new Types.ObjectId("64a1b2c3d4e5f6789012345c"),
    name: "React",
    slug: "react",
    description: "React.js library and ecosystem",
    colorCode: "#61dafb",
    icon: "folder",
    isActive: true,
    parentCategory: null,
    level: 0,
  },

  // React Subcategories
  REACT_CORE: {
    _id: new Types.ObjectId("64a1b2c3d4e5f6789012345d"),
    name: "React Core",
    slug: "react-core",
    description: "Components, hooks, state management, performance",
    colorCode: "#38bdf8",
    icon: "atom",
    isActive: true,
    parentCategory: new Types.ObjectId("64a1b2c3d4e5f6789012345c"),
    level: 1,
  },

  REACT_ECOSYSTEM: {
    _id: new Types.ObjectId("64a1b2c3d4e5f6789012345e"),
    name: "React Ecosystem",
    slug: "react-ecosystem",
    description: "Next.js, Redux, React Router, testing libraries",
    colorCode: "#0ea5e9",
    icon: "package",
    isActive: true,
    parentCategory: new Types.ObjectId("64a1b2c3d4e5f6789012345c"),
    level: 1,
  },

  // Main Category: Database
  DATABASE: {
    _id: new Types.ObjectId("64a1b2c3d4e5f6789012345f"),
    name: "Database",
    slug: "database",
    description: "Database systems, management, and optimization",
    colorCode: "#8b5cf6",
    icon: "folder",
    isActive: true,
    parentCategory: null,
    level: 0,
  },

  // Database Subcategories
  SQL: {
    _id: new Types.ObjectId("64a1b2c3d4e5f67890123460"),
    name: "SQL Databases",
    slug: "sql-databases",
    description: "PostgreSQL, MySQL, SQL Server, relational databases",
    colorCode: "#a78bfa",
    icon: "database",
    isActive: true,
    parentCategory: new Types.ObjectId("64a1b2c3d4e5f6789012345f"),
    level: 1,
  },

  NOSQL: {
    _id: new Types.ObjectId("64a1b2c3d4e5f67890123461"),
    name: "NoSQL Databases",
    slug: "nosql-databases",
    description: "MongoDB, Redis, Cassandra, document databases",
    colorCode: "#7c3aed",
    icon: "layers",
    isActive: true,
    parentCategory: new Types.ObjectId("64a1b2c3d4e5f6789012345f"),
    level: 1,
  },
};

// Flat array for easy import
export const CATEGORIES_ARRAY = Object.values(ALL_CATEGORIES_WITH_PARENT);

// Simple flat categories with hierarchical structure
export const CATEGORIES_HIERARCHY = [
  // Development
  {
    _id: new Types.ObjectId("64a1b2c3d4e5f67890123456"),
    name: "Development",
    slug: "development",
    description: "Programming, frameworks, and development tools",
    colorCode: "#3b82f6",
    icon: "folder",
    isActive: true,
    parentId: null,
    level: 0,
    children: [
      {
        _id: new Types.ObjectId("64a1b2c3d4e5f67890123457"),
        name: "Frontend Development",
        slug: "frontend-development",
        description: "HTML, CSS, JavaScript, React, Vue, Angular",
        colorCode: "#60a5fa",
        icon: "monitor",
        isActive: true,
        parentId: new Types.ObjectId("64a1b2c3d4e5f67890123456"),
        level: 1,
      },
      {
        _id: new Types.ObjectId("64a1b2c3d4e5f67890123458"),
        name: "Backend Development",
        slug: "backend-development",
        description: "Node.js, Python, Java, APIs, Server Architecture",
        colorCode: "#1d4ed8",
        icon: "server",
        isActive: true,
        parentId: new Types.ObjectId("64a1b2c3d4e5f67890123456"),
        level: 1,
      },
    ],
  },

  // JavaScript
  {
    _id: new Types.ObjectId("64a1b2c3d4e5f67890123459"),
    name: "JavaScript",
    slug: "javascript",
    description: "Everything JavaScript - from basics to advanced concepts",
    colorCode: "#f59e0b",
    icon: "folder",
    isActive: true,
    parentId: null,
    level: 0,
    children: [
      {
        _id: new Types.ObjectId("64a1b2c3d4e5f6789012345a"),
        name: "JavaScript Language",
        slug: "javascript-language",
        description: "ES6+, TypeScript, language features, best practices",
        colorCode: "#fbbf24",
        icon: "code",
        isActive: true,
        parentId: new Types.ObjectId("64a1b2c3d4e5f67890123459"),
        level: 1,
      },
      {
        _id: new Types.ObjectId("64a1b2c3d4e5f6789012345b"),
        name: "JavaScript Frameworks",
        slug: "javascript-frameworks",
        description: "React, Vue, Angular, Svelte and other frameworks",
        colorCode: "#d97706",
        icon: "layout",
        isActive: true,
        parentId: new Types.ObjectId("64a1b2c3d4e5f67890123459"),
        level: 1,
      },
    ],
  },

  // React
  {
    _id: new Types.ObjectId("64a1b2c3d4e5f6789012345c"),
    name: "React",
    slug: "react",
    description: "React.js library and ecosystem",
    colorCode: "#61dafb",
    icon: "folder",
    isActive: true,
    parentId: null,
    level: 0,
    children: [
      {
        _id: new Types.ObjectId("64a1b2c3d4e5f6789012345d"),
        name: "React Core",
        slug: "react-core",
        description: "Components, hooks, state management, performance",
        colorCode: "#38bdf8",
        icon: "atom",
        isActive: true,
        parentId: new Types.ObjectId("64a1b2c3d4e5f6789012345c"),
        level: 1,
      },
      {
        _id: new Types.ObjectId("64a1b2c3d4e5f6789012345e"),
        name: "React Ecosystem",
        slug: "react-ecosystem",
        description: "Next.js, Redux, React Router, testing libraries",
        colorCode: "#0ea5e9",
        icon: "package",
        isActive: true,
        parentId: new Types.ObjectId("64a1b2c3d4e5f6789012345c"),
        level: 1,
      },
    ],
  },
];

// For database import (flattened version)
export const CATEGORIES_FLAT = [
  // Development
  {
    _id: new Types.ObjectId("64a1b2c3d4e5f67890123456"),
    name: "Development",
    slug: "development",
    description: "Programming, frameworks, and development tools",
    colorCode: "#3b82f6",
    icon: "folder",
    isActive: true,
    parentId: null,
    level: 0,
  },
  {
    _id: new Types.ObjectId("64a1b2c3d4e5f67890123457"),
    name: "Frontend Development",
    slug: "frontend-development",
    description: "HTML, CSS, JavaScript, React, Vue, Angular",
    colorCode: "#60a5fa",
    icon: "monitor",
    isActive: true,
    parentId: new Types.ObjectId("64a1b2c3d4e5f67890123456"),
    level: 1,
  },
  {
    _id: new Types.ObjectId("64a1b2c3d4e5f67890123458"),
    name: "Backend Development",
    slug: "backend-development",
    description: "Node.js, Python, Java, APIs, Server Architecture",
    colorCode: "#1d4ed8",
    icon: "server",
    isActive: true,
    parentId: new Types.ObjectId("64a1b2c3d4e5f67890123456"),
    level: 1,
  },

  // JavaScript
  {
    _id: new Types.ObjectId("64a1b2c3d4e5f67890123459"),
    name: "JavaScript",
    slug: "javascript",
    description: "Everything JavaScript - from basics to advanced concepts",
    colorCode: "#f59e0b",
    icon: "folder",
    isActive: true,
    parentId: null,
    level: 0,
  },
  {
    _id: new Types.ObjectId("64a1b2c3d4e5f6789012345a"),
    name: "JavaScript Language",
    slug: "javascript-language",
    description: "ES6+, TypeScript, language features, best practices",
    colorCode: "#fbbf24",
    icon: "code",
    isActive: true,
    parentId: new Types.ObjectId("64a1b2c3d4e5f67890123459"),
    level: 1,
  },
  {
    _id: new Types.ObjectId("64a1b2c3d4e5f6789012345b"),
    name: "JavaScript Frameworks",
    slug: "javascript-frameworks",
    description: "React, Vue, Angular, Svelte and other frameworks",
    colorCode: "#d97706",
    icon: "layout",
    isActive: true,
    parentId: new Types.ObjectId("64a1b2c3d4e5f67890123459"),
    level: 1,
  },

  // React
  {
    _id: new Types.ObjectId("64a1b2c3d4e5f6789012345c"),
    name: "React",
    slug: "react",
    description: "React.js library and ecosystem",
    colorCode: "#61dafb",
    icon: "folder",
    isActive: true,
    parentId: null,
    level: 0,
  },
  {
    _id: new Types.ObjectId("64a1b2c3d4e5f6789012345d"),
    name: "React Core",
    slug: "react-core",
    description: "Components, hooks, state management, performance",
    colorCode: "#38bdf8",
    icon: "atom",
    isActive: true,
    parentId: new Types.ObjectId("64a1b2c3d4e5f6789012345c"),
    level: 1,
  },
  {
    _id: new Types.ObjectId("64a1b2c3d4e5f6789012345e"),
    name: "React Ecosystem",
    slug: "react-ecosystem",
    description: "Next.js, Redux, React Router, testing libraries",
    colorCode: "#0ea5e9",
    icon: "package",
    isActive: true,
    parentId: new Types.ObjectId("64a1b2c3d4e5f6789012345c"),
    level: 1,
  },
];

// Usage examples:
console.log("Main Categories:", getMainCategories());
console.log("All Subcategories:", getAllSubcategories());
console.log("JavaScript Subcategories:", getSubcategories("javascript"));
