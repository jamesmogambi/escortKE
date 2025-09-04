"use client";
import Image from "next/image";
import React from "react";
import NavMenu from "./NavMenu";
import Link from "next/link";
import { Search } from "lucide-react";
import NavActions from "./NavActions";
import MobileHeader from "./MobileHeader";
import SearchSheet from "./SearchSheet";
import { useUser } from "@clerk/nextjs";

const Header = () => {
  const { isSignedIn } = useUser();

  return (
    <>
      <MobileHeader />
      <div className="lg:flex hidden items-center gap-12 w-full px-12 bg-dark-slate">
        {/* logo */}
        <Link href="/">
          <Image
            alt="logo"
            width={250}
            height={115}
            src={"/logo.jpg"}
            priority
            quality={100}
          />
        </Link>

        <div className=" border-white flex flex-1 items-center justify-between">
          {/* menu */}

          <NavMenu />

          {/* actions */}

          {isSignedIn ? (
            <NavActions />
          ) : (
            <div className="flex gap-3 items-center">
              <SearchSheet />
              <div className="flex gap-3">
                <Link
                  className="text-white font-medium p-2 px-4 rounded-sm  hover:text-primary  bg-[#343434]"
                  href=""
                >
                  apply for
                </Link>

                <Link
                  className="text-white p-2 text-nowrap   px-4 font-medium rounded-sm   bg-primary"
                  href="/private-escort-record"
                >
                  register escort
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
