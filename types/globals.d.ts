export {};

// Create a type for the roles
export type Roles = "user" | "admin" | "escort" | "business";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}

export type Region = {
  id: string;
  name: string;
  country: string;
};

export type Town = {
  id: string;
  name: string;
  region: string; // relational link
  country: string;
};

declare module "*.css";
