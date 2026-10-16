import { Suspense } from "react";
import { MeowHome } from "@/components/meow-home";

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#fcfaf5]" />}>
      <MeowHome />
    </Suspense>
  );
}
