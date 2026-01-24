import { auth, clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import namespace from "quill/core/logger";
import React from "react";

interface MyGirlsProps {
  girls?: any[];
}
const MyGirls = async ({ girls }: MyGirlsProps) => {
  const res = await auth();

  //   const user = await clerkClient.users.getUser(res.userId!);

  if (!girls || girls.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-primary">
        No girls found
      </div>
    );
  }

  const { name, isActive } = girls[0];

  const firstTwoNames = name.split(" ").slice(0, 2).join(" ");
  return (
    <>
      <h4 className="mb-8 text-2xl font-bold">My Girls</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {girls.map((girl) => (
          <div
            key={girl._id}
            className="  transition h-[450px] text-4xl font-bold hover:shadow-xl shadow-stone-200/60 relative cursor-pointer border-[0.2px] p-0 rounded-lg overflow-hidden border-gray-500"
          >
            <Image
              src={girl.previewPhoto || "/placeholder.jpg"}
              alt={girl.name || "Escort"}
              fill
              className="object-cover overflow-hidden"
            />

            <div className="absolute inset-0 bg-black/40" />

            {/* // content section */}
            <div className="absolute  border-green-400 overflow-hidden  inset-0   bottom-0 z-10  text-white">
              <div className="flex flex-1">
                {/* section 1 */}
                <div className=" border-b-[7px]  border-primary">
                  <div className="  text-base  text-white">
                    <Link
                      className="bg-primary p-2 pt-3 text-white"
                      href={`/edit-profile/${girl.clerkUserId}`}
                    >
                      Edit Girl
                    </Link>
                  </div>

                  <div className="w-full">
                    <div
                      //   href={`<some_url>`}
                      className="bg-green-400 m-6 flex items-center justify-center size-7 p-4 text-white"
                    >
                      <Link href={`/edit-profile/${girl.clerkUserId}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6"
                        >
                          <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  <p className="text-white text-base text-center p-3 mt-4">
                    Your profile is now being approved by an administrator (max
                    24 hours on business days)
                  </p>

                  <div className="flex -mb-1 mt-10 items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      className=""
                    >
                      <path
                        fill="#FE0032"
                        d="M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19"
                        strokeWidth={0.5}
                        stroke="#FE0032"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* section 2 */}
              <div className="px-2.5 ">
                <h4 className="text-primary text-2xl  mt-8">{firstTwoNames}</h4>

                <div className="flex mt-3 mb-6 justify-between items-center">
                  <span
                    className={`${isActive ? "bg-green-400 text-white" : "bg-white text-black"}  uppercase p-3 text-lg`}
                  >
                    Active
                  </span>

                  <span
                    className={`${!isActive ? "bg-red-400 text-white" : "bg-white text-black"}  uppercase p-3 text-lg`}
                  >
                    inActive
                  </span>
                </div>
              </div>
              {/* TODO: ADD OTHER SECTION */}

              <div className="h-8"></div>
            </div>
            {/* <div>
              <div className="relative aspect-3/4">
                <Image
                  src={girl.previewPhoto || "/placeholder.jpg"}
                  alt={girl.name || "Escort"}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-3">
                <h3 className="font-semibold text-lg truncate">
                  {girl.name || "Unknown"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {girl.age && `${girl.age} yrs`}
                  {girl.town && ` • ${girl.town}`}
                </p>
              </div>
            </div> */}
          </div>
        ))}
      </div>
    </>
  );
};

export default MyGirls;
