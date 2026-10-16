export type ChipId = "all" | "funny" | "kittens" | "orange" | "sleepy" | "birds";

export type SectionId = "home" | "shorts" | "subscriptions" | "watch-later" | "liked";

export type Comment = {
  id: string;
  handle: string;
  avatar: string;
  when: string;
  text: string;
  likes: number;
};

export type Video = {
  id: string;
  title: string;
  channel: string;
  views: string;
  when: string;
  duration: string;
  thumbnail: string;
  avatar: string;
  alt: string;
  tags: Exclude<ChipId, "all">[];
  subscribers: string;
  likes: number;
  description: string;
  commentCount: number;
  comments: Comment[];
};

export const chips: { id: ChipId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "funny", label: "Funny cats" },
  { id: "kittens", label: "Kittens" },
  { id: "orange", label: "Orange cat energy" },
  { id: "sleepy", label: "Sleepy cats" },
  { id: "birds", label: "Bird watching" },
];

export const videos: Video[] = [
  {
    id: "box",
    title: "If I fits, I sits",
    channel: "BoxedWhiskers",
    views: "2.4M views",
    when: "2 weeks ago",
    duration: "3:24",
    thumbnail: "/thumbs/box-cat.jpg",
    avatar: "/avatars/boxed.jpg",
    alt: "Orange tabby in a cardboard box reaching a paw toward the camera",
    tags: ["funny", "orange"],
    subscribers: "128K subscribers",
    likes: 42000,
    description: "One box. One cat. Absolutely no plans to leave.",
    commentCount: 1284,
    comments: [
      {
        id: "box-nap",
        handle: "@napclub",
        avatar: "/avatars/nap.jpg",
        when: "2 weeks ago",
        text: "The box was clearly made for him.",
        likes: 3100,
      },
    ],
  },
  {
    id: "kittens",
    title: "Tiny kittens, big dreams",
    channel: "LittlePawPrints",
    views: "1.8M views",
    when: "3 weeks ago",
    duration: "4:17",
    thumbnail: "/thumbs/kittens.jpg",
    avatar: "/avatars/prints.jpg",
    alt: "Three tiny kittens asleep under a cream knit blanket",
    tags: ["kittens", "sleepy"],
    subscribers: "86K subscribers",
    likes: 18600,
    description: "Three kittens. One blanket. Zero interest in being awake.",
    commentCount: 642,
    comments: [
      {
        id: "kittens-box",
        handle: "@boxedwhiskers",
        avatar: "/avatars/boxed.jpg",
        when: "3 weeks ago",
        text: "They dreamed through the entire blanket.",
        likes: 890,
      },
    ],
  },
  {
    id: "piano",
    title: "The next great paw-nist",
    channel: "MozartWhiskers",
    views: "1.1M views",
    when: "10 days ago",
    duration: "2:58",
    thumbnail: "/thumbs/piano.jpg",
    avatar: "/avatars/mozart.jpg",
    alt: "Black-and-white cat resting a paw on piano keys",
    tags: ["funny"],
    subscribers: "54K subscribers",
    likes: 9700,
    description: "A tuxedo cat, one white paw, and a room that did not ask for a concert.",
    commentCount: 418,
    comments: [
      {
        id: "piano-nap",
        handle: "@napclub",
        avatar: "/avatars/nap.jpg",
        when: "10 days ago",
        text: "Encore. Then a nap.",
        likes: 1200,
      },
    ],
  },
  {
    id: "nap",
    title: "Professional nap enthusiast",
    channel: "NapClub",
    views: "3.2M views",
    when: "1 month ago",
    duration: "3:36",
    thumbnail: "/thumbs/nap.jpg",
    avatar: "/avatars/nap.jpg",
    alt: "Fluffy long-haired cat asleep on a sunlit rug",
    tags: ["sleepy", "funny"],
    subscribers: "210K subscribers",
    likes: 51000,
    description: "Sunlight, a rug, and a cat who treats sleep like a full-time job.",
    commentCount: 2304,
    comments: [
      {
        id: "nap-prints",
        handle: "@littlepawprints",
        avatar: "/avatars/prints.jpg",
        when: "1 month ago",
        text: "This is the career path.",
        likes: 2400,
      },
    ],
  },
  {
    id: "window",
    title: "Bird TV is getting intense",
    channel: "WindowWhiskers",
    views: "2.7M views",
    when: "2 weeks ago",
    duration: "5:21",
    thumbnail: "/thumbs/window.jpg",
    avatar: "/avatars/window.jpg",
    alt: "Tabby cat on a windowsill staring at a small bird",
    tags: ["birds", "funny"],
    subscribers: "97K subscribers",
    likes: 27300,
    description: "One bird. One windowsill. The plot thickens every time it hops.",
    commentCount: 980,
    comments: [
      {
        id: "window-leap",
        handle: "@adventurewhiskers",
        avatar: "/avatars/adventure.jpg",
        when: "2 weeks ago",
        text: "The bird knows it is a show.",
        likes: 760,
      },
    ],
  },
  {
    id: "leap",
    title: "The floor is officially lava",
    channel: "AdventureWhiskers",
    views: "1.9M views",
    when: "3 weeks ago",
    duration: "4:03",
    thumbnail: "/thumbs/leap.jpg",
    avatar: "/avatars/adventure.jpg",
    alt: "Cat mid-leap toward an orange feather toy",
    tags: ["funny"],
    subscribers: "73K subscribers",
    likes: 15400,
    description: "The feather toy moved. The floor did not stand a chance.",
    commentCount: 705,
    comments: [
      {
        id: "leap-window",
        handle: "@windowwhiskers",
        avatar: "/avatars/window.jpg",
        when: "3 weeks ago",
        text: "Gravity filed a complaint.",
        likes: 640,
      },
    ],
  },
];

export function findVideo(id: string) {
  return videos.find((video) => video.id === id);
}

export function isSectionId(value: string | null): value is SectionId {
  return (
    value === "home" ||
    value === "shorts" ||
    value === "subscriptions" ||
    value === "watch-later" ||
    value === "liked"
  );
}

export const sectionCopy: Record<Exclude<SectionId, "home">, { title: string; body: string }> = {
  shorts: {
    title: "Shorts",
    body: "No Shorts yet. The cats are still stretching between takes.",
  },
  subscriptions: {
    title: "Subscriptions",
    body: "You're not following any channels yet. Home is already full of whiskers.",
  },
  "watch-later": {
    title: "Watch later",
    body: "Nothing saved for later. Your queue is a warm, empty windowsill.",
  },
  liked: {
    title: "Liked videos",
    body: "No liked videos yet. Give a paw when a cat earns it.",
  },
};
