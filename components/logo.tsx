import { PiggyBank } from "lucide-react";
import Link from "next/link";

const Logo = ({ isMobile = false }: { isMobile?: boolean }) => {
  return (
    <Link href="/" className="flex items-center gap-2">
      {!isMobile && (
        <PiggyBank className="stroke h-11 w-11 stroke-amber-500 stroke-[1.5]" />
      )}
      {isMobile ? (
        <p className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-xl font-bold leading-tight tracking-tighter text-transparent">
          BudgetTracker
        </p>
      ) : (
        <p className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
          BudgetTracker
        </p>
      )}
    </Link>
  );
};

export default Logo;
