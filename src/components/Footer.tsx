import {
  Facebook,
  FileWarning,
  Home,
  Instagram,
  MessageCircleMore,
  Utensils,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#ffe6a7] p-4 rounded-t-3xl mt-auto">
      <div className="flex flex-col md:flex-row justify-around items-center gap-8 md:gap-0">
        <Link
          href="/"
          className="flex flex-col items-center justify-center hover:text-[#e63946] hover:scale-115 duration-300"
        >
          <Image
            src="/images/logo.png"
            alt="logo"
            width={150}
            height={150}
            className="w-32 md:w-40 lg:w-[150px]"
          />
          <h1 className="text-lg md:text-xl text-center font-bold">
            Recipe Explorer Lite
          </h1>
        </Link>
        <div className="flex flex-col md:flex-row gap-8 md:gap-24">
          <div>
            <h3 className="font-bold pb-4 md:pb-8 text-center md:text-left">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="flex flex-row hover:text-[#e63946] hover:scale-110 duration-300"
                >
                  <Home className="mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="flex flex-row hover:text-[#e63946] hover:scale-110 duration-300"
                >
                  <FileWarning className="mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/recipe"
                  className="flex flex-row hover:text-[#e63946] hover:scale-110 duration-300"
                >
                  <Utensils className="mr-2" />
                  Recipes
                </Link>
              </li>
              <li>
                <Link
                  href="/feedback"
                  className="flex flex-row hover:text-[#e63946] hover:scale-110 duration-300"
                >
                  <MessageCircleMore className="mr-2" />
                  Feedback
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold pb-4 md:pb-8 text-center md:text-left">
              Follow us on
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="https://www.instagram.com/"
                  className="flex flex-row hover:text-[#e63946] hover:scale-110 duration-300"
                >
                  <Instagram className="mr-2" />
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.facebook.com/"
                  className="flex flex-row hover:text-[#e63946] hover:scale-110 duration-300"
                >
                  <Facebook className="mr-2" />
                  Facebook
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.youtube.com/"
                  className="flex flex-row hover:text-[#e63946] hover:scale-110 duration-300"
                >
                  <Youtube className="mr-2" />
                  Youtube
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
