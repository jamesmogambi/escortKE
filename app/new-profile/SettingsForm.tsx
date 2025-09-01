import { cn } from "@/lib/utils";
import React, { useState } from "react";
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
import ProfileGallery from "../girl/ProfileGallery";
import ProfileSelectInput from "./ProfileSelectInput";
import { variantSettings } from "@/fixtures/setting";
import { ServiceTags } from "./ServiceTags";
interface Prop {
  className?: string;
  form: any;
}
const SettingsForm = ({ form, className }: Prop) => {
  const { setValue } = form;

  const [tags, setTags] = useState<string[]>([]);

  const handleSelectChange = (value: any, name: keyof FormData) => {
    setValue(name, value);
  };

  const ageValue = form.watch("variantAge");
  const breastValue = form.watch("variantBreast");
  const characterValue = form.watch("variantCharacter");
  const hairColorValue = form.watch("variantHairColor");
  const nationalityValue = form.watch("variantNationality");

  const { age, breast, character, hairColor, nationality, experience } =
    variantSettings;
  return (
    <div className={cn("space-y-2 w-full", className)}>
      <FormField
        control={form.control}
        name="variantAge"
        render={({ field }) => (
          <FormItem className=" flex-row  w-full justify-between flex gap-2  border-none">
            <FormControl className="border  border-primary">
              <ProfileSelectInput
                onChange={handleSelectChange}
                value={ageValue}
                name="variantAge"
                options={age}
                placeholder="Select age"
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="variantBreast"
        render={({ field }) => (
          <FormItem className=" flex-row  w-full justify-between flex gap-2  border-none">
            <FormControl className="border  border-primary">
              <ProfileSelectInput
                onChange={handleSelectChange}
                value={breastValue}
                name="variantBreast"
                options={breast}
                placeholder="Select breast"
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="variantCharacter"
        render={({ field }) => (
          <FormItem className=" flex-row  w-full justify-between flex gap-2  border-none">
            <FormControl className="border  border-primary">
              <ProfileSelectInput
                onChange={handleSelectChange}
                value={breastValue}
                name="variantCharacter"
                options={character}
                placeholder="Select a character"
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="variantHairColor"
        render={({ field }) => (
          <FormItem className=" flex-row  w-full justify-between flex gap-2  border-none">
            <FormControl className="border  border-primary">
              <ProfileSelectInput
                onChange={handleSelectChange}
                value={hairColorValue}
                name="variantHairColor"
                options={hairColor}
                placeholder="Select hair color"
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="variantNationality"
        render={({ field }) => (
          <FormItem className=" flex-row  w-full justify-between flex gap-2  border-none">
            <FormControl className="border  border-primary">
              <ProfileSelectInput
                onChange={handleSelectChange}
                value={nationalityValue}
                name="variantNationality"
                options={nationality}
                placeholder="Select Nationality"
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="variantExperience"
        render={({ field }) => (
          <FormItem className=" flex-row  w-full justify-between flex gap-2  border-none">
            <FormControl className="border  border-primary">
              <ProfileSelectInput
                onChange={handleSelectChange}
                value={nationalityValue}
                name="variantExperience"
                options={experience}
                placeholder="Select Experience"
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <ServiceTags value={tags} onChange={setTags} />
    </div>
  );
};

export default SettingsForm;
