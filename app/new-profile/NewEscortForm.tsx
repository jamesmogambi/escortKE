"use client";
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
import SectionCard from "@/components/SectionCard";
import { cn } from "@/lib/utils";
import React from "react";

interface Prop {
  className?: string;
}

export const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),

  email: z.string().email("Invalid email address"),

  street: z.string().min(3, "Street name must be at least 3 characters"),

  whatsappNumber: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, "Invalid WhatsApp number"),

  phone: z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"),

  address: z.string().min(5, "Address must be at least 5 characters"),

  city: z.string().min(2, "City must be at least 2 characters"),

  region: z.string().min(2, "Region must be at least 2 characters"),
});
const NewEscortForm = ({ className }: Prop) => {
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // defaultValues: {
    //   username: "",
    //   email: "",
    //   password: "",
    //   confirmPassword: "",
    //   //   agreeTerms:t
    //   //   terms: false,
    // },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    // upon successful registration user should be redirected to /new profile
    // router.push("/new-profile");
  }

  return (
    <div className={cn("", className)}>
      <SectionCard className="px-12">
        <h3 className="text-2xl font-semibold">
          New{" "}
          <span className="text-primary font-semibold">profile of escort</span>
        </h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {/* about section */}
            <section className="flex gap-10 ">
              {/* 1 */}
              <div className="basis-full space-y-6 border-4 lg:basis-1/3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className=" flex-row justify-between   flex gap-4  border-none">
                      <FormLabel className=" font-medium text-nowrap mb-2 text-white/40 text-base">
                        Escort's name:
                      </FormLabel>
                      <FormControl className="border w-1/2 border-primary">
                        <Input
                          placeholder=""
                          {...field}
                          className="bg-white  text-black px-6 h-10 rounded-full text-2xl focus-visible:ring-0 "
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="  flex-row justify-between items-start flex gap-4  border-none">
                      <FormLabel className=" font-medium text-nowrap mb-2 text-white/40 text-base">
                        Email:
                      </FormLabel>
                      <FormControl className="border w-1/2 border-primary">
                        <Input
                          placeholder=""
                          {...field}
                          className="bg-white  text-black px-6 h-10 rounded-full text-2xl focus-visible:ring-0 "
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem className=" flex-row flex gap-4 justify-between border-none">
                      <FormLabel className=" font-medium text-nowrap mb-2 text-white/40 text-base">
                        Street:
                      </FormLabel>
                      <FormControl className="border w-1/2 border-primary">
                        <Input
                          placeholder=""
                          {...field}
                          className="bg-white text-black px-6 h-10 rounded-full text-2xl focus-visible:ring-0 "
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* 2 */}

              <div className="basis-full space-y-6 border-4 lg:basis-1/3">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className=" flex-row  justify-between flex gap-2  border-none">
                      <FormLabel className=" font-medium text-nowrap mb-2 text-white/40 text-base">
                        Phone:
                      </FormLabel>
                      <FormControl className="border w-1/2 border-primary">
                        <Input
                          placeholder=""
                          {...field}
                          className="bg-white  text-black px-6 h-10 rounded-full text-2xl focus-visible:ring-0 "
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 3 */}

              <div className="basis-full space-y-6 border-4 lg:basis-1/3"></div>
            </section>
          </form>
        </Form>
      </SectionCard>
    </div>
  );
};

export default NewEscortForm;
