"use client";

import Link from "next/link";

import { trackEvent } from "../lib/analytics";

type TrackedContactLinkProps = {
  className?: string;
  ariaLabel: string;
  eventLabel: string;
  children: React.ReactNode;
};

export function TrackedContactLink({ className, ariaLabel, eventLabel, children }: TrackedContactLinkProps) {
  return (
    <Link
      href="/contact"
      className={className}
      aria-label={ariaLabel}
      onClick={() => trackEvent("contact_banner_click", { label: eventLabel })}
    >
      {children}
    </Link>
  );
}

