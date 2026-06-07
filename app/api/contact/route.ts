// import { NextRequest, NextResponse } from "next/server";
//
// import { v4 as uuidv4 } from "uuid";
// import { Resend } from "resend";
// import { ContactSubmission } from "@/models/Contact";
// import { connectToDB } from "@/lib/mongoose";
//
// const resend = new Resend(process.env.RESEND_API_KEY);
//
// const supportAdmin = `${process.env.CONTACT_EMAIL}`;
// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const { email, name, message, clerkUserId = "" } = body;
//
//   await connectToDB();
//   const { data, error } = await resend.emails.send({
//     from: "onboarding@resend.dev",
//     to: supportAdmin,
//     subject: `EscortKE - New message from ${name}`,
//     html: `${message}`,
//   });
//
//   if (error) {
//     return NextResponse.json({ error }, { status: 500 });
//   }
//
//   console.log("data from resend", data);
//   // Save to DB after successful email
//   await ContactSubmission.create({
//     // id: uuidv4(), // optional if using MongoDB _id
//     name,
//     email,
//     message,
//     submittedAt: new Date(),
//     clerkUserId,
//     ip: req.headers.get("x-forwarded-for") ?? "unknown",
//     userAgent: req.headers.get("user-agent") ?? "unknown",
//     resendId: data?.id ?? null, // optional tracking
//   });
//
//   return NextResponse.json(
//     { success: true, message: "Email sent successfully" },
//     { status: 200 }
//   );
// }
