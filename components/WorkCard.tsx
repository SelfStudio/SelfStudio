"use client";

import { Link } from "next-view-transitions";
import type { AppConfig } from "@/lib/config";

const platformOf = (app: AppConfig) =>
  app.download.googlePlay || app.download.apk ? "Android" : app.id === "menubro" ? "macOS" : "iPhone";

/**
 * WorkCard — a single app card on the home grid.
 * On click it tags its own icon with `view-transition-name: app-hero` so the
 * icon morphs into the detail page's hero icon during the route transition.
 */
export default function WorkCard({
  app,
  index,
  href,
  description,
}: {
  app: AppConfig;
  index: number;
  href: string;
  description: string;
}) {
  const tagIcon = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!("startViewTransition" in document)) return;
    const img = e.currentTarget.querySelector("img");
    if (img) {
      (img as HTMLImageElement).style.setProperty("view-transition-name", "app-hero");
    }
  };

  return (
    <Link
      href={href}
      onClick={tagIcon}
      className="group flex flex-col items-start gap-3.5 rounded-4 border border-hairline p-6 no-underline text-ink transition-all duration-200 hover:border-terracotta hover:-translate-y-1"
      style={{ background: "color-mix(in srgb, var(--paper-2) 86%, transparent)", backdropFilter: "blur(6px)" }}
    >
      <img
        src={app.icon}
        alt={app.name}
        className="w-16 h-16 rounded-[15px] bg-white border border-hairline object-contain"
      />
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
        {String(index + 1).padStart(2, "0")} · {platformOf(app)}
      </span>
      <span className="font-semibold text-[19px] leading-tight">{app.name}</span>
      <span className="text-sm text-ink-2">{description}</span>
    </Link>
  );
}
