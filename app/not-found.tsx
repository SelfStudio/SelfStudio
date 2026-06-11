"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { locales } from "@/lib/locales";

// 兼容旧版 /{locale}/... 链接：404 页检测到已知语言前缀时剥掉前缀跳回干净路径
export default function NotFound() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    if (segments.length > 0 && locales.some((l) => l.slug === segments[0].toLowerCase())) {
      const rest = "/" + segments.slice(1).join("/");
      location.replace(rest === "/" ? "/" : `${rest}/`);
      return;
    }
    setChecking(false);
  }, []);

  if (checking) {
    return null;
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 font-serif text-2xl font-medium">404</h1>
        <Link href="/" className="text-terracotta hover:underline">
          SelfStudio
        </Link>
      </div>
    </main>
  );
}
