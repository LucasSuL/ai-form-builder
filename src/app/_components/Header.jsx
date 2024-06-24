"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  const { user, isSignedIn } = useUser();

  return (
    <div className="border-b shadow-sm">
      <div className="flex items-center justify-between p-3">
        <Image src="/logo.svg" width={150} height={50} />
        {isSignedIn ? (
          <div className="flex align-middle gap-4">
            <Link href={'/dashboard'}>
            <Button variant="outline">Dashboard</Button>
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
  );
};

export default Header;
