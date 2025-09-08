"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { boolean, z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const contactFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be under 100 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be under 1000 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

const ContactForm = () => {
  const [loading, setLoader] = useState(false);
  const [error, setError] = useState<any>(null);
  const [message, setMessage] = useState<any>(null);

  // 1. Define your form.
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      email: "",
      name: "",
      message: "",
    },
  });

  return (
    <div className="w-full my-12">
      <Form {...form}>
        <form className="space-y-7">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full  border-none">
                <FormControl className="">
                  <Input
                    placeholder="Name"
                    type="text"
                    {...field}
                    className="border-2 placeholder-white text-lg text-white border-white h-12 bg-gray-1 "
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
              <FormItem className="w-full  border-none">
                <FormControl className="">
                  <Input
                    placeholder="Email"
                    type="email"
                    {...field}
                    className="border-2 text-lg text-white border-white h-12 bg-gray-1 "
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="w-full  border-none">
                <FormControl className="">
                  <Textarea
                    // rows={12}
                    placeholder="Message - If you have any question about advertising, always state the number under which you are advertising"
                    {...field}
                    className="border-2 text-lg text-white border-white min-h-28 bg-gray-1 "
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className={cn(
              "bg-gray-1 hover:bg-gray-1/70 cursor-pointer p-6.5 px-12 rounded-md inline-fles text-xl font-semibold items-center justify-center"
            )}
          >
            Send
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
