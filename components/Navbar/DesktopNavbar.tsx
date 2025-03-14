import { NavbarItems } from "@/lib/constants";
import Logo from "../Logo";
import NavbarItem from "./NavbarItem";
import { UserButton } from "@clerk/nextjs";
import ThemeSwitcherButton from "./ThemeSwitcherButton";

const DesktopNavbar = () => {
  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <nav className="container flex items-center justify-between px-8">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo />

          <div className="flex h-full">
            {NavbarItems.map((item) => (
              <NavbarItem
                key={item.label}
                link={item.link}
                label={item.label}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeSwitcherButton />
          <UserButton />
        </div>
      </nav>
    </div>
  );
};

export default DesktopNavbar;
