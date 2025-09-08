import mongoose, { Schema, model } from "mongoose";

const ContactSubmissionSchema = new Schema({
  name: String,
  email: String,
  message: String,
  submittedAt: { type: Date, default: Date.now },
  clerkUserId: { type: String },
  ip: String,
  userAgent: String,
  resendId: String,
});

export const ContactSubmission =
  mongoose.models.ContactSubmission ||
  mongoose.model("ContactSubmission", ContactSubmissionSchema);
