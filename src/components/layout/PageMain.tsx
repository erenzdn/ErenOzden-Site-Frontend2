"use client";

import { cn } from "@/lib/utils";
import VantaPageBackground from "@/components/ui/VantaPageBackground";

type PageMainProps = {
  children: React.ReactNode;
  className?: string;
};

export default function PageMain({ children, className }: PageMainProps) {
  return (
    <main
      className={cn(
        "relative pt-24 min-h-screen bg-black overflow-hidden",
        className,
      )}
    >
      <VantaPageBackground />
      <div className="relative z-10">{children}</div>
    </main>
  );
}
