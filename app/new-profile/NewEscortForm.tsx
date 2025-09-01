"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { boolean, z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { regions, towns } from "@/fixtures/location";
import dynamic from "next/dynamic";
import QuillEditor from "./RichEditor";
import { WorkingHoursField } from "./WorkingHoursField";
import WorkHoursForm from "./WorkHoursForm";
import SettingsForm from "./SettingsForm";
// import RichTextEditor from "./RichEditor";

const RichTextEditor = dynamic(() => import("./RichEditor"), {
  ssr: false,
});

// Define the RichTextEditorHandle type
type RichTextEditorHandle = {
  getContent: () => string;
};

interface Prop {
  className?: string;
}

const timeRangeRegex =
  /^([01]\d|2[0-3])[-:]([0-5]\d)\s*-\s*([01]\d|2[0-3])[-:]([0-5]\d)$/;

// const daySchema = z
//   .object({
//     enabled: z.boolean(),
//     range: z.string().regex(timeRangeRegex, "Invalid time range").optional(),
//   })
//   .refine(
//     (data) => {
//       if (!data.enabled || !data.range) return true;

//       const [startRaw, endRaw] = data.range
//         .split("-")
//         .map((part) => part.trim());
//       const [startHour, startMin] = startRaw.split(/[-:]/).map(Number);
//       const [endHour, endMin] = endRaw.split(/[-:]/).map(Number);

//       const start = startHour * 60 + startMin;
//       const end = endHour * 60 + endMin;

//       return start < end;
//     },
//     {
//       message: "End time must be after start time",
//       path: ["range"],
//     }
//   );

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

  city: z.string().min(2, "City must be at least 2 characters"),

  region: z.string().min(2, "Region must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  monday: daySchema,
  tuesday: daySchema,
  wednesday: daySchema,
  thursday: daySchema,
  friday: daySchema,
  saturday: daySchema,
  sunday: daySchema,
  variantAge: z.string(),
  variantBreast: z.string(),
  variantCharacter: z.string(),
  variantSexPlace: z.string(),
  variantNationality: z.string(),
  variantHairColor: z.string(),
  variantLanguages: z.string(),
  variantAvailability: z.array(z.string().min(1, "Tag cannot be empty")),
});
const NewEscortForm = ({ className }: Prop) => {
  // const [region, setRegion] = useState("");
  const [regionOpen, setRegionOpen] = React.useState<boolean>(false);
  const [cityOpen, setCityOpen] = React.useState<boolean>(false);

  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monday: "8:00-17:00",
      // username: "",
      // email: "",
      // password: "",
      // confirmPassword: "",
      //   agreeTerms:t
      //   terms: false,
      // workingHours: Object.fromEntries(
      //   [
      //     "monday",
      //     "tuesday",
      //     "wednesday",
      //     "thursday",
      //     "friday",
      //     "saturday",
      //     "sunday",
      //   ].map((day) => [day, { enabled: false, start: "", end: "" }])
      // ),
    },
  });

  const { watch, setValue } = form;
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    // upon successful registration user should be redirected to /new profile
    // router.push("/new-profile");
  }

  const region = watch("region");
  const city = watch("city");

  const onHandleRegion = (val: any) => {
    console.log("region, val", val);
    setValue("region", val);

    setRegionOpen(false);
  };

  const onHandleCity = (val: any) => {
    setValue("city", val);
    setCityOpen(false);
  };

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
            <section className="flex gap-2 lg:gap-10 ">
              {/* 1 */}
              <div className=" space-y-6  basis-1/3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className=" flex-row justify-between   flex gap-4  border-none">
                      <FormLabel className=" font-medium text-nowrap mb-2 text-white/40 text-base">
                        Escort's name:
                      </FormLabel>
                      <FormControl className="border flex-1 lg:w-1/2 border-primary">
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
                      <FormControl className="border lg:w-1/2 flex-1 border-primary">
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
                      <FormControl className="border flex-1 lg:w-1/2 border-primary">
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

              <div className="  space-y-6  basis-1/3">
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

                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem className=" flex-row   justify-end flex gap-2  ">
                      <FormControl className="border w-1/2  border-primary">
                        <DropdownMenu
                          open={regionOpen}
                          onOpenChange={setRegionOpen}
                          // onOpenChange={(val) =>
                          //   onHandleRegion(val, field.onChange)
                          // }
                        >
                          <DropdownMenuTrigger className=" outline-0  self-end  cursor-pointer border-0 flex w-full lg:w-[250px] justify-between items-center p-2 text-base px-5 bg-gray-1 rounded-md ">
                            {region ? (
                              <span className="text-white/50 text-base font-semibold">
                                {region}
                              </span>
                            ) : (
                              <span className="text-white/50 text-base font-semibold">
                                Region
                              </span>
                            )}

                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={18}
                              height={18}
                              viewBox="0 0 32 32"
                              className="text-white/50"
                            >
                              <path
                                fill="currentColor"
                                d="M8.037 11.166L14.5 22.36c.825 1.43 2.175 1.43 3 0l6.463-11.195c.826-1.43.15-2.598-1.5-2.598H9.537c-1.65 0-2.326 1.17-1.5 2.6z"
                                strokeWidth={1}
                                stroke="currentColor"
                              ></path>
                            </svg>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            //   side="left"
                            className="flex border-0 flex-col outline-none p-2 gap-3 w-screen  lg:max-w-[900px] bg-gray-1 "
                          >
                            <div className="flex flex-row w-full gap-1.5  flex-wrap">
                              {regions.map((item) => (
                                <DropdownMenuItem
                                  className="rounded-lg cursor-pointer hover:bg-[#262322] p-1.5 px-6 text-white/70 text-base font-medium bg-[#262322]"
                                  // onSelect={(e) => setRegion(item.location)}
                                  onSelect={(val: any) =>
                                    onHandleRegion(item.location)
                                  }
                                  key={item.id}
                                >
                                  {item.location}
                                </DropdownMenuItem>
                              ))}
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 3 */}

              <div className="  space-y-6  basis-1/3">
                <FormField
                  control={form.control}
                  name="whatsappNumber"
                  render={({ field }) => (
                    <FormItem className=" flex-row  justify-between flex gap-2  border-none">
                      <FormLabel className=" font-medium text-nowrap mb-2 text-white/40 text-base">
                        WhatsApp:
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
                  name="city"
                  render={({ field }) => (
                    <FormItem className=" flex-row   justify-end flex gap-2  ">
                      <FormControl className="border w-1/2  border-primary">
                        <DropdownMenu
                          open={cityOpen}
                          onOpenChange={setCityOpen}
                          // onOpenChange={(val) =>
                          //   onHandleRegion(val, field.onChange)
                          // }
                        >
                          <DropdownMenuTrigger className=" outline-0  self-end  cursor-pointer border-0 flex w-full lg:w-[250px] justify-between items-center p-2 text-base px-5 bg-gray-1 rounded-md ">
                            {city ? (
                              <span className="text-white/50 text-base font-semibold">
                                {city}
                              </span>
                            ) : (
                              <span className="text-white/50 text-base font-semibold">
                                City
                              </span>
                            )}

                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={18}
                              height={18}
                              viewBox="0 0 32 32"
                              className="text-white/50"
                            >
                              <path
                                fill="currentColor"
                                d="M8.037 11.166L14.5 22.36c.825 1.43 2.175 1.43 3 0l6.463-11.195c.826-1.43.15-2.598-1.5-2.598H9.537c-1.65 0-2.326 1.17-1.5 2.6z"
                                strokeWidth={1}
                                stroke="currentColor"
                              ></path>
                            </svg>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            //   side="left"
                            className="flex border-0 flex-col outline-none p-2 gap-3 w-screen  lg:max-w-[900px] bg-gray-1 "
                          >
                            <div className="flex flex-row w-full gap-1.5  flex-wrap">
                              {towns.map((item) => (
                                <DropdownMenuItem
                                  className="rounded-lg cursor-pointer hover:bg-[#262322] p-1.5 px-6 text-white/70 text-base font-medium bg-[#262322]"
                                  // onSelect={(e) => setRegion(item.location)}
                                  onSelect={(val: any) =>
                                    onHandleCity(item.location)
                                  }
                                  key={item.id}
                                >
                                  {item.location}
                                </DropdownMenuItem>
                              ))}
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* description and setting section */}
            <section className="flex mt-12 gap-6">
              {/* 1 */}
              <div className=" basis-1/2">
                <FormField
                  control={form.control}
                  name="monday"
                  render={({ field }) => (
                    <FormItem className=" flex-col justify-between   flex gap-4  border-none">
                      <FormLabel className=" font-medium text-nowrap mb-2 text-white/40 text-base">
                        Description of the girl:
                      </FormLabel>
                      <FormControl className="border flex-1 lg:w-1/2 border-primary">
                        <RichTextEditor
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <WorkHoursForm form={form} className={" mt-5"} />

                <SettingsForm form={form} className="mt-10" />
              </div>

              {/* 2 */}

              <div className="basis-1/2"></div>
            </section>
          </form>
        </Form>
      </SectionCard>
    </div>
  );
};

export default NewEscortForm;
