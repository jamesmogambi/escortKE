import mongoose, { Schema, Document } from "mongoose";

export interface UserDoc extends Document {
  clerkUserId: string; // ID from Clerk auth provider
  email: string;
  username?: string;
  fullName?: string;
  avatar?: string; // profile image URL
  role: "user" | "admin" | "escort" | "business"; // RBAC-ready
}

const UserSchema = new Schema<UserDoc>(
  {
    clerkUserId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, trim: true },
    fullName: { type: String, trim: true },
    avatar: { type: String, trim: true },
    role: {
      type: String,
      enum: ["user", "admin", "escort", "business"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Optional: speed up lookups by clerkUserId or email
// UserSchema.index({ clerkUserId: 1 });
// UserSchema.index({ email: 1 });

export default mongoose.models.User ||
  mongoose.model<UserDoc>("User", UserSchema);
