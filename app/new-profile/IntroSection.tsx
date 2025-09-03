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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { regions, towns } from "@/fixtures/location";
import { useFormStore } from "@/store/formStore";
import { variantSettings } from "@/fixtures/setting";
// import { Checkbox } from "@radix-ui/react-checkbox";
import { useSettingStore } from "@/store/settingStore";
import { Checkbox } from "@/components/ui/checkbox";

interface Prop {
  className?: string;
  form: any;
}
const IntroSection = ({ form, className }: Prop) => {
  const [regionOpen, setRegionOpen] = React.useState<boolean>(false);
  const [cityOpen, setCityOpen] = React.useState<boolean>(false);

  const { watch, setValue } = form;

  const { city, region, setCity, setRegion } = useFormStore();

  const { languages, setLanguage, availability, setAvailability } =
    useSettingStore();

  return (
    <section className={cn("flex gap-2 lg:gap-10", className)}>
      {/* 1 */}
      <div className=" space-y-6  basis-1/3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <>
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
              </FormItem>
              <FormMessage className="-mt-4" />
            </>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <>
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
              </FormItem>
              <FormMessage className="-mt-4" />
            </>
          )}
        />

        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <>
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
              </FormItem>

              <FormMessage className="-mt-4" />
            </>
          )}
        />
      </div>
      {/* 2 */}

      <div className="  space-y-6  basis-1/3">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <>
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
              </FormItem>
              <FormMessage className="-mt-4" />
            </>
          )}
        />

        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <>
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
                            onSelect={(val: any) => setRegion(item.location)}
                            key={item.id}
                          >
                            {item.location}
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </FormControl>
              </FormItem>
              <FormMessage className="-mt-4" />
            </>
          )}
        />

        {/* TODO: AVAILABILITY */}
        <div className="flex  mt-12  justify-end items-center gap-3">
          <label className="text-white/50 text-base font-medium">
            Availability:
          </label>
          {variantSettings.availability.map((i) => (
            <div>
              <div key={i} className="flex items-center gap-2">
                <Checkbox
                  id={i}
                  className="size-7 cursor-pointer data-[state=checked]:bg-primary bg-white rounded-md   outline-none border-0 border-primary"
                  checked={availability.includes(i)}
                  onCheckedChange={(checked) =>
                    setAvailability(i, checked === true)
                  }
                />
                <label className="text-primary text-lg  font-bold">{i}</label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 */}

      <div className="  space-y-6  basis-1/3">
        <FormField
          control={form.control}
          name="whatsappNumber"
          render={({ field }) => (
            <>
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
              </FormItem>
              <FormMessage className="-mt-4" />
            </>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <>
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
                            onSelect={(val: any) => setCity(item.location)}
                            key={item.id}
                          >
                            {item.location}
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </FormControl>
              </FormItem>
              <FormMessage className="-mt-4" />
            </>
          )}
        />
      </div>
    </section>
  );
};

export default IntroSection;
