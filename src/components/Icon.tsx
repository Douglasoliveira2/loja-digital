const PATHS = {
  search: "M16 16l4.5 4.5M17.5 11a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z",
  cart: "M3 4h2.5l2 11h10l2-8H7M10.2 19.5a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0zM18.2 19.5a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z",
  menu: "M4 7h16M4 12h16M4 17h10",
  arrow: "M5 12h14M13 6l6 6-6 6",
  pencil: "M4 20l1-4L16 5a2 2 0 0 1 3 3L8 19zM14 7l3 3",
  cap: "M3 9l9-4 9 4-9 4zM7 11v4c0 1.5 10 1.5 10 0v-4",
  home: "M4 11l8-7 8 7M6 10v9h12v-9",
  fork: "M7 4v7M5 4v4a2 2 0 0 0 4 0V4M7 11v9M16 20V4c-2 1-3 4-3 7h3",
  coin: "M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0zM12 7v10M9.5 9.5c0-1 1-1.5 2.5-1.5s2.5.6 2.5 1.6-1 1.4-2.5 1.8-2.5.8-2.5 1.8 1 1.6 2.5 1.6 2.5-.5 2.5-1.5",
  heart: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
  bolt: "M13 3L5 14h6l-1 7 8-11h-6z",
  shield: "M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6zM9 12l2 2 4-4",
  down: "M12 4v11M7 11l5 5 5-5M5 20h14",
  chat: "M4 5h16v11H9l-5 4z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.700l1-1",
  share: "M12 15V4M8 8l4-4 4 4M5 13v6h14v-6",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg
      className="ic"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
