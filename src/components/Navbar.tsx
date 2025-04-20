"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-[#ffe6a7] p-4 rounded-b-3xl relative">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex flex-row pl-8 items-center hover:text-[#e63946] hover:scale-115 duration-300"
        >
          <Image src="/images/logo.png" alt="logo" width={100} height={100} />
          <h1 className="text-4xl font-bold">Recipe Explorer</h1>
        </Link>
        <div className="flex gap-8 pr-12 items-center">
          <Link
            href="/about"
            className="font-bold text-2xl hover:text-[#e63946] hover:scale-110 duration-300"
          >
            About
          </Link>
          <Link
            href="/recipe"
            className="font-bold text-2xl hover:text-[#e63946] hover:scale-110 duration-300"
          >
            Recipes
          </Link>
          <Link
            href="/feedback"
            className="font-bold text-2xl hover:text-[#e63946] hover:scale-110 duration-300"
          >
            Feedback
          </Link>
        </div>
      </div>
    </nav>
  );
}
