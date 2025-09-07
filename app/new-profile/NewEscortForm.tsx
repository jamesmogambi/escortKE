"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { boolean, z } from "zod";
import { Button } from "@/components/ui/button";

import { Form } from "@/components/ui/form";

import { useRouter } from "next/navigation";
import SectionCard from "@/components/SectionCard";
import { cn } from "@/lib/utils";
import React, { startTransition, useState } from "react";
import WorkHoursForm from "./WorkHoursForm";
import SettingsForm from "./SettingsForm";
import AboutMeForm from "./AboutMeForm";
import PreviewPhoto from "./PreviewPhoto";
import SelectPackagesForm from "./SelectPackagesForm";
import { ArrowBigDown, ArrowDown, Weight } from "lucide-react";
import PhotoVideoUploads from "./PhotoVideoUploads";
import IntroSection from "./IntroSection";
import RichTextEditor from "./RichTextEditor";
import { useFormStore } from "@/store/formStore";
import { useSettingStore } from "@/store/settingStore";
import { categories } from "@/fixtures/categories";
import { useFileStore } from "@/store/fileStore";
import { createNewEscort } from "@/actions/escort";
import { useUser } from "@clerk/nextjs";
import { practices } from "@/fixtures/practice";

// Define the RichTextEditorHandle type
type RichTextEditorHandle = {
  getContent: () => string;
};

interface Prop {
  className?: string;
}

const timeRangeRegex =
  /^([01]\d|2[0-3])[-:]([0-5]\d)\s*-\s*([01]\d|2[0-3])[-:]([0-5]\d)$/;

// const daySchema = z.string().regex(timeRangeRegex, "Invalid time range");
// .default('');
const defaultDay = "";

const daySchema = z
  .string()
  .regex(timeRangeRegex, "Invalid time range")
  .default(defaultDay);

export const formSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.email({ error: "Invalid email address" }),

  street: z
    .string({ error: "Street is required" })
    .min(3, "Street name must be at least 3 characters"),
  whatsappNumber: z
    .string({ error: "WhatsApp number is required" })
    .regex(/^\+?[0-9]{7,15}$/, "Invalid WhatsApp number"),
  phone: z
    .string({ error: "Phone number is required" })
    .regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"),
  address: z
    .string({ error: "Address is required" })
    .min(5, "Address must be at least 5 characters"),
  // description: z.string({}).min(10, "Description must be at least 10 characters"),
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
  // photo: z.any,
  variantAvailability: z.array(z.string().min(1, "Tag cannot be empty")),
});
const NewEscortForm = ({ className }: Prop) => {
  // TODO: store the user preview image
  // const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const router = useRouter();

  const [error, setError] = useState<any>(null);
  const [loading, setLoader] = useState<any>(false);

  const { user, isLoaded, isSignedIn } = useUser();

  console.log("user - role", user);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "James Mogambi",
      email: "mogambi48@icloud.com",
      street: "Kirirgiti",
      phone: "0701694004",
      whatsappNumber: "0743129621",
      address: "Kirirnyaga 102",
      myAge: "20",
      myBreasts: "45",
      myWeight: "98",
      myHeight: "67",
      variantAge: "",
      variantAvailability: ["incall", "outcall"],
    },
  });

  const { watch, setValue, formState } = form;

  const { isSubmitting } = formState;

  const {
    description,
    region,
    town,
    age,
    breast,
    character,
    hairColor,
    nationality,
    experience,
    tags,
    files: selectedFiles = [],
  } = useFormStore();

  const {
    selected,
    massages,
    bdsm,
    categories: settingCategories,
    languages,
    availability,
  } = useSettingStore();

  const { files: gallery } = useFileStore();

  // Save user data to the database
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("hi there");
    const {
      address,
      name,
      email,
      whatsappNumber,
      street,
      phone,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
      myAge,
      myHeight,
      myBreasts,
      myWeight,
      // photo,
    } = values;
    // form.handleSubmit(onSubmit, (errors) => {
    //   console.error("Validation errors:", errors);
    // });

    // if (!isLoaded || !isSignedIn) {
    //   return;
    // }

    startTransition(async () => {
      setLoader(true);
      setError(null);
      try {
        // Update username in Clerk
        console.log("form-values", {
          ...form.getValues(),
          town,
          region,
          selectedAvailabilty: availability,
          description,
          age,
          breast,
          character,
          hairColor,
          nationality,
          experience,
          tags,
          previewPhoto: selectedFiles,
          selectedPractices: selected,
          selectedMassage: massages,
          selectedBDSM: bdsm,
          selectedCategories: settingCategories,
          selectedLanguages: languages,
          selectedGallery: gallery,
        });

        // 1 validate region
        if (!region) {
          setError("Please select your region");
          return;
        }

        // 2. validate region
        if (!town) {
          setError("Please select your area or town");
          return;
        }

        // validate your categories
        if (settingCategories.length === 0) {
          setError("Please select categories you want to appear");
          return;
        }

        // extract only images from gallery
        const allFiles = Array.from(useFileStore.getState().fileMap.values());
        console.log("file-map values", allFiles);
        const imageFiles = allFiles.filter((file) =>
          file.type.startsWith("image/")
        );
        console.log("front-end image files----", imageFiles);

        let imgGalleryUrls;
        let videoGalleryUrls;
        let previewPhotoUrl = "";

        // TODO: 1- UPLOAD IMAGES TO S3

        const formData = new FormData();
        imageFiles.forEach((file) => {
          formData.append("images", file); // must match `formData.getAll("images")` on server
        });
        // attach preview photo

        if (selectedFiles && selectedFiles.length > 0) {
          formData.append("images", selectedFiles[0]);
        }

        const res = await fetch("/api/s3/upload-escort-images", {
          method: "POST",
          body: formData,
        });

        if (res.status === 201) {
          const { imageUrls } = await res.json();
          console.log("✅ Uploaded:", imageUrls);
          imgGalleryUrls = imageUrls;
          if (selectedFiles && selectedFiles.length > 0) {
            previewPhotoUrl = imageUrls?.at?.(-1);
          }
          // Optionally show placeholders or start polling for status
        } else {
          console.error("❌ Upload failed:", res.status);
        }

        // if (!res.ok) {
        //   console.error("Upload failed");
        //   return;
        // }

        // TODO: 2- UPLOAD videos to MUX

        const videoFiles = allFiles.filter((file) =>
          file.type.startsWith("video/")
        );

        console.log("all video files", videoFiles);

        const videoFormData = new FormData();

        videoFiles.forEach((file) => {
          videoFormData.append("videos", file); // must match `formData.getAll("images")` on server
        });

        const clerkId: any = user?.id;
        console.log("clerk-id", clerkId);
        videoFormData.append("clerkUserID", clerkId);

        const videoRes = await fetch("/api/mux/upload-videos", {
          method: "POST",
          body: videoFormData,
        });

        if (videoRes.status === 201) {
          // const { uploads } = await res.json();
          console.log("✅ Upload initiated:");
          // for videos webhook will update the record
          // Optionally show placeholders or start polling for status
        } else {
          console.error("❌ Upload failed:", res.status);
        }

        // TODO: 3- Update clerk user role = 'escort'

        // TODO: 4-create and save profile in Escorts schmea = 'escort'
        const escortImages = imgGalleryUrls.filter(
          (item: any) => item !== previewPhotoUrl
        );
        const escortData = {
          name,
          clerkUserid: clerkId,
          previewPhoto: imgGalleryUrls.at(-1),
          // age,
          telephone: phone,
          whatsappPhone: whatsappNumber,
          // exclude the last item if previewPhoto is their
          images: escortImages,
          // videos will be handled by mux webhook
          // videos
          about: description,
          availability,
          // ethnicity
          nationality,
          bustSize: breast,
          // Weight,
          // zodiacSign,
          // sexualOrientation,
          languages,
          // estate
          town,
          region,
          practices: selected,
          bdsm,
          massages,
          extraServices: tags,
          role: "escort",
          openingHours: {
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday,
          },
          ageCategory: age,
          character,
          hairColor,
          experience,
          age: myAge,
          breasts: myBreasts,
          weight: myWeight,
          height: myHeight,
          categories: settingCategories,
          address,
          email,
        };

        const escortRes = await createNewEscort(escortData);
        // await createNewEscort({
        //   imageFiles: allFiles,
        //   videoFiles: [],
        //   previewPhoto: selectedFiles?.[0],
        // });
        //  if all is well proceed

        // alert("submit form");
        // Save user info in the database
        router.push("/administration");
        // Scroll user to the top after successful update
        // window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error: any) {
        console.error("Error saving profile", error);
        setError(error?.message || "Something went wrong");
      } finally {
        setLoader(false);
      }
    });
  };
  return (
    <div className={cn("", className)}>
      <SectionCard className="px-12">
        <h3 className="text-2xl mb-5 font-semibold">
          New{" "}
          <span className="text-primary font-semibold">profile of escort</span>
        </h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            // onSubmit={form.handleSubmit(onSubmit, (errors) => {
            //   console.error("Validation errors:", errors);
            // })}
            className="space-y-3"
          >
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

              <div className="basis-1/2 relative  border-green-600">
                <SelectPackagesForm form={form} />
              </div>
            </section>
            <PhotoVideoUploads form={form} />

            {error && (
              <p className="p-3 bg-primary text-lg text-white py-2 text-center my-4">
                {error}
              </p>
            )}
            {/* // submit button */}
            <div className="flex justify-center ">
              <Button
                disabled={loading}
                className="flex w-1/4 rounded-none  items-center  gap-2 p-12 text-white bg-primary"
                type="submit"
              >
                <ArrowDown
                  className={cn("size-8", isSubmitting ? "hidden" : "block")}
                  strokeWidth={4}
                />
                <span className="uppercase font-semibold text-2xl">
                  {loading ? "Submitting..." : "Create Profile"}
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
