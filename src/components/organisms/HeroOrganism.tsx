"use client";

import { useEffect, useState } from "react";
import { BodyText, Surface } from "@/components/atoms";
import { ScrollHint, SectionHeader } from "@/components/molecules";
import { HeroFieldXBackground } from "./HeroRadialBurstBackground";

import type { HomeSection } from "@/types/site";

type HeroOrganismProps = {
  sectionId: HomeSection;
  title: string;
  body: string;
};

export function HeroOrganism({ sectionId, title, body }: HeroOrganismProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setIsReady(true);
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setIsReady(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <Surface
      as="section"
      id={sectionId}
      tone="light"
      labelledBy="home-hero-title"
      className={`fx-hero-organism${isReady ? " is-ready" : ""}`}
    >
      <HeroFieldXBackground />
      <div className="fx-shell fx-hero-grid fx-hero-grid--single">
        <div className="fx-hero-copy">
          <SectionHeader title={title} titleId="home-hero-title" level="h1" variant="hero" />
          {body ? <BodyText className="fx-hero-body">{body}</BodyText> : null}
          <ScrollHint />
        </div>
      </div>
    </Surface>
  );
}
