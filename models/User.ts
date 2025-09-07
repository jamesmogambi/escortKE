// import mongoose from "mongoose";

// export interface UserDoc extends Document {
//   clerkUserId: string; // ID from Clerk auth provider
//   email: string;
//   username?: string;
//   fullName?: string;
//   avatar?: string; // profile image URL
//   role: "user" | "admin" | "escort" | "business"; // RBAC-ready
// }

// const UserSchema = new mongoose.Schema(
//   {
//     clerkUserId: { type: String, required: true, unique: true },
//     email: { type: String, required: true, unique: true },
//     username: { type: String, trim: true },
//     fullName: { type: String, trim: true },
//     avatar: { type: String, trim: true },
//     role: {
//       type: String,
//       enum: ["user", "admin", "escort", "business"],
//       default: "user",
//     },
//   },
//   { timestamps: true }
// );

// // Optional: speed up lookups by clerkUserId or email
// // UserSchema.index({ clerkUserId: 1 });
// // UserSchema.index({ email: 1 });

// export const User = mongoose.models.User || mongoose.model("User", UserSchema);
import mongoose, { Schema, Document, Model } from "mongoose";

export interface UserDoc extends Document {
  clerkUserId: string;
  email: string;
  username?: string;
  fullName?: string;
  avatar?: string;
  role: "user" | "admin" | "escort" | "business";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDoc>(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
      index: true, // speeds up lookups
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // basic email validation
      index: true,
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true, // allows multiple docs with undefined username
    },
    fullName: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "escort", "business"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in dev environments
export const User =
  mongoose.models.User || mongoose.model<UserDoc>("User", UserSchema);
