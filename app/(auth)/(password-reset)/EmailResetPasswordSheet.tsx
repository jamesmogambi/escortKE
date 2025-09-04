"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, XIcon } from "lucide-react";
import { useSignIn } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import SuccessToast from "@/components/Toasts/SuccessToast";
import { toast } from "sonner";
import { useUserInputStore } from "@/store/passwordResetStore";
// import { useEmailStore } from "@/store/emailStore";

interface Prop {
  className?: string;
  children: React.ReactNode;
}

const schema = z.object({
  email: z
    .string({ error: "Please Enter Email ID." })
    .email("Invalid email address"),
});

type FormData = z.infer<typeof schema>;
const EmailResetPasswordSheet = ({ children, className }: Prop) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const [open, setOpen] = React.useState(false);

  const [error, setError] = useState<any>(null);

  const { signIn } = useSignIn();

  const router = useRouter();

  //   const { setEmail } = useEm?ailStore();
  const { setEmail } = useUserInputStore();

  const { handleSubmit, formState } = form;

  const { isSubmitting } = formState;

  const onSubmit = async (data: FormData) => {
    console.log("password recover form data", data);

    const { email } = data;

    setError(null);
    //   setLoader(true);

    try {
      if (signIn) {
        await signIn.create({
          strategy: "reset_password_email_code",
          identifier: email,
        });
        setOpen(false);
        setEmail(email);
        toast.custom(() => (
          <SuccessToast message="Check your email for the password reset code!" />
        ));

        // redirect user to verify-email page
        router.push("/verify-password-reset-email");
      } else {
        setError("Sign-in functionality is not available.");
      }
    } catch (error: any) {
      setError(error.errors[0]?.message || "Password Reset failed");
    } finally {
      // setLoader(false);
      console.log("finished!");
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogOverlay className="bg-white/90" />

        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className=" border-0 border-green-600 top-[40%]  ">
          <DialogClose asChild>
            <button className="absolute -top-6 right-4 p-2 rounded-sm overflow-hidden cursor-pointer z-20 bg-primary text-white">
              <XIcon className="size-8" />
            </button>
          </DialogClose>

          <DialogHeader>
            <span
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 cursor-pointer text-primary text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.28 7.72a.75.75 0 0 1 0 1.06l-2.47 2.47H21a.75.75 0 0 1 0 1.5H4.81l2.47 2.47a.75.75 0 1 1-1.06 1.06l-3.75-3.75a.75.75 0 0 1 0-1.06l3.75-3.75a.75.75 0 0 1 1.06 0Z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Back</span>
            </span>
            <DialogTitle className="text-center text-xl text-primary uppercase">
              Forgot your password?
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full mb-3 flex flex-col items-center  border-none">
                    <FormLabel className="text-center text-primary font-semibold text-lg">
                      Please enter your email
                    </FormLabel>
                    <FormControl className="w-full rounded-lg border border-gray-1/20 text-gray-1">
                      <div className="flex  w-full items-center  text-gray-1/60">
                        <Input
                          placeholder="Email"
                          type="email"
                          {...field}
                          className="bg-white  flex-1 flex border-primary text-black  h-12  focus-visible:ring-0 "
                        />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <p className="text-center text-primary">{error}</p>}
              {/* submit button */}
              {/* <Button className="bg-primary h-14 my-4 w-full  flex py-5 cursor-pointer pt-6 justify-center items-center gap-1 group text-white ">
              <span className="text-2xl font-semibold">Reset Password</span>{" "}
              <ChevronRight
                strokeWidth={4}
                className=" size-7 hidden group-hover:block"
              />
            </Button> */}
              <Button
                type="submit"
                //   onClick={handleSubmit}
                disabled={isSubmitting}
                className={`bg-primary mt-6 h-14 my-4 w-full flex py-5 pt-6 justify-center items-center gap-1 group text-white ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <span className="text-2xl font-semibold">
                  {isSubmitting ? "Submitting..." : "Reset Password"}
                </span>
                {!isSubmitting && (
                  <ChevronRight
                    strokeWidth={4}
                    className="size-7 hidden group-hover:block"
                  />
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailResetPasswordSheet;
