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
