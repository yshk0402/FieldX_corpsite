import type { CSSProperties } from "react";
import { SectionKicker, SectionTitle } from "@/components/atoms";

type SectionHeaderProps = {
  title: string;
  titleId: string;
  kicker?: string;
  level?: "h1" | "h2" | "h3";
  variant?: "default" | "hero";
  className?: string;
  anchorHref?: string;
  anchorLabel?: string;
};

export function SectionHeader({
  title,
  titleId,
  kicker,
  level = "h2",
  variant = "default",
  className,
  anchorHref,
  anchorLabel
}: SectionHeaderProps) {
  const isHeroVariant = variant === "hero";
  const titleLines = isHeroVariant ? title.split("\n") : null;
  const getHeroLineStyle = (index: number) => ({ ["--fx-hero-line-index"]: index }) as CSSProperties;
  const titleClassName = isHeroVariant ? "fx-hero-title" : level === "h1" ? "fx-page-title" : "fx-section-title";

  return (
    <header className={className ?? "fx-section-header"}>
      {kicker ? <SectionKicker text={kicker} /> : null}
      <div className="fx-section-title-row">
        <SectionTitle as={level} id={titleId} className={titleClassName}>
          {titleLines
            ? titleLines.map((line, index) => (
                <span
                  key={`${titleId}-${index}`}
                  className="fx-hero-title-line"
                  style={getHeroLineStyle(index)}
                >
                  <span className="fx-hero-title-line-text">{line}</span>
                </span>
              ))
            : title}
        </SectionTitle>
        {anchorHref ? (
          <a className="fx-section-anchor" href={anchorHref} aria-label={anchorLabel ?? `${title} anchor link`}>
            #
          </a>
        ) : null}
      </div>
    </header>
  );
}
