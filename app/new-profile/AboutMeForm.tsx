import { cn } from "@/lib/utils";
import React from "react";

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

interface Prop {
  form: any;
  className?: string;
}
const AboutMeForm = ({ form, className }: Prop) => {
  return (
    <section className={cn("w-full  ", className)}>
      <h4 className="text-lg text-white/50  mb-6 font-bold">About me:</h4>
      <div className="flex ">
        <div className="basis-1/2 space-y-5">
          <FormField
            control={form.control}
            name="myAge"
            render={({ field }) => (
              <FormItem className=" flex-row  border-yellow-800    justify-between  flex gap-4 w-[250px]  ">
                <FormLabel className=" font-medium text-nowrap mb-2 text-white/40 text-base">
                  Age:
                </FormLabel>
                <FormControl className=" w-[150px] border-primary">
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
            name="myHeight"
            render={({ field }) => (
              <FormItem className=" flex-row justify-between   border-green-600   flex gap-4  w-[250px]">
                <FormLabel className=" font-medium text-nowrap mb-2 text-white/40 text-base">
                  Height:
                </FormLabel>
                <FormControl className="border w-[150px]  border-primary">
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

        <div className="basis-1/2 space-y-5">
          <FormField
            control={form.control}
            name="myWeight"
            render={({ field }) => (
              <FormItem className=" flex-row  border-yellow-800    justify-between  flex gap-4 w-[250px]  ">
                <FormLabel className=" font-medium text-nowrap mb-2 text-white/40 text-base">
                  Weight:
                </FormLabel>
                <FormControl className=" w-[150px] border-primary">
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
            name="myBreasts"
            render={({ field }) => (
              <FormItem className=" flex-row justify-between   border-green-600   flex gap-4  w-[250px]">
                <FormLabel className=" font-medium text-nowrap mb-2 text-white/40 text-base">
                  Breasts:
                </FormLabel>
                <FormControl className="border w-[150px]  border-primary">
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
      </div>
    </section>
  );
};

export default AboutMeForm;
