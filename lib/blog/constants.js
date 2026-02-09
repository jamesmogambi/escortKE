/**
 * Blog Categories Constants
 * Organized with main categories and two subcategories each
 * Can be used in both frontend and backend
 */

// Main category structure (no mongoose dependency)
export const BLOG_CATEGORIES = {
  // Development Categories
  DEVELOPMENT: {
    id: "development",
    name: "Development",
    slug: "development",
    color: "#3b82f6",
    description: "Programming, frameworks, and development tools",
    icon: "folder",
    isActive: true,
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
    icon: "folder",
    isActive: true,
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
    icon: "folder",
    isActive: true,
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
    icon: "folder",
    isActive: true,
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
    icon: "folder",
    isActive: true,
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
    icon: "folder",
    isActive: true,
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
};

// Flattened array for easy access (WITHOUT mongoose dependency)
export const CATEGORIES_FLAT = [
  // Development
  {
    _id: "64a1b2c3d4e5f67890123456",
    name: "Development",
    slug: "development",
    description: "Programming, frameworks, and development tools",
    colorCode: "#3b82f6",
    icon: "folder",
    isActive: true,
    parentId: null,
    level: 0,
    order: 1,
  },
  {
    _id: "64a1b2c3d4e5f67890123457",
    name: "Frontend Development",
    slug: "frontend-development",
    description: "HTML, CSS, JavaScript, React, Vue, Angular",
    colorCode: "#60a5fa",
    icon: "monitor",
    isActive: true,
    parentId: "64a1b2c3d4e5f67890123456",
    level: 1,
    order: 1,
  },
  {
    _id: "64a1b2c3d4e5f67890123458",
    name: "Backend Development",
    slug: "backend-development",
    description: "Node.js, Python, Java, APIs, Server Architecture",
    colorCode: "#1d4ed8",
    icon: "server",
    isActive: true,
    parentId: "64a1b2c3d4e5f67890123456",
    level: 1,
    order: 2,
  },

  // JavaScript
  {
    _id: "64a1b2c3d4e5f67890123459",
    name: "JavaScript",
    slug: "javascript",
    description: "Everything JavaScript - from basics to advanced concepts",
    colorCode: "#f59e0b",
    icon: "folder",
    isActive: true,
    parentId: null,
    level: 0,
    order: 2,
  },
  {
    _id: "64a1b2c3d4e5f6789012345a",
    name: "JavaScript Language",
    slug: "javascript-language",
    description: "ES6+, TypeScript, language features, best practices",
    colorCode: "#fbbf24",
    icon: "code",
    isActive: true,
    parentId: "64a1b2c3d4e5f67890123459",
    level: 1,
    order: 1,
  },
  {
    _id: "64a1b2c3d4e5f6789012345b",
    name: "JavaScript Frameworks",
    slug: "javascript-frameworks",
    description: "React, Vue, Angular, Svelte and other frameworks",
    colorCode: "#d97706",
    icon: "layout",
    isActive: true,
    parentId: "64a1b2c3d4e5f67890123459",
    level: 1,
    order: 2,
  },

  // React
  {
    _id: "64a1b2c3d4e5f6789012345c",
    name: "React",
    slug: "react",
    description: "React.js library and ecosystem",
    colorCode: "#61dafb",
    icon: "folder",
    isActive: true,
    parentId: null,
    level: 0,
    order: 3,
  },
  {
    _id: "64a1b2c3d4e5f6789012345d",
    name: "React Core",
    slug: "react-core",
    description: "Components, hooks, state management, performance",
    colorCode: "#38bdf8",
    icon: "atom",
    isActive: true,
    parentId: "64a1b2c3d4e5f6789012345c",
    level: 1,
    order: 1,
  },
  {
    _id: "64a1b2c3d4e5f6789012345e",
    name: "React Ecosystem",
    slug: "react-ecosystem",
    description: "Next.js, Redux, React Router, testing libraries",
    colorCode: "#0ea5e9",
    icon: "package",
    isActive: true,
    parentId: "64a1b2c3d4e5f6789012345c",
    level: 1,
    order: 2,
  },

  // Database
  {
    _id: "64a1b2c3d4e5f6789012345f",
    name: "Database",
    slug: "database",
    description: "Database systems, management, and optimization",
    colorCode: "#8b5cf6",
    icon: "folder",
    isActive: true,
    parentId: null,
    level: 0,
    order: 4,
  },
  {
    _id: "64a1b2c3d4e5f67890123460",
    name: "SQL Databases",
    slug: "sql-databases",
    description: "PostgreSQL, MySQL, SQL Server, relational databases",
    colorCode: "#a78bfa",
    icon: "database",
    isActive: true,
    parentId: "64a1b2c3d4e5f6789012345f",
    level: 1,
    order: 1,
  },
  {
    _id: "64a1b2c3d4e5f67890123461",
    name: "NoSQL Databases",
    slug: "nosql-databases",
    description: "MongoDB, Redis, Cassandra, document databases",
    colorCode: "#7c3aed",
    icon: "layers",
    isActive: true,
    parentId: "64a1b2c3d4e5f6789012345f",
    level: 1,
    order: 2,
  },

  // DevOps
  {
    _id: "64a1b2c3d4e5f67890123462",
    name: "DevOps & Cloud",
    slug: "devops",
    description: "Deployment, infrastructure, and cloud services",
    colorCode: "#ef4444",
    icon: "folder",
    isActive: true,
    parentId: null,
    level: 0,
    order: 5,
  },
  {
    _id: "64a1b2c3d4e5f67890123463",
    name: "Infrastructure",
    slug: "devops-infrastructure",
    description: "Docker, Kubernetes, CI/CD, infrastructure as code",
    colorCode: "#f87171",
    icon: "hard-drive",
    isActive: true,
    parentId: "64a1b2c3d4e5f67890123462",
    level: 1,
    order: 1,
  },
  {
    _id: "64a1b2c3d4e5f67890123464",
    name: "Cloud Platforms",
    slug: "cloud-platforms",
    description: "AWS, Azure, Google Cloud, cloud services",
    colorCode: "#dc2626",
    icon: "cloud",
    isActive: true,
    parentId: "64a1b2c3d4e5f67890123462",
    level: 1,
    order: 2,
  },
];

// ======================
// HELPER FUNCTIONS
// ======================

/**
 * Get all categories in a flat array
 * @returns {Array} Array of all categories
 */
export function getAllCategories() {
  return CATEGORIES_FLAT;
}

/**
 * Get only main categories (level 0, no parent)
 * @returns {Array} Array of main categories
 */
export function getMainCategories() {
  return CATEGORIES_FLAT.filter((cat) => cat.level === 0).sort(
    (a, b) => a.order - b.order,
  );
}

/**
 * Get subcategories for a specific main category
 * @param {string} parentId - The ID of the parent category
 * @returns {Array} Array of subcategories
 */
export function getSubcategories(parentId) {
  return CATEGORIES_FLAT.filter((cat) => cat.parentId === parentId).sort(
    (a, b) => a.order - b.order,
  );
}

/**
 * Get all subcategories (flattened)
 * @returns {Array} Array of all subcategories
 */
export function getAllSubcategories() {
  return CATEGORIES_FLAT.filter((cat) => cat.level === 1);
}

/**
 * Build a hierarchical tree structure from flat categories
 * @returns {Array} Nested category tree
 */
export function buildCategoryTree() {
  const categoryMap = {};
  const roots = [];

  // Create a map of all categories
  CATEGORIES_FLAT.forEach((category) => {
    categoryMap[category._id] = { ...category, children: [] };
  });

  // Build the tree
  CATEGORIES_FLAT.forEach((category) => {
    const node = categoryMap[category._id];
    if (category.parentId && categoryMap[category.parentId]) {
      categoryMap[category.parentId].children.push(node);
    } else {
      roots.push(node);
    }
  });

  // Sort roots and children by order
  roots.sort((a, b) => a.order - b.order);
  roots.forEach((root) => {
    root.children.sort((a, b) => a.order - b.order);
  });

  return roots;
}

/**
 * Get a category by its slug
 * @param {string} slug - The slug of the category
 * @returns {Object|null} The category object or null
 */
export function getCategoryBySlug(slug) {
  return CATEGORIES_FLAT.find((cat) => cat.slug === slug) || null;
}

/**
 * Get a category by its ID
 * @param {string} id - The ID of the category
 * @returns {Object|null} The category object or null
 */
export function getCategoryById(id) {
  return CATEGORIES_FLAT.find((cat) => cat._id === id) || null;
}

/**
 * Get breadcrumb trail for a category
 * @param {string} categoryId - The ID of the category
 * @returns {Array} Breadcrumb trail array
 */
export function getCategoryBreadcrumbs(categoryId) {
  const breadcrumbs = [];
  let currentCategory = getCategoryById(categoryId);

  while (currentCategory) {
    breadcrumbs.unshift(currentCategory);
    if (currentCategory.parentId) {
      currentCategory = getCategoryById(currentCategory.parentId);
    } else {
      currentCategory = null;
    }
  }

  return breadcrumbs;
}

/**
 * Check if a category is a main category
 * @param {string} categoryId - The ID of the category
 * @returns {boolean} True if it's a main category
 */
export function isMainCategory(categoryId) {
  const category = getCategoryById(categoryId);
  return category ? category.level === 0 : false;
}

/**
 * Check if a category is a subcategory
 * @param {string} categoryId - The ID of the category
 * @returns {boolean} True if it's a subcategory
 */
export function isSubcategory(categoryId) {
  const category = getCategoryById(categoryId);
  return category ? category.level === 1 : false;
}

// ======================
// FOR DATABASE SEEDING
// ======================

/**
 * Generate database-ready category data (for server-side use only)
 * Requires mongoose to be available
 * @returns {Object} { mainCategories, subCategories } arrays
 */
export function generateDatabaseCategories() {
  // Note: This function should only be used in server-side code
  // where mongoose is available. It returns data with mongoose ObjectIds.
  // For frontend use, use CATEGORIES_FLAT instead.

  console.warn(
    "generateDatabaseCategories() should only be used in server-side code with mongoose available.",
  );

  // In a real implementation, you would import mongoose here
  // and use mongoose.Types.ObjectId to generate IDs

  return {
    mainCategories: CATEGORIES_FLAT.filter((cat) => cat.level === 0),
    subCategories: CATEGORIES_FLAT.filter((cat) => cat.level === 1),
  };
}

// ======================
// JSON EXPORT FOR MONGO IMPORT
// ======================

/**
 * Get categories in MongoDB JSON format (with $oid for _id)
 * @returns {Array} Array of categories in MongoDB JSON format
 */
export function getCategoriesForMongoImport() {
  return CATEGORIES_FLAT.map((category) => ({
    ...category,
    _id: { $oid: category._id },
    createdAt: { $date: new Date().toISOString() },
    updatedAt: { $date: new Date().toISOString() },
  }));
}
