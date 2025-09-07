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
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface Prop {
  className?: String;
  control?: any;
  form?: any;
}
const WorkHoursForm = ({ control, form, className }: Prop) => {
  return (
    <div className={cn("", className)}>
      <h4 className="my-4 font-bold text-white/50 text-base underline mb-3">
        Opening Hours
      </h4>
      <div className="flex flex-col lg:flex-row w-full gap-10">
        {/* monday - thursdaye working hours */}
        <div className="lg:basis-1/2 basis-full space-y-6">
          <>
            <FormField
              control={form.control}
              name="monday"
              render={({ field }) => (
                <>
                  <FormItem className=" flex-row justify-between   flex gap-4  border-none">
                    <FormLabel className=" font-medium text-nowrap mb-2 text-white/40 text-base">
                      Monday:
                    </FormLabel>
                    <FormControl className="border w-[200px] border-primary">
                      <Input
                        placeholder="08:00 - 20:00"
                        {...field}
                        className="bg-white  text-black px-6 h-10 rounded-full text-2xl focus-visible:ring-0 "
                      />
                    </FormControl>
                  </FormItem>
                  <FormMessage className="-mt-4" />
                </>
              )}
            />
          </>

          <FormField
            control={form.control}
            name="tuesday"
            render={({ field }) => (
              <>
                <FormItem className=" flex-row justify-between   flex gap-4  border-none">
                  <FormLabel className=" font-medium text-nowrap mb-2 text-white/40 text-base">
                    Tuesday:
                  </FormLabel>
                  <FormControl className="border w-[200px] border-primary">
                    <Input
                      placeholder="08:00 - 20:00"
                      {...field}
                      className="bg-white  text-black px-6 h-10 rounded-full text-2xl focus-visible:ring-0 "
                    />
                  </FormControl>
                </FormItem>
                <FormMessage className="-mt-4" />
              </>
            )}
          />

          <FormField
            control={form.control}
            name="wednesday"
            render={({ field }) => (
              <>
                <FormItem className=" flex-row justify-between   flex gap-4  border-none">
                  <FormLabel className=" font-medium text-nowrap mb-2 text-white/40 text-base">
                    Wednesday:
                  </FormLabel>
                  <FormControl className="border w-[200px] border-primary">
                    <Input
                      placeholder="08:00 - 20:00"
                      {...field}
                      className="bg-white  text-black px-6 h-10 rounded-full text-2xl focus-visible:ring-0 "
                    />
                  </FormControl>
                </FormItem>
                <FormMessage className="-mt-4" />
              </>
            )}
          />

          <FormField
            control={form.control}
            name="thursday"
            render={({ field }) => (
              <>
                <FormItem className=" flex-row justify-between   flex gap-4  border-none">
                  <FormLabel className=" font-medium text-nowrap mb-2 text-white/40 text-base">
                    Thursday:
                  </FormLabel>
                  <FormControl className="border w-[200px] border-primary">
                    <Input
                      placeholder="08:00 - 20:00"
                      {...field}
                      className="bg-white  text-black px-6 h-10 rounded-full text-2xl focus-visible:ring-0 "
                    />
                  </FormControl>
                </FormItem>
                <FormMessage className="-mt-4" />
              </>
            )}
          />
        </div>

        {/* friday - sunday working hours */}

        <div className="lg:basis-1/2 basis-full space-y-6">
          <FormField
            control={form.control}
            name="friday"
            render={({ field }) => (
              <>
                <FormItem className=" flex-row justify-between   flex gap-4  border-none">
                  <FormLabel className=" font-medium text-nowrap mb-2 text-white/40 text-base">
                    Friday:
                  </FormLabel>
                  <FormControl className="border w-[200px] border-primary">
                    <Input
                      placeholder="08:00 - 20:00"
                      {...field}
                      className="bg-white  text-black px-6 h-10 rounded-full text-2xl focus-visible:ring-0 "
                    />
                  </FormControl>
                </FormItem>
                <FormMessage className="-mt-4" />
              </>
            )}
          />
          <FormField
            control={form.control}
            name="saturday"
            render={({ field }) => (
              <>
                <FormItem className=" flex-row justify-between   flex gap-4  border-none">
                  <FormLabel className=" font-medium text-nowrap mb-2 text-white/40 text-base">
                    Saturday:
                  </FormLabel>
                  <FormControl className="border w-[200px] border-primary">
                    <Input
                      placeholder="08:00 - 20:00"
                      {...field}
                      className="bg-white  text-black px-6 h-10 rounded-full text-2xl focus-visible:ring-0 "
                    />
                  </FormControl>
                </FormItem>
                <FormMessage className="-mt-4" />
              </>
            )}
          />
          <FormField
            control={form.control}
            name="sunday"
            render={({ field }) => (
              <>
                <FormItem className=" flex-row justify-between   flex gap-4  border-none">
                  <FormLabel className=" font-medium text-nowrap mb-2 text-white/40 text-base">
                    Sunday:
                  </FormLabel>
                  <FormControl className="border w-[200px] border-primary">
                    <Input
                      placeholder="08:00 - 20:00"
                      {...field}
                      className="bg-white  text-black px-6 h-10 rounded-full text-2xl focus-visible:ring-0 "
                    />
                  </FormControl>
                </FormItem>
                <FormMessage className="-mt-4" />
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkHoursForm;
