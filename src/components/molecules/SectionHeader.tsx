import type { CSSProperties } from "react";
import { SectionKicker, SectionTitle } from "@/components/atoms";

type SectionHeaderProps = {
  title: string;
  titleId: string;
  kicker?: string;
  level?: "h1" | "h2" | "h3";
  className?: string;
  anchorHref?: string;
  anchorLabel?: string;
};

export function SectionHeader({
  title,
  titleId,
  kicker,
  level = "h2",
  className,
  anchorHref,
  anchorLabel
}: SectionHeaderProps) {
  const titleLines = level === "h1" ? title.split("\n") : null;
  const getHeroLineStyle = (index: number) => ({ ["--fx-hero-line-index"]: index }) as CSSProperties;

  return (
    <header className={className ?? "fx-section-header"}>
      {kicker ? <SectionKicker text={kicker} /> : null}
      <div className="fx-section-title-row">
        <SectionTitle as={level} id={titleId} className={level === "h1" ? "fx-hero-title" : "fx-section-title"}>
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
