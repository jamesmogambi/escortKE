"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useFormPersist from "react-hook-form-persist";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ArrowDown, X } from "lucide-react";
import { toast } from "sonner";
import SectionCard from "@/components/SectionCard";
import SuccessToast from "@/components/Toasts/SuccessToast";
import { saveNewEscortProfile } from "@/actions/escort";
import { useUser } from "@clerk/nextjs";
import { useFormStore } from "@/store/formStore";
import { useSettingStore } from "@/store/settingStore";
import { useFileStore } from "@/store/fileStore";
import { useLocationStore } from "@/store/locationStore";
import IntroSection from "../new-profile/IntroSection";
import RichTextEditor from "../new-profile/RichTextEditor";
import WorkHoursForm from "../new-profile/WorkHoursForm";
import SettingsForm from "../new-profile/SettingsForm";
import AboutMeForm from "../new-profile/AboutMeForm";
import PreviewPhoto from "../new-profile/PreviewPhoto";
import SelectPackagesForm from "../new-profile/SelectPackagesForm";
import PhotoVideoUploads from "../new-profile/PhotoVideoUploads";
import { useVariantStore } from "@/store/variantStore";
import Image from "next/image";

/* -------------------------------- schema -------------------------------- */

const timeRangeRegex =
  /^([01]\d|2[0-3])[-:]([0-5]\d)\s*-\s*([01]\d|2[0-3])[-:]([0-5]\d)$/;

const daySchema = z.string().regex(timeRangeRegex).default("");

export const formSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  street: z.string().min(3),
  phone: z.string(),
  whatsappNumber: z.string(),
  monday: daySchema,
  tuesday: daySchema,
  wednesday: daySchema,
  thursday: daySchema,
  friday: daySchema,
  saturday: daySchema,
  sunday: daySchema,
  myAge: z.string(),
  myHeight: z.string(),
  myBreasts: z.string(),
  myWeight: z.string(),
});

/* -------------------------------- props -------------------------------- */

interface Props {
  className?: string;
  initialData?: any; // escort profile from DB
}

/* ------------------------------- component ------------------------------- */

const DEFAULT_VALUES = {
  name: "",
  email: "",
  street: "",
  phone: "",
  whatsappNumber: "",
  monday: "",
  tuesday: "",
  wednesday: "",
  thursday: "",
  friday: "",
  saturday: "",
  sunday: "",
  myAge: "",
  myHeight: "",
  myBreasts: "",
  myWeight: "",
};

const EditEscortForm = ({ className, initialData }: Props) => {
  const router = useRouter();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  /* ----------------------------- react-hook-form ---------------------------- */

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { watch, setValue, formState } = form;

  /* ----------------------- PREVENT persist overwrite ----------------------- */

  useFormPersist("escort-form", {
    watch,
    setValue,
  });

  /* ----------------------------- hydrate RHF ----------------------------- */

  useEffect(() => {
    if (!initialData) return;

    form.reset({
      name: initialData.name ?? "",
      email: initialData.email ?? "",
      street: initialData.street ?? "",
      phone: initialData.telephone ?? "",
      whatsappNumber: initialData.whatsappPhone ?? "",

      monday: initialData.openingHours?.monday ?? "",
      tuesday: initialData.openingHours?.tuesday ?? "",
      wednesday: initialData.openingHours?.wednesday ?? "",
      thursday: initialData.openingHours?.thursday ?? "",
      friday: initialData.openingHours?.friday ?? "",
      saturday: initialData.openingHours?.saturday ?? "",
      sunday: initialData.openingHours?.sunday ?? "",

      myAge: initialData.age ?? "",
      myHeight: initialData.height ?? "",
      myBreasts: initialData.breasts ?? "",
      myWeight: initialData.weight ?? "",
    });

    setHydrated(true);
  }, [initialData, form]);

  /* ---------------------------- hydrate zustand ---------------------------- */

  useEffect(() => {
    if (!initialData) return;

    useFormStore.setState({
      description: initialData.about ?? "",
      region: initialData.region ?? "",
      town: initialData.town ?? "",
      tags: initialData.extraServices ?? [],
      breast: initialData.breastSize ?? "",
      age: initialData.age ?? "",
      character: initialData.character ?? "",
      hairColor: initialData.hairColor ?? "",
      experience: initialData.experience ?? "",
      nationality: initialData.nationality ?? "",
    });

    useSettingStore.setState({
      categories: initialData.categories ?? [],
      languages: initialData.languages ?? [],
      availability: initialData.availability ?? [],
      selected: initialData.practices ?? [],
      bdsm: initialData.bdsm ?? [],
      massages: initialData.massages ?? [],
    });

    setPreviewPhoto(initialData.previewPhoto || null);

    useFileStore.setState({
      existingImages: initialData.images ?? [],
    });

    // useFileStore.setState({
    //   existingImages: initialData.images ?? [],
    //   previewImage: initialData.previewPhoto ?? null,
    // });
  }, [initialData]);

  /* -------------------------------- submit -------------------------------- */

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      setError(null);

      const formStore = useFormStore.getState();
      const settingStore = useSettingStore.getState();

      const payload = {
        ...values,
        // previewPhoto: useFileStore.getState().previewImage,
        // images: useFileStore.getState().existingImages,
        about: formStore.description,
        region: formStore.region,
        town: formStore.town,
        categories: settingStore.categories,
        languages: settingStore.languages,
        availability: settingStore.availability,
        practices: settingStore.selected,
        bdsm: settingStore.bdsm,
        massages: settingStore.massages,
        role: "escort",
        clerkUserId: user?.id,
      };

      await saveNewEscortProfile(payload);

      toast.custom(() => <SuccessToast message="Profile saved successfully" />);

      localStorage.removeItem("escort-form");
      router.push("/administration");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------- render -------------------------------- */

  if (!hydrated && initialData) {
    return <div className="p-10">Fetching Profile...</div>;
  }

  return (
    <div className={cn(className)}>
      <SectionCard className="px-12">
        <h3 className="text-2xl mb-6 font-semibold">
          {initialData ? "Edit" : "New"}{" "}
          <span className="text-primary font-bold">Escort</span> Profile
        </h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <IntroSection form={form} />

            <section className="flex flex-col lg:flex-row gap-6 mt-10">
              <div className="lg:w-1/2">
                <RichTextEditor />
                <WorkHoursForm form={form} className="mt-6" />
                <SettingsForm form={form} className="mt-10" />
                <AboutMeForm form={form} className="mt-6" />

                <div>
                  {/* TODO://Display Preview Photo */}
                  {previewPhoto && (
                    <div className="relative mt-6 inline-block">
                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => {
                          // your delete logic here
                          // e.g. clear preview from zustand or RHF
                        }}
                        className="absolute top-2 right-2 z-10 rounded-full bg-primary p-1.5 text-white hover:bg-red-600 transition"
                      >
                        <X size={16} />
                      </button>

                      {/* Preview image */}
                      <Image
                        src={previewPhoto}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}
                  <PreviewPhoto form={form} className="mt-10" />
                </div>
              </div>

              <div className="lg:w-1/2">
                <SelectPackagesForm form={form} />
              </div>
            </section>

            {/* TODO: Render files correctly */}
            <PhotoVideoUploads />

            {error && (
              <p className="bg-red-500 text-white p-3 text-center">{error}</p>
            )}

            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={loading}
                className="w-3/4 lg:w-1/4 p-10"
              >
                <ArrowDown className="mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </SectionCard>
    </div>
  );
};

export default EditEscortForm;
