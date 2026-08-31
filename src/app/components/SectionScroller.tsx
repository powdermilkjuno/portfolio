'use client';

type SectionScrollerProps = {
  targetId: string;
  label: string;
  onActivate?: () => void;
  onPoint?: () => void;
};

/** The Wii Menu's ringed page button and blue scroll arrow, pointing down. */
export default function SectionScroller({
  targetId,
  label,
  onActivate,
  onPoint,
}: SectionScrollerProps) {
  return (
    <button
      type="button"
      className="wii-scroller mt-8"
      aria-label={`Scroll to ${label}`}
      onMouseEnter={onPoint}
      onClick={() => {
        onActivate?.();
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }}
    >
      <span className="wii-scroller__orb">
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M10.4 3.6h3.2v6.8h6.8v3.2h-6.8v6.8h-3.2v-6.8H3.6v-3.2h6.8z" />
        </svg>
      </span>

      <svg className="wii-scroller__arrow h-5 w-7" viewBox="0 0 28 20" aria-hidden="true">
        <path
          d="M2.5 2.5h23L14 17.5z"
          fill="rgba(255,255,255,0.55)"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>

      <span className="wii-scroller__hint">{label}</span>
    </button>
  );
}
