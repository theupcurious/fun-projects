"use client";

import { useEffect } from "react";
import { buildGoogleFontsUrl } from "@/lib/fonts";

interface FontLoaderProps {
  fonts: string[];
}

const loadedUrls = new Set<string>();

export function FontLoader({ fonts }: FontLoaderProps) {
  useEffect(() => {
    const url = buildGoogleFontsUrl(fonts);
    if (!url || loadedUrls.has(url)) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
    loadedUrls.add(url);
  }, [fonts]);

  return null;
}
