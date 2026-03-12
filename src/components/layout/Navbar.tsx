import { ThemeToggle } from "@/components/ThemeToggle";
import { ButtonLink } from "@/components/ui/button";

const navLinks = [
  { title: "Home", href: "/" },
  { title: "Demo", href: "/DemoPage" },
  { title: "About", href: "/about" },
];

const Navbar = () => {
  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <ButtonLink to="/" className="font-heading text-lg font-bold tracking-tight">
          Serena<span className="text-primary">.</span>
        </ButtonLink>

        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <ButtonLink key={link.title} to={link.href} size="sm">
              {link.title}
            </ButtonLink>
          ))}
          <div className="ml-2 border-l pl-2">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
