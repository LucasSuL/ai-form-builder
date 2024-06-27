"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Header = () => {
  const { user, isSignedIn } = useUser();
  const path = usePathname();

  return (
    // if in preview page, hide header
    !path.includes("preview") && (
      <div className="border-b shadow-sm px-5 py-2 sticky z-[100] h-14 inset-x-0 top-0 w-full border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
        {/* <div className="max-w-6xl mx-auto p-3"> */}
          <div className="flex items-center justify-between">
            <Link href={'/'}>
            <div className="flex gap-1 items-center">
              <Image src="/logo.svg" width={40} height={40} />
              <p className="font-bold text-lg">AI Form Builder</p>
            </div>
            </Link>
            {isSignedIn ? (
              <div className="flex align-middle gap-4">
                <Link href={"/dashboard"}>
                  <Button variant="outline">Dashboard ✨</Button>
                </Link>
                <UserButton />
              </div>
            ) : (
              <SignInButton>
                <Button>Get Started</Button>
              </SignInButton>
            )}
          </div>
        </div>
      // </div>
    )
  );
};

export default Header;
