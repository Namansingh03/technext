"use client";

import { authClient } from "@/src/configs/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/src/shared/ui/input";
import { BellIcon, User2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/shared/ui/dropdown-menu";
import { MemberRoles } from "@/prisma/generated/enums";
import { Button } from "../ui/button";

interface NavbarProps {
  image?: string | null;
  name: string;
  role: MemberRoles | null;
  companySlug: string | null;
}

const Navbar = ({ name, image, companySlug, role }: NavbarProps) => {
  const router = useRouter();

  return (
    <nav className="w-full sticky h-20 top-0 z-50 bg-white dark:bg-neutral-900 flex items-center justify-between shadow-md p-5">
      <div className="flex items-center gap-x-24">
        <h1 className="capitalize text-xl font-extrabold text-indigo-900 dark:text-indigo-400">
          TechNext
        </h1>
      </div>
      <div>
        <Input
          placeholder="search for jobs , applications ..."
          className="w-100 border-slate-200 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
        />
      </div>
      <div className="flex flex-row items-center justify-center gap-x-5">
        <BellIcon className="text-blue-800 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300" />
        <DropdownMenu>
          <DropdownMenuTrigger>
            {image ? (
              <Image
                src={image}
                alt="avatarImage"
                width={50}
                height={50}
                className="border-2 hover:border-3 border-blue-950 dark:border-2 dark:border-blue-400 rounded-full p-1"
              />
            ) : (
              <User2Icon className="dark:text-neutral-300" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="flex flex-col items-start justify-between gap-y-2">
              <h1 className="text-md dark:text-neutral-100">{name}</h1>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {role ? (
                <Button
                  className="p-0"
                  variant={"ghost"}
                  onClick={() => router.push(`/${role.toLowerCase()}/username`)}
                >
                  {companySlug}
                </Button>
              ) : (
                <Button
                  className="p-0"
                  variant={"ghost"}
                  onClick={() => router.push("/company/create")}
                >
                  create company
                </Button>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 dark:text-red-400"
              onClick={() => {
                authClient.signOut();
                router.replace("signin");
              }}
            >
              logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
