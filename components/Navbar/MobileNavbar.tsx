"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import Logo from "../Logo";
import { NavbarItems } from "@/lib/constants";
import NavbarItem from "./NavbarItem";
import ThemeSwitcherButton from "./ThemeSwitcherButton";
import { UserButton } from "@clerk/nextjs";

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]" side="left">
            <SheetHeader>
              <SheetTitle />
              <SheetDescription />
            </SheetHeader>

            <Logo />

            <div className="flex flex-col gap-1 pt-4">
              {NavbarItems.map((item) => (
                <NavbarItem
                  key={item.label}
                  link={item.link}
                  label={item.label}
                  onClick={() => setIsOpen((prev) => !prev)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo isMobile={true} />
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcherButton />
          <UserButton />
        </div>
      </nav>
    </div>
  );
};

export default MobileNavbar;
