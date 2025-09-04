"use client";
import SectionCard from "@/components/SectionCard";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { z } from "zod";
// import MyButton from "../MyButton";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useClerk, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createUser } from "@/actions/user";

interface Prop {
  className?: string;
}

const schema = z.object({
  code: z
    .string()
    .min(6, { message: "Code must be at least 6 characters long." })
    .refine((val) => val.trim().length > 0, {
      message: "Please enter the verification code.",
    }),
});

const VerifyEmailForm = ({ className }: Prop) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signUp, isLoaded } = useSignUp();
  const { setActive } = useClerk();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = schema.safeParse({ code });

    if (!result.success) {
      setError("Invalid code");
      return;
    }

    setLoading(true);
    try {
      if (!signUp) {
        setError("Sign-up is not loaded. Please try again later.");
        return;
      }

      const res = await signUp.attemptEmailAddressVerification({ code });

      if (res.createdUserId) {
        const { createdUserId, username, createdSessionId, emailAddress } = res;

        if (!emailAddress) {
          throw new Error("Email address is required");
        }

        if (!username) {
          throw new Error("Username is required");
        }

        const newUser = await createUser({
          clerkUserId: createdUserId,
          email: emailAddress!,
          username,
        });
        if (!newUser) {
          throw new Error("User creation failed");
        }

        await setActive({ session: createdSessionId });
        //   toast.custom(() => <SuccessToast message="Sign Up successful" />);
        router.push("/");
      }
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err?.errors?.[0]?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("", className)}>
      <SectionCard>
        <form onSubmit={handleSubmit} className="">
          <h3 className="text-2xl text-center font-semibold text-white mb-8">
            Please enter code sent to your email
          </h3>

          <div className="my-12 flex justify-center">
            <InputOTP
              value={code}
              onChange={(val: string) => setCode(val)}
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              className=""
            >
              <InputOTPGroup className="w-3/4 gap-4">
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="ring-stone-600 p-8 text-xl border-stone-700 data-[active=true]:ring-primary data-[active=true]:border-0 border-[0.2px]"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error && (
            <p className=" bg-primary  p-2.5 my-3 mb-6 text-lg">{error}</p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className={`w-full h-16 text-lg py-4 font-semibold uppercase text-white ${
              loading
                ? "bg-primary/50 cursor-not-allowed"
                : "bg-primary hover:bg-primary/70 cursor-pointer"
            }`}
          >
            {loading ? "Processing..." : "Complete Registration"}
          </Button>
        </form>
      </SectionCard>
    </div>
  );
};

export default VerifyEmailForm;
