export type ChipId = "all" | "funny" | "kittens" | "orange" | "sleepy" | "birds";

export type SectionId = "home" | "shorts" | "subscriptions" | "watch-later" | "liked";

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
  },
];

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
