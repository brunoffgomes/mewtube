"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { Bell, Clock, House, Menu, MoreVertical, Search, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  chips,
  sectionCopy,
  videos,
  type ChipId,
  type SectionId,
  type Video,
} from "@/lib/catalog";
import { cn } from "@/lib/utils";

const narrowQuery = "(max-width: 1023px)";

export function MeowHome() {
  const [section, setSection] = useState<SectionId>("home");
  const [chip, setChip] = useState<ChipId>("all");
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const searchId = useId();

  const trimmed = query.trim().toLowerCase();
  const visible = videos.filter((video) => {
    const matchesChip = chip === "all" || video.tags.includes(chip);
    const matchesQuery =
      trimmed.length === 0 ||
      video.title.toLowerCase().includes(trimmed) ||
      video.channel.toLowerCase().includes(trimmed);
    return matchesChip && matchesQuery;
  });

  function openMenu() {
    if (window.matchMedia(narrowQuery).matches) {
      setDrawerOpen(true);
      return;
    }
    setSidebarOpen((open) => !open);
  }

  function selectSection(next: SectionId) {
    setSection(next);
    setDrawerOpen(false);
  }

  return (
    <div className="flex h-dvh flex-col bg-[#fcfaf5] text-[#1c1b22]">
      <p className="sr-only" aria-live="polite">
        {notice}
      </p>
      <header className="relative shrink-0">
        <div className="flex items-center gap-2 px-3 py-3 sm:h-20 sm:px-4 sm:py-0 lg:px-5">
          <div className="flex min-w-0 items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-10 shrink-0 rounded-full text-[#2a2a2e] hover:bg-[#f4efe8]"
              aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              aria-expanded={sidebarOpen || drawerOpen}
              onClick={openMenu}
            >
              <Menu className="size-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-11 gap-2 rounded-xl px-1.5 text-[#1c1b22] hover:bg-[#f4efe8]"
              onClick={() => selectSection("home")}
            >
              <LogoMark />
              <span className="text-[1.35rem] font-bold tracking-[-0.03em]">MeowTube</span>
            </Button>
          </div>
          <div className="ml-auto flex items-center gap-1.5 sm:hidden">
            <HeaderActions onNotice={setNotice} />
          </div>
          <div className="ml-auto hidden items-center gap-2 sm:flex">
            <HeaderActions onNotice={setNotice} />
          </div>
        </div>
        <div className="px-3 pb-3 sm:absolute sm:top-1/2 sm:left-1/2 sm:w-[min(820px,calc(100%-22rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:px-0 sm:pb-0">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-[#9a9692]"
              aria-hidden
            />
            <Input
              id={searchId}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search cat videos"
              aria-label="Search cat videos"
              autoComplete="off"
              className="h-[52px] rounded-full border-transparent bg-[#f3f1ef] pr-4 pl-11 text-[15px] shadow-none placeholder:text-[#9a9692] hover:bg-[#eeebe8] focus-visible:border-[#e36c28]/40 focus-visible:bg-white focus-visible:ring-[#e36c28]/30"
            />
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {sidebarOpen ? (
          <aside className="hidden h-full w-[248px] shrink-0 lg:block">
            <SidebarBody section={section} onSelect={selectSection} />
          </aside>
        ) : null}

        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent
            side="left"
            className="w-[min(100%,280px)] gap-0 bg-[#fcfaf5] p-0 sm:max-w-[280px]"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Browse MeowTube sections.</SheetDescription>
            </SheetHeader>
            <SidebarBody section={section} onSelect={selectSection} />
          </SheetContent>
        </Sheet>

        <main className="min-w-0 flex-1 overflow-y-auto px-4 pt-4 pb-12 sm:px-6 sm:pt-6 lg:px-7 lg:pt-8">
          {section === "home" ? (
            <HomeFeed
              chip={chip}
              onChip={setChip}
              videos={visible}
              query={query}
              onClear={() => {
                setQuery("");
                setChip("all");
              }}
              onNotice={setNotice}
            />
          ) : (
            <SectionEmpty section={section} onHome={() => selectSection("home")} />
          )}
        </main>
      </div>
    </div>
  );
}

function HomeFeed({
  chip,
  onChip,
  videos: list,
  query,
  onClear,
  onNotice,
}: {
  chip: ChipId;
  onChip: (chip: ChipId) => void;
  videos: Video[];
  query: string;
  onClear: () => void;
  onNotice: (message: string) => void;
}) {
  return (
    <div>
      <h1 className="text-[2rem] leading-[1.15] font-bold tracking-[-0.03em] text-[#1c1b22] sm:text-[2.15rem]">
        Your daily dose of cat.
      </h1>
      <p className="mt-1 text-[15px] text-[#6f6d75]">Good videos. Great whiskers.</p>

      <div
        role="toolbar"
        aria-label="Filter videos"
        className="mt-5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {chips.map((item) => {
          const active = chip === item.id;
          return (
            <Button
              key={item.id}
              type="button"
              variant={active ? "default" : "secondary"}
              aria-pressed={active}
              onClick={() => onChip(item.id)}
              className={cn(
                "h-10 shrink-0 rounded-full px-4 text-sm font-medium",
                active
                  ? "bg-[#e36c28] text-white hover:bg-[#cf5f1e]"
                  : "bg-[#f7f0e8] text-[#3f3c43] hover:bg-[#f0e4d6]",
              )}
            >
              {item.label}
            </Button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <div className="flex min-h-[320px] max-w-lg flex-col items-start justify-center py-16">
          <h2 className="text-2xl font-bold tracking-tight">No videos in this sunny spot.</h2>
          <p className="mt-2 text-[15px] leading-6 text-[#6f6d75]">
            {query.trim()
              ? `Nothing matches “${query.trim()}”. Try another title, channel, or chip.`
              : "Nothing matches that chip. Try another mood, or come back to every cat."}
          </p>
          <Button
            type="button"
            className="mt-5 h-10 rounded-full bg-[#e36c28] px-4 text-white hover:bg-[#cf5f1e]"
            onClick={onClear}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <ul className="mt-5 grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {list.map((video, index) => (
            <li key={video.id}>
              <VideoCard video={video} priority={index < 3} onNotice={onNotice} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function VideoCard({
  video,
  priority,
  onNotice,
}: {
  video: Video;
  priority: boolean;
  onNotice: (message: string) => void;
}) {
  return (
    <article className="group">
      <button
        type="button"
        className="block w-full rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-[#e36c28] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fcfaf5]"
        onClick={() => onNotice(`Queued ${video.title}`)}
      >
        <div className="relative aspect-video overflow-hidden rounded-xl bg-[#efeae4]">
          <Image
            src={video.thumbnail}
            alt={video.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition duration-200 group-hover:scale-[1.03] group-focus-within:scale-[1.03]"
          />
          <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10 group-focus-within:bg-black/10" />
          <span className="absolute right-2 bottom-2 rounded-md bg-black/80 px-1.5 py-1 text-[12px] leading-none font-semibold text-white">
            {video.duration}
          </span>
        </div>
      </button>
      <div className="mt-3 flex items-start gap-3">
        <Image
          src={video.avatar}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-full object-cover"
        />
        <button
          type="button"
          className="min-w-0 flex-1 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-[#e36c28]"
          onClick={() => onNotice(`Queued ${video.title}`)}
        >
          <h2 className="line-clamp-2 text-[15px] leading-5 font-semibold text-[#1a1a1f] group-hover:text-[#c65a1c]">
            {video.title}
          </h2>
          <p className="mt-1 text-[13px] leading-4 text-[#5c5856]">{video.channel}</p>
          <p className="mt-0.5 text-[13px] leading-4 text-[#8a8682]">
            {video.views} • {video.when}
          </p>
        </button>
        <VideoMenu title={video.title} onNotice={onNotice} />
      </div>
    </article>
  );
}

function VideoMenu({
  title,
  onNotice,
}: {
  title: string;
  onNotice: (message: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative shrink-0" ref={ref}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 rounded-full text-[#5c5856] hover:bg-[#f4efe8]"
        aria-label={`More actions for ${title}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <MoreVertical className="size-4" />
      </Button>
      {open ? (
        <div
          role="menu"
          aria-label={`Actions for ${title}`}
          className="absolute top-9 right-0 z-20 w-48 rounded-xl border border-[#efeae3] bg-white p-1 shadow-[0_8px_24px_rgba(60,40,20,0.12)]"
        >
          {[
            ["Save to Watch later", `Saved “${title}” for later`],
            ["Not for my whiskers", `Hid “${title}” from this shelf`],
          ].map(([label, message]) => (
            <button
              key={label}
              type="button"
              role="menuitem"
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#2a2a2e] hover:bg-[#f7f0e8] focus-visible:bg-[#f7f0e8] focus-visible:outline-none"
              onClick={() => {
                onNotice(message);
                setOpen(false);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SectionEmpty({
  section,
  onHome,
}: {
  section: Exclude<SectionId, "home">;
  onHome: () => void;
}) {
  const copy = sectionCopy[section];
  return (
    <div className="flex min-h-[360px] max-w-lg flex-col items-start justify-center py-10">
      <h1 className="text-[2rem] font-bold tracking-[-0.03em]">{copy.title}</h1>
      <p className="mt-2 text-[15px] leading-6 text-[#6f6d75]">{copy.body}</p>
      <Button
        type="button"
        className="mt-5 h-10 rounded-full bg-[#e36c28] px-4 text-white hover:bg-[#cf5f1e]"
        onClick={onHome}
      >
        Back to Home
      </Button>
    </div>
  );
}

function SidebarBody({
  section,
  onSelect,
}: {
  section: SectionId;
  onSelect: (section: SectionId) => void;
}) {
  const primary: { id: SectionId; label: string; icon: "home" | "shorts" | "subscriptions" }[] = [
    { id: "home", label: "Home", icon: "home" },
    { id: "shorts", label: "Shorts", icon: "shorts" },
    { id: "subscriptions", label: "Subscriptions", icon: "subscriptions" },
  ];
  const secondary: { id: SectionId; label: string; icon: "later" | "liked" }[] = [
    { id: "watch-later", label: "Watch later", icon: "later" },
    { id: "liked", label: "Liked videos", icon: "liked" },
  ];

  return (
    <div className="flex h-full flex-col pt-3">
      <nav className="flex flex-col gap-1 px-3" aria-label="Library">
        {primary.map((item) => (
          <NavButton
            key={item.id}
            label={item.label}
            active={section === item.id}
            onClick={() => onSelect(item.id)}
          >
            <NavIcon name={item.icon} active={section === item.id} />
          </NavButton>
        ))}
        <div className="mx-2 my-2 h-px bg-[#e7e1d8]" />
        {secondary.map((item) => (
          <NavButton
            key={item.id}
            label={item.label}
            active={section === item.id}
            onClick={() => onSelect(item.id)}
          >
            <NavIcon name={item.icon} active={section === item.id} />
          </NavButton>
        ))}
      </nav>
      <div className="mt-auto flex items-center gap-3 px-5 pt-6 pb-6">
        <PawMark />
        <p className="text-[13px] leading-[1.25] text-[#8a8680]">
          Good cats
          <br />
          brighter days.
        </p>
      </div>
    </div>
  );
}

function NavButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "h-12 w-full justify-start gap-4 rounded-2xl px-3 text-[15px] font-medium text-[#2c2a30] hover:bg-[#f6f1ea]",
        active && "bg-[#fbe6d6] text-[#e36c28] hover:bg-[#f8dcc8]",
      )}
    >
      {children}
      {label}
    </Button>
  );
}

function NavIcon({
  name,
  active,
}: {
  name: "home" | "shorts" | "subscriptions" | "later" | "liked";
  active: boolean;
}) {
  const className = cn("size-[22px]", active ? "text-[#e36c28]" : "text-[#2a2a2e]");
  if (name === "home") {
    return active ? (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path
          fill="currentColor"
          d="M3.8 11.2 12 4.2l8.2 7v8.2a1.2 1.2 0 0 1-1.2 1.2h-4.6v-5.6H9.6V20.6H5a1.2 1.2 0 0 1-1.2-1.2v-8.2Z"
        />
      </svg>
    ) : (
      <House className={className} strokeWidth={1.75} />
    );
  }
  if (name === "shorts") return <ShortsIcon className={className} />;
  if (name === "subscriptions") return <SubscriptionsIcon className={className} />;
  if (name === "later") return <Clock className={className} strokeWidth={1.75} />;
  return <ThumbsUp className={className} strokeWidth={1.75} />;
}

function HeaderActions({ onNotice }: { onNotice: (message: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className="relative" ref={ref}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 rounded-full text-[#2a2a2e] hover:bg-[#f4efe8]"
          aria-label="Notifications"
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={() => setOpen((value) => !value)}
        >
          <Bell className="size-5" />
        </Button>
        {open ? (
          <div
            role="dialog"
            aria-label="Notifications"
            className="absolute top-12 right-0 z-30 w-64 rounded-2xl border border-[#efeae3] bg-white p-4 text-left shadow-[0_8px_24px_rgba(60,40,20,0.12)]"
          >
            <p className="text-sm font-semibold">No new meows</p>
            <p className="mt-1 text-[13px] leading-5 text-[#6f6d75]">
              The bell is quiet. Fresh cat videos will land here.
            </p>
            <Button
              type="button"
              variant="secondary"
              className="mt-3 h-8 rounded-full bg-[#f7f0e8] px-3 text-[#3f3c43] hover:bg-[#f0e4d6]"
              onClick={() => {
                onNotice("Notifications cleared");
                setOpen(false);
              }}
            >
              Got it
            </Button>
          </div>
        ) : null}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-10 overflow-hidden rounded-full p-0 hover:ring-2 hover:ring-[#e36c28]/50"
        aria-label="Your channel"
        onClick={() => onNotice("This is your MeowTube channel")}
      >
        <Image
          src="/avatars/user.jpg"
          alt=""
          width={40}
          height={40}
          className="size-10 object-cover"
        />
      </Button>
    </>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 40 40" className="size-9 shrink-0" aria-hidden>
      <path fill="#e36c28" d="M8.5 15.5 12.6 6.4c.45-1 1.9-1 2.35 0L17.2 12" />
      <path fill="#e36c28" d="M22.6 12.2 25 6.4c.45-1 1.9-1 2.35 0l4.15 9.2" />
      <rect x="5" y="12.5" width="30" height="23" rx="7.5" fill="#e36c28" />
      <path fill="#fff" d="M16.6 18.2v11.2l9.6-5.6z" />
    </svg>
  );
}

function ShortsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <path
        d="M8.2 3.8c-2.7 1.3-4.4 3.7-4.4 6.5 0 2.2 1.15 4 2.9 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15.8 20.2c2.7-1.3 4.4-3.7 4.4-6.5 0-2.2-1.15-4-2.9-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8.6 8.1c1.9.55 3.15 2.05 3.4 3.85.25 1.85-.7 3.45-2.5 4.15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15.4 15.9c-1.9-.55-3.15-2.05-3.4-3.85-.25-1.85.7-3.45 2.5-4.15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path fill="currentColor" d="m10.7 10.15 2.55 1.85-2.55 1.85z" />
    </svg>
  );
}

function SubscriptionsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <path d="M7.5 6.2h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect
        x="4.2"
        y="8.4"
        width="15.6"
        height="11"
        rx="2.4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path fill="currentColor" d="M10.4 11.8v4.3l3.7-2.15z" />
    </svg>
  );
}

function PawMark() {
  return (
    <svg viewBox="0 0 64 64" className="size-8 shrink-0" aria-hidden>
      <g fill="#f0a56c">
        <ellipse cx="14" cy="18" rx="6" ry="8" transform="rotate(-18 14 18)" />
        <ellipse cx="27" cy="11" rx="6" ry="8" transform="rotate(-6 27 11)" />
        <ellipse cx="40" cy="11" rx="6" ry="8" transform="rotate(6 40 11)" />
        <ellipse cx="53" cy="18" rx="6" ry="8" transform="rotate(18 53 18)" />
        <path d="M18 34c1.2 2 4 12 14 12s12.8-10 14-12c1.4 3.2 1.2 8.4-1.6 12.2C41.2 51.2 36.8 54 32 54s-9.2-2.8-12.4-7.8C16.8 42.4 16.6 37.2 18 34z" />
      </g>
    </svg>
  );
}
