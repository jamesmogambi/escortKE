"use client";
import { useUserInputStore } from "@/store/passwordResetStore";
import SectionCard from "@/components/SectionCard";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { boolean, z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { toast } from "sonner";
import SuccessToast from "@/components/Toasts/SuccessToast";

export const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

const PasswordResetForm = () => {
  const { code, email, resetAll } = useUserInputStore();

  const router = useRouter();

  const [loading, setLoader] = useState(false);
  const [error, setError] = useState<any>(null);

  // 1. Define your form.
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const { signIn, setActive } = useSignIn();
  const [secondFactor, setSecondFactor] = useState(false);

  const { handleSubmit, formState } = form;

  const { isSubmitting } = formState;

  // Reset the user's password.
  // Upon successful reset, the user will be
  // signed in and redirected to the home page
  const onSubmit = async (data: FormData) => {
    setError(null);
    const { password } = data;

    setLoader(true);
    try {
      if (!signIn) {
        setError("❌ Unable to reset password. Please try again later.");
        setLoader(false);
        return;
      }

      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (!result) {
        throw new Error("Unexpected null result from signIn");
      }

      if (result.status === "needs_second_factor") {
        setSecondFactor(true);
        setError("");
      } else if (result.status === "complete") {
        setActive({ session: result.createdSessionId });
        setError("");

        toast.custom(() => (
          <SuccessToast message="✅ Password reset successful! " />
        ));
        // setShowPasswordResetForm(true);
        resetAll();
        // redirect user  to home page
        router.push("/");
        router.refresh();
      } else {
        console.log(result);
      }

      // user is signed in after successful update of password
      //   setShowPasswordResetForm(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "❌ Invalid code or password");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="text-center  my-10 text-3xl font-semibold">
      <SectionCard className="lg:max-w-4xl">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <h3 className="text-2xl font-semibold text-white mb-8">
              Password Reset - Reset your password
            </h3>

            <div className="flex flex-col  gap-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full  border-none">
                    <FormLabel className=" font-semibold mb-2 text-white/40 text-base">
                      Password *
                    </FormLabel>
                    <FormControl className="">
                      <Input
                        type="password"
                        placeholder=""
                        {...field}
                        className="bg-white text-black px-6 h-14 text-2xl focus-visible:ring-0 "
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="w-full  border-none">
                    <FormLabel className=" font-semibold mb-2 text-white/40 text-base">
                      Confirm Password *
                    </FormLabel>
                    <FormControl className="">
                      <Input
                        placeholder=""
                        {...field}
                        type="password"
                        className="bg-white text-black px-6 h-14 text-2xl focus-visible:ring-0 "
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {error && (
              <p className=" bg-primary text-center p-3 my-3 mb-6 text-base">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className={`w-full mt-5 h-16 text-lg py-4 font-semibold uppercase text-white ${
                loading
                  ? "bg-primary/50 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/70 cursor-pointer"
              }`}
            >
              {loading ? "Processing..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </SectionCard>
    </div>
  );
};

export default PasswordResetForm;
