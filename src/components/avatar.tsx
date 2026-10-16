import Image from "next/image";
import { cn } from "@/lib/utils";

export function Avatar({ src, className }: { src: string; className?: string }) {
  return (
    <span className={cn("relative block size-10 shrink-0 overflow-hidden rounded-full", className)}>
      <Image src={src} alt="" fill sizes="44px" className="object-cover" />
    </span>
  );
}
