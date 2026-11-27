import type { Mood } from "../types";

interface AvatarProps {
  mood: Mood;
  lookingDown: boolean;
}

export function Avatar({ mood, lookingDown }: AvatarProps) {
  return (
    <svg
      className="pagi-svg"
      viewBox="28 -4 144 194"
      aria-hidden="true"
      focusable="false"
      data-mood={mood}
      data-look={lookingDown ? "down" : undefined}
    >
      <ellipse className="pagi-ground" cx="100" cy="184" rx="50" ry="6" />
      <g className="pagi-zzz">
        <text x="146" y="34" fontSize="24">
          z
        </text>
        <text x="160" y="14" fontSize="17">
          z
        </text>
      </g>
      <path className="pagi-tail" d="M70 42 V18 L78 26 L86 18 V42" />
      <ellipse className="pagi-foot" cx="78" cy="176" rx="15" ry="8" />
      <ellipse className="pagi-foot" cx="122" cy="176" rx="15" ry="8" />
      <path
        className="pagi-body"
        d="M60 40 H125 L155 70 V150 Q155 174 131 174 H69 Q45 174 45 150 V55 Q45 40 60 40 Z"
      />
      <path className="pagi-fold" d="M125 40 V60 Q125 70 135 70 H155 Z" />
      <line className="pagi-belly" x1="76" y1="142" x2="124" y2="142" />
      <line className="pagi-belly" x1="76" y1="155" x2="112" y2="155" />
      <g className="pagi-eyes-open">
        <circle className="pagi-eye" cx="80" cy="96" r="15" />
        <circle className="pagi-eye" cx="120" cy="96" r="15" />
        <g className="pagi-pupils">
          <circle className="pagi-pupil" cx="82" cy="98" r="7" />
          <circle className="pagi-pupil" cx="122" cy="98" r="7" />
          <circle className="pagi-shine" cx="85" cy="95" r="2.5" />
          <circle className="pagi-shine" cx="125" cy="95" r="2.5" />
        </g>
      </g>
      <path
        className="pagi-eyes-closed"
        d="M66 96 Q80 106 94 96 M106 96 Q120 106 134 96"
      />
      <ellipse className="pagi-cheek" cx="64" cy="119" rx="8" ry="5" />
      <ellipse className="pagi-cheek" cx="136" cy="119" rx="8" ry="5" />
      <path className="pagi-mouth-happy" d="M91 118 Q100 128 109 118" />
      <ellipse className="pagi-mouth-o" cx="100" cy="123" rx="6" ry="7" />
    </svg>
  );
}
