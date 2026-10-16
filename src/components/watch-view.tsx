"use client";

import { useEffect, useId, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode, type RefObject } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Bookmark,
  Menu,
  MoreVertical,
  Pause,
  Play,
  Search,
  Settings,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar } from "@/components/avatar";
import { LogoMark } from "@/components/logo-mark";
import { findVideo, videos, type Comment, type Video } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const speeds = [0.5, 1, 1.5, 2];

export function WatchView({ id }: { id: string }) {
  const video = findVideo(id);
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const router = useRouter();
  const searchId = useId();

  return (
    <div className="min-h-dvh bg-[#fcfaf5] text-[#1c1b22]">
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
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <Link
              href="/"
              className="inline-flex h-12 items-center gap-2.5 rounded-xl px-1.5 hover:bg-[#f4efe8] focus-visible:ring-2 focus-visible:ring-[#e36c28] focus-visible:outline-none"
            >
              <LogoMark />
              <span className="text-[1.65rem] leading-none font-extrabold tracking-[-0.04em]">
                MeowTube
              </span>
            </Link>
          </div>
          <div className="ml-auto flex items-center gap-1.5 sm:hidden">
            <HeaderActions onNotice={setNotice} />
          </div>
          <div className="ml-auto hidden items-center gap-2 sm:flex">
            <HeaderActions onNotice={setNotice} />
          </div>
        </div>
        <form
          className="px-3 pb-3 sm:absolute sm:top-1/2 sm:left-1/2 sm:w-[min(920px,calc(100%-17rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:px-0 sm:pb-0"
          onSubmit={(event) => {
            event.preventDefault();
            const next = query.trim();
            router.push(next ? `/?q=${encodeURIComponent(next)}` : "/");
          }}
        >
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
              className="h-[52px] rounded-full border-transparent bg-[#f3f1ef] pr-5 pl-12 text-base shadow-none placeholder:text-[#9a9692] hover:bg-[#eeebe8] focus-visible:border-[#e36c28]/40 focus-visible:bg-white focus-visible:ring-[#e36c28]/30"
            />
          </div>
        </form>
      </header>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="left"
          className="w-[min(100%,280px)] gap-0 bg-[#fcfaf5] p-0 sm:max-w-[280px]"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Browse MeowTube sections.</SheetDescription>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-3 pt-8" aria-label="Library">
            {[
              ["/", "Home"],
              ["/?section=shorts", "Shorts"],
              ["/?section=subscriptions", "Subscriptions"],
              ["/?section=watch-later", "Watch later"],
              ["/?section=liked", "Liked videos"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="flex h-12 items-center rounded-2xl px-3 text-[15px] font-medium text-[#2c2a30] hover:bg-[#f6f1ea] focus-visible:ring-2 focus-visible:ring-[#e36c28] focus-visible:outline-none"
                onClick={() => setDrawerOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {video ? (
        <WatchBody key={video.id} video={video} onNotice={setNotice} />
      ) : (
        <main className="mx-auto flex min-h-[420px] max-w-lg flex-col justify-center px-6">
          <h1 className="text-[2rem] font-bold tracking-[-0.03em]">That video wandered off.</h1>
          <p className="mt-2 text-[15px] leading-6 text-[#6f6d75]">
            No cat by that name. The home shelf is still full of whiskers.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex h-10 w-fit items-center rounded-full bg-[#e36c28] px-4 text-sm font-medium text-white hover:bg-[#cf5f1e] focus-visible:ring-2 focus-visible:ring-[#e36c28] focus-visible:outline-none"
          >
            Back to Home
          </Link>
        </main>
      )}
    </div>
  );
}

function WatchBody({ video, onNotice }: { video: Video; onNotice: (message: string) => void }) {
  const router = useRouter();
  const duration = parseDuration(video.duration);
  const queue = videos.filter((item) => item.id !== video.id);
  const nextId = queue[0]?.id;
  const [time, setTime] = useState(video.id === "box" ? 68 : 0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [theater, setTheater] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(video.likes);
  const [comments, setComments] = useState<Comment[]>(video.comments);
  const [hiddenComments, setHiddenComments] = useState<string[]>([]);
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>(() =>
    Object.fromEntries(video.comments.map((comment) => [comment.id, comment.likes])),
  );
  const [likedComments, setLikedComments] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [sort, setSort] = useState<"top" | "newest">("top");
  const [sortOpen, setSortOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const advanced = useRef(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setTime((current) => {
        const next = Math.min(duration, current + 0.25 * speed);
        if (next >= duration && !advanced.current) {
          advanced.current = true;
          window.setTimeout(() => {
            setPlaying(false);
            if (autoplay && nextId) router.push(`/watch/${nextId}`);
          }, 0);
        }
        return next;
      });
    }, 250);
    return () => window.clearInterval(timer);
  }, [playing, speed, duration, autoplay, nextId, router]);

  const visibleComments = comments
    .filter((comment) => !hiddenComments.includes(comment.id))
    .slice()
        .sort((a, b) =>
          sort === "top"
            ? (commentLikes[b.id] ?? 0) - (commentLikes[a.id] ?? 0)
            : comments.indexOf(a) - comments.indexOf(b),
        );
  const commentTotal = video.commentCount + Math.max(0, comments.length - video.comments.length);

  function postComment() {
    const text = draft.trim();
    if (!text) return;
    setComments((current) => [
      {
        id: `you-${Date.now()}`,
        handle: "@you",
        avatar: "/avatars/user.jpg",
        when: "Just now",
        text,
        likes: 0,
      },
      ...current,
    ]);
    setDraft("");
    setSort("newest");
    onNotice("Comment posted");
  }

  function postReply(parent: Comment) {
    const text = replyDraft.trim();
    if (!text) return;
    setComments((current) => [
      {
        id: `reply-${Date.now()}`,
        handle: "@you",
        avatar: "/avatars/user.jpg",
        when: "Just now",
        text: `Replying to ${parent.handle}: ${text}`,
        likes: 0,
      },
      ...current,
    ]);
    setReplyDraft("");
    setReplyTo(null);
    setSort("newest");
    onNotice(`Replied to ${parent.handle}`);
  }

  return (
    <main
      className={cn(
        "mx-auto grid max-w-[1680px] gap-6 px-3 py-3 sm:px-5 sm:py-4",
        theater ? "lg:grid-cols-1" : "lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_402px] xl:gap-8",
      )}
    >
      <section className="min-w-0">
        <Player
          video={video}
          playerRef={playerRef}
          time={time}
          duration={duration}
          playing={playing}
          muted={muted}
          theater={theater}
          settingsOpen={settingsOpen}
          speed={speed}
          onTogglePlay={() => {
            if (time >= duration) {
              advanced.current = false;
              setTime(0);
            }
            setPlaying((value) => !value);
          }}
          onToggleMute={() => setMuted((value) => !value)}
          onSeek={setTime}
          onToggleTheater={() => setTheater((value) => !value)}
          onToggleSettings={() => setSettingsOpen((value) => !value)}
          onSpeed={(next) => {
            setSpeed(next);
            setSettingsOpen(false);
            onNotice(`Playback speed ${next}×`);
          }}
          onFullscreen={() => {
            const node = playerRef.current;
            if (!node) return;
            if (document.fullscreenElement) {
              void document.exitFullscreen();
            } else {
              void node.requestFullscreen();
            }
          }}
        />

        <h1 className="mt-3 text-[1.25rem] leading-tight font-bold tracking-[-0.02em] sm:text-[1.45rem]">
          {video.title}
        </h1>

        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar src={video.avatar} className="size-11" />
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold">{video.channel}</p>
              <p className="text-[13px] text-[#6f6d75]">{video.subscribers}</p>
            </div>
            <Button
              type="button"
              aria-pressed={subscribed}
              onClick={() => {
                setSubscribed((value) => !value);
                onNotice(subscribed ? `Left ${video.channel}` : `Subscribed to ${video.channel}`);
              }}
              className={cn(
                "h-9 rounded-full px-4 text-sm font-semibold",
                subscribed
                  ? "bg-[#f4efe8] text-[#2c2a30] hover:bg-[#efe4d8]"
                  : "bg-[#e36c28] text-white hover:bg-[#cf5f1e]",
              )}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
            <div className="flex overflow-hidden rounded-full bg-[#f4efe8]">
              <Button
                type="button"
                variant="ghost"
                aria-pressed={liked}
                onClick={() => {
                  setLiked((value) => {
                    const next = !value;
                    setLikes((count) => count + (next ? 1 : -1));
                    if (next) setDisliked(false);
                    return next;
                  });
                }}
                className={cn(
                  "h-9 rounded-none px-3.5 text-sm font-medium hover:bg-[#efe4d8]",
                  liked && "text-[#e36c28]",
                )}
              >
                <ThumbsUp className={cn("size-4", liked && "fill-current")} />
                {formatCompact(likes)}
              </Button>
              <Button
                type="button"
                variant="ghost"
                aria-label="Dislike"
                aria-pressed={disliked}
                onClick={() => {
                  setDisliked((value) => !value);
                  if (!disliked && liked) {
                    setLiked(false);
                    setLikes((count) => count - 1);
                  }
                }}
                className={cn(
                  "h-9 rounded-none border-l border-[#e7e1d8] px-3 hover:bg-[#efe4d8]",
                  disliked && "text-[#e36c28]",
                )}
              >
                <ThumbsDown className={cn("size-4", disliked && "fill-current")} />
              </Button>
            </div>
            <Button
              type="button"
              variant="ghost"
              className="h-9 rounded-full bg-[#f4efe8] px-3.5 text-sm font-medium hover:bg-[#efe4d8]"
              onClick={() => {
                const url = window.location.href;
                void navigator.clipboard?.writeText(url);
                onNotice("Link copied");
              }}
            >
              <Share2 className="size-4" />
              Share
            </Button>
            <Button
              type="button"
              variant="ghost"
              aria-pressed={saved}
              className={cn(
                "h-9 rounded-full bg-[#f4efe8] px-3.5 text-sm font-medium hover:bg-[#efe4d8]",
                saved && "text-[#e36c28]",
              )}
              onClick={() => {
                setSaved((value) => !value);
                onNotice(saved ? `Removed “${video.title}” from Watch later` : `Saved “${video.title}”`);
              }}
            >
              <Bookmark className={cn("size-4", saved && "fill-current")} />
              {saved ? "Saved" : "Save"}
            </Button>
            <MenuButton
              open={moreOpen}
              onToggle={() => setMoreOpen((value) => !value)}
              label="More actions"
              items={[
                ["Not for my whiskers", `Hid “${video.title}” from recommendations`],
                ["Copy title", `Copied “${video.title}”`],
              ]}
              onPick={(message) => {
                onNotice(message);
                setMoreOpen(false);
              }}
            />
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-[#f8efe6] px-4 py-3">
          <p className="text-sm font-semibold">
            {video.views} • {video.when}
          </p>
          <p className="mt-1 text-sm leading-6 text-[#2c2a30]">{video.description}</p>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold">{formatComments(commentTotal)}</h2>
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                aria-expanded={sortOpen}
                aria-haspopup="menu"
                className="h-9 rounded-full px-2 text-sm font-medium text-[#2c2a30] hover:bg-[#f4efe8]"
                onClick={() => setSortOpen((value) => !value)}
              >
                <SortIcon />
                Sort by
              </Button>
              {sortOpen ? (
                <div
                  role="menu"
                  className="absolute top-10 left-0 z-20 w-44 rounded-xl border border-[#efeae3] bg-white p-1 shadow-[0_8px_24px_rgba(60,40,20,0.12)]"
                >
                  {(
                    [
                      ["top", "Top comments"],
                      ["newest", "Newest"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      role="menuitemradio"
                      aria-checked={sort === value}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#f7f0e8] focus-visible:bg-[#f7f0e8] focus-visible:outline-none"
                      onClick={() => {
                        setSort(value);
                        setSortOpen(false);
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <form
            className="mt-4 flex items-start gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              postComment();
            }}
          >
            <Avatar src="/avatars/user.jpg" className="mt-1 size-9" />
            <div className="min-w-0 flex-1">
              <Input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Add a comment..."
                aria-label="Add a comment"
                className="h-10 rounded-none border-0 border-b border-[#e4ddd4] bg-transparent px-0 shadow-none focus-visible:border-[#e36c28] focus-visible:ring-0"
              />
              {draft.trim() ? (
                <div className="mt-2 flex justify-end">
                  <Button
                    type="submit"
                    className="h-8 rounded-full bg-[#e36c28] px-3 text-white hover:bg-[#cf5f1e]"
                  >
                    Comment
                  </Button>
                </div>
              ) : null}
            </div>
          </form>

          <ul className="mt-5 space-y-5">
            {visibleComments.map((comment) => (
              <li key={comment.id} className="flex gap-3">
                <Avatar src={comment.avatar} className="size-9" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{comment.handle}</span>{" "}
                    <span className="text-[#8a8682]">{comment.when}</span>
                  </p>
                  <p className="mt-1 text-sm leading-6">{comment.text}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-pressed={likedComments.includes(comment.id)}
                      className="h-8 rounded-full px-2 text-[#5c5856] hover:bg-[#f4efe8]"
                      onClick={() => {
                        const active = likedComments.includes(comment.id);
                        setLikedComments((current) =>
                          active ? current.filter((item) => item !== comment.id) : [...current, comment.id],
                        );
                        setCommentLikes((current) => ({
                          ...current,
                          [comment.id]: (current[comment.id] ?? 0) + (active ? -1 : 1),
                        }));
                      }}
                    >
                      <ThumbsUp className="size-4" />
                      {formatCompact(commentLikes[comment.id] ?? comment.likes)}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Dislike comment from ${comment.handle}`}
                      className="rounded-full text-[#5c5856] hover:bg-[#f4efe8]"
                      onClick={() => onNotice(`Noted. ${comment.handle} will hear about it never.`)}
                    >
                      <ThumbsDown className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-full px-2 text-sm font-medium hover:bg-[#f4efe8]"
                      onClick={() => {
                        setReplyTo(comment.id);
                        setReplyDraft("");
                      }}
                    >
                      Reply
                    </Button>
                  </div>
                  {replyTo === comment.id ? (
                    <form
                      className="mt-2 flex gap-2"
                      onSubmit={(event) => {
                        event.preventDefault();
                        postReply(comment);
                      }}
                    >
                      <Input
                        value={replyDraft}
                        onChange={(event) => setReplyDraft(event.target.value)}
                        placeholder={`Reply to ${comment.handle}`}
                        aria-label={`Reply to ${comment.handle}`}
                        className="h-9 rounded-full border-[#e6e0d8] bg-white"
                      />
                      <Button
                        type="submit"
                        className="h-9 rounded-full bg-[#e36c28] px-3 text-white hover:bg-[#cf5f1e]"
                      >
                        Reply
                      </Button>
                    </form>
                  ) : null}
                </div>
                <MenuButton
                  open={false}
                  label={`More actions for comment by ${comment.handle}`}
                  items={[["Hide comment", `Hid the comment from ${comment.handle}`]]}
                  onPick={() => {
                    setHiddenComments((current) => [...current, comment.id]);
                    onNotice(`Hid the comment from ${comment.handle}`);
                  }}
                />
              </li>
            ))}
          </ul>
          {visibleComments.length === 0 ? (
            <p className="mt-6 text-sm text-[#6f6d75]">
              The comment box is a warm empty windowsill. Be the first whisker.
            </p>
          ) : null}
        </div>
      </section>

      <aside className={cn("min-w-0", theater && "xl:max-w-3xl")}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Up next</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#6f6d75]">Autoplay</span>
            <button
              type="button"
              role="switch"
              aria-checked={autoplay}
              aria-label="Autoplay"
              onClick={() => setAutoplay((value) => !value)}
              className={cn(
                "relative h-6 w-11 rounded-full transition focus-visible:ring-2 focus-visible:ring-[#e36c28] focus-visible:outline-none",
                autoplay ? "bg-[#e36c28]" : "bg-[#ddd6ce]",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 size-5 rounded-full bg-white shadow transition",
                  autoplay ? "left-[22px]" : "left-0.5",
                )}
              />
            </button>
          </div>
        </div>
        <ul className="space-y-2">
          {queue.map((item) => (
            <li key={item.id}>
              <UpNextRow video={item} onNotice={onNotice} />
            </li>
          ))}
        </ul>
      </aside>
    </main>
  );
}

function Player({
  video,
  playerRef,
  time,
  duration,
  playing,
  muted,
  theater,
  settingsOpen,
  speed,
  onTogglePlay,
  onToggleMute,
  onSeek,
  onToggleTheater,
  onToggleSettings,
  onSpeed,
  onFullscreen,
}: {
  video: Video;
  playerRef: RefObject<HTMLDivElement | null>;
  time: number;
  duration: number;
  playing: boolean;
  muted: boolean;
  theater: boolean;
  settingsOpen: boolean;
  speed: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onSeek: (time: number) => void;
  onToggleTheater: () => void;
  onToggleSettings: () => void;
  onSpeed: (speed: number) => void;
  onFullscreen: () => void;
}) {
  const ratio = duration === 0 ? 0 : Math.min(1, time / duration);

  function seekFromPointer(event: ReactMouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const next = ((event.clientX - rect.left) / rect.width) * duration;
    onSeek(Math.min(duration, Math.max(0, next)));
  }

  return (
    <div
      ref={playerRef}
      className="relative aspect-video overflow-hidden rounded-2xl bg-black"
    >
      <Image src={video.thumbnail} alt={video.alt} fill priority className="object-cover" sizes="(max-width: 1280px) 100vw, 70vw" />
      <button
        type="button"
        className="absolute inset-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#e36c28] focus-visible:outline-none"
        aria-label={playing ? `Pause ${video.title}` : `Play ${video.title}`}
        onClick={onTogglePlay}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-3 pt-12 pb-2.5 sm:px-4">
        <div
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={Math.floor(time)}
          aria-valuetext={`${formatClock(time)} of ${formatClock(duration)}`}
          className="pointer-events-auto relative mb-2 h-4 cursor-pointer focus-visible:outline-none"
          onClick={seekFromPointer}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") onSeek(Math.min(duration, time + 5));
            if (event.key === "ArrowLeft") onSeek(Math.max(0, time - 5));
            if (event.key === "Home") onSeek(0);
            if (event.key === "End") onSeek(duration);
          }}
        >
          <span className="absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 rounded-full bg-white/45" />
          <span
            className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full bg-[#e36c28]"
            style={{ width: `${ratio * 100}%` }}
          />
          <span
            className="absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full bg-[#e36c28] shadow"
            style={{ left: `calc(${ratio * 100}% - 7px)` }}
          />
        </div>
        <div className="pointer-events-auto flex items-center gap-1 text-white sm:gap-2">
          <IconControl label={playing ? "Pause" : "Play"} onClick={onTogglePlay}>
            {playing ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}
          </IconControl>
          <IconControl label={muted ? "Unmute" : "Mute"} onClick={onToggleMute}>
            {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </IconControl>
          <span className="px-1 text-[13px] font-medium tabular-nums sm:text-sm">
            {formatClock(time)} / {formatClock(duration)}
          </span>
          <span className="flex-1" />
          <div className="relative">
            <IconControl label="Settings" pressed={settingsOpen} onClick={onToggleSettings}>
              <Settings className="size-[18px]" />
            </IconControl>
            {settingsOpen ? (
              <div
                role="menu"
                className="absolute right-0 bottom-10 z-20 w-36 rounded-xl bg-[#1c1b22] p-1 text-sm text-white shadow-lg"
              >
                {speeds.map((value) => (
                  <button
                    key={value}
                    type="button"
                    role="menuitemradio"
                    aria-checked={speed === value}
                    className={cn(
                      "w-full rounded-lg px-3 py-1.5 text-left hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none",
                      speed === value && "text-[#ffb07a]",
                    )}
                    onClick={() => onSpeed(value)}
                  >
                    {value}×
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <IconControl label={theater ? "Default view" : "Theater mode"} pressed={theater} onClick={onToggleTheater}>
            <TheaterIcon />
          </IconControl>
          <IconControl label="Full screen" onClick={onFullscreen}>
            <FullscreenIcon />
          </IconControl>
        </div>
      </div>
    </div>
  );
}

function UpNextRow({ video, onNotice }: { video: Video; onNotice: (message: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="group flex gap-2 rounded-xl p-1 hover:bg-[#f6f1ea]">
      <Link
        href={`/watch/${video.id}`}
        className="flex min-w-0 flex-1 gap-2 rounded-lg focus-visible:ring-2 focus-visible:ring-[#e36c28] focus-visible:outline-none"
      >
        <div className="relative aspect-video w-[168px] shrink-0 overflow-hidden rounded-lg bg-[#efeae4]">
          <Image src={video.thumbnail} alt="" fill sizes="168px" className="object-cover" />
          <span className="absolute right-1.5 bottom-1.5 rounded-md bg-black/80 px-1.5 py-0.5 text-[12px] leading-none font-semibold text-white">
            {video.duration}
          </span>
        </div>
        <span className="min-w-0 py-0.5">
          <span className="line-clamp-2 block text-sm leading-5 font-semibold group-hover:text-[#c65a1c]">
            {video.title}
          </span>
          <span className="mt-1 block text-[13px] text-[#5c5856]">{video.channel}</span>
          <span className="block text-[13px] text-[#8a8682]">
            {video.views} • {video.when}
          </span>
        </span>
      </Link>
      <MenuButton
        open={open}
        onToggle={() => setOpen((value) => !value)}
        label={`More actions for ${video.title}`}
        items={[
          ["Save to Watch later", `Saved “${video.title}” for later`],
          ["Not for my whiskers", `Hid “${video.title}” from Up next`],
        ]}
        onPick={(message) => {
          onNotice(message);
          setOpen(false);
        }}
      />
    </div>
  );
}

function MenuButton({
  open = false,
  onToggle,
  label,
  items,
  onPick,
}: {
  open?: boolean;
  onToggle?: () => void;
  label: string;
  items: [string, string][];
  onPick: (message: string) => void;
}) {
  const [localOpen, setLocalOpen] = useState(false);
  const shown = onToggle ? open : localOpen;
  const toggle = onToggle ?? (() => setLocalOpen((value) => !value));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shown) return;
    function onPointer(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        if (onToggle) onToggle();
        else setLocalOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (onToggle && open) onToggle();
        setLocalOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [shown, onToggle, open]);

  return (
    <div className="relative shrink-0" ref={ref}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={label}
        aria-expanded={shown}
        aria-haspopup="menu"
        className="size-8 rounded-full text-[#5c5856] hover:bg-[#f4efe8]"
        onClick={toggle}
      >
        <MoreVertical className="size-4" />
      </Button>
      {shown ? (
        <div
          role="menu"
          className="absolute top-9 right-0 z-20 w-52 rounded-xl border border-[#efeae3] bg-white p-1 shadow-[0_8px_24px_rgba(60,40,20,0.12)]"
        >
          {items.map(([itemLabel, message]) => (
            <button
              key={itemLabel}
              type="button"
              role="menuitem"
              className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#f7f0e8] focus-visible:bg-[#f7f0e8] focus-visible:outline-none"
              onClick={() => {
                onPick(message);
                if (!onToggle) setLocalOpen(false);
              }}
            >
              {itemLabel}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function HeaderActions({ onNotice }: { onNotice: (message: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="relative">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 rounded-full text-[#2a2a2e] hover:bg-[#f4efe8]"
          aria-label="Notifications"
          aria-expanded={open}
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
        <Avatar src="/avatars/user.jpg" className="size-10" />
      </Button>
    </>
  );
}

function IconControl({
  label,
  onClick,
  pressed,
  children,
}: {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className="inline-flex size-8 items-center justify-center rounded-full text-white hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
    >
      {children}
    </button>
  );
}

function TheaterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" aria-hidden>
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" aria-hidden>
      <path d="M8 4H4v4M16 4h4v4M4 16v4h4M20 16v4h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <path d="M4 7h16M7 12h10M10 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function parseDuration(value: string) {
  const [minutes, seconds] = value.split(":").map(Number);
  return minutes * 60 + seconds;
}

function formatClock(value: number) {
  const total = Math.max(0, Math.floor(value));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatCompact(value: number) {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `${millions >= 10 ? Math.round(millions) : trimNumber(millions)}M`;
  }
  if (value >= 1000) {
    const thousands = value / 1000;
    return `${thousands >= 10 ? Math.round(thousands) : trimNumber(thousands)}K`;
  }
  return value.toLocaleString("en-US");
}

function trimNumber(value: number) {
  const text = value.toFixed(1);
  return text.endsWith(".0") ? text.slice(0, -2) : text;
}

function formatComments(count: number) {
  return `${count.toLocaleString("en-US")} Comment${count === 1 ? "" : "s"}`;
}
