import { cn } from "@/lib/utils";
import React from "react";
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
interface Prop {
  className?: string;
  form: any;
}
const SettingsForm = ({ form, className }: Prop) => {
  const { setValue } = form;

  const handleSelectChange = (value: any, name: keyof FormData) => {
    setValue(name, value);
  };

  const ageValue = form.watch("variantAge");

  const { age } = variantSettings;
  return (
    <div className={cn("space-y-6", className)}>
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem className=" flex-row  justify-between flex gap-2  border-none">
            {/* <FormLabel className=" font-medium text-nowrap mb-2 text-white/40 text-base">
              Phone:
            </FormLabel> */}
            <FormControl className="border w-1/2 border-primary">
              <ProfileSelectInput
                onChange={handleSelectChange}
                value={ageValue}
                name="phone"
                options={[age]}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SettingsForm;
