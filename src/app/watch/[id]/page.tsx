import { Suspense } from "react";
import type { Metadata } from "next";
import { WatchView } from "@/components/watch-view";
import { findVideo, videos } from "@/lib/catalog";

export function generateStaticParams() {
  return videos.map((video) => ({ id: video.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const video = findVideo(id);
  return {
    title: video ? `${video.title} · MeowTube` : "MeowTube",
    description: video?.description ?? "Your daily dose of cat.",
  };
}

async function WatchContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <WatchView id={id} />;
}

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#fcfaf5]" />}>
      <WatchContent params={params} />
    </Suspense>
  );
}
