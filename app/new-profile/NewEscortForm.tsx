"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { boolean, z } from "zod";
import { Button } from "@/components/ui/button";

import { Form } from "@/components/ui/form";

import { useRouter } from "next/navigation";
import SectionCard from "@/components/SectionCard";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import WorkHoursForm from "./WorkHoursForm";
import SettingsForm from "./SettingsForm";
import AboutMeForm from "./AboutMeForm";
import PreviewPhoto from "./PreviewPhoto";
import SelectPackagesForm from "./SelectPackagesForm";
import { ArrowBigDown, ArrowDown } from "lucide-react";
import PhotoVideoUploads from "./PhotoVideoUploads";
import IntroSection from "./IntroSection";
import RichTextEditor from "./RichTextEditor";

// Define the RichTextEditorHandle type
type RichTextEditorHandle = {
  getContent: () => string;
};

interface Prop {
  className?: string;
}

const timeRangeRegex =
  /^([01]\d|2[0-3])[-:]([0-5]\d)\s*-\s*([01]\d|2[0-3])[-:]([0-5]\d)$/;

const daySchema = z.string().regex(timeRangeRegex, "Invalid time range");

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

  description: z.string().min(10, "Description must be at least 10 characters"),
  monday: daySchema,
  tuesday: daySchema,
  wednesday: daySchema,
  thursday: daySchema,
  friday: daySchema,
  saturday: daySchema,
  sunday: daySchema,
  variantAge: z.string(),

  myAge: z.string(),
  myHeight: z.string(),
  myBreasts: z.string(),
  myWeight: z.string(),

  variantAvailability: z.array(z.string().min(1, "Tag cannot be empty")),
});
const NewEscortForm = ({ className }: Prop) => {
  // TODO: store the user preview image
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // monday: "8:00-17:00",
      // region: "",
    },
  });

  const { watch, setValue } = form;
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    console.log(form.getValues());
    console.log("--on submit values", values);

    // upon successful registration user should be redirected to /new profile
    // router.push("/new-profile");
  }

  return (
    <div className={cn("", className)}>
      <SectionCard className="px-12">
        <h3 className="text-2xl mb-5 font-semibold">
          New{" "}
          <span className="text-primary font-semibold">profile of escort</span>
        </h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {/* about section */}
            <IntroSection form={form} />
            {/* description and setting section */}
            <section className="flex mt-12 gap-6">
              {/* 1 */}
              <div className=" basis-1/2">
                <RichTextEditor />

                <WorkHoursForm form={form} className={" mt-5"} />

                <SettingsForm form={form} className="mt-14 w-full" />

                <AboutMeForm form={form} className="my-8" />

                <PreviewPhoto className="my-10 w-3/4" form={form} />
              </div>

              {/* 2 */}

              <div className="basis-1/2 relative border-4 border-green-600">
                <SelectPackagesForm form={form} />
              </div>
            </section>
            <PhotoVideoUploads form={form} />

            {/* // submit button */}
            <div className="flex justify-center ">
              <Button
                className="flex w-1/4 rounded-none  items-center  gap-2 p-12 text-white bg-primary"
                type="submit"
              >
                <ArrowDown className="size-8" strokeWidth={4} />
                <span className="uppercase font-semibold text-2xl">
                  create profile
                </span>
              </Button>
            </div>
          </form>
        </Form>
      </SectionCard>
    </div>
  );
};

export default NewEscortForm;
