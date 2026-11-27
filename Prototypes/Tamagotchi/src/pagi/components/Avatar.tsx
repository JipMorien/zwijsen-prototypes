import type { Animation, Mood } from "../types";

interface AvatarProps {
  mood: Mood;
  lookingDown: boolean;
  animation?: Animation;
}

const EYE_X = [80, 120];
const PUPIL_DROP_WHEN_LOOKING_DOWN = 5;

function Eyes({ mood, lookingDown }: Omit<AvatarProps, "animation">) {
  if (mood === "slaapt") {
    return (
      <g className="pagi-line">
        {EYE_X.map((x) => (
          <path key={x} d={`M${x - 10} 72 Q${x} 81 ${x + 10} 72`} />
        ))}
      </g>
    );
  }
  const pupilY = 74 + (lookingDown ? PUPIL_DROP_WHEN_LOOKING_DOWN : 0);
  return (
    <g>
      {EYE_X.map((x) => (
        <g key={x}>
          <ellipse className="pagi-eye" cx={x} cy={72} rx={12} ry={14} />
          <circle className="pagi-pupil" cx={x} cy={pupilY} r={6} />
          <circle className="pagi-shine" cx={x + 2} cy={pupilY - 2} r={2} />
        </g>
      ))}
    </g>
  );
}

function Mouth({ mood }: { mood: Mood }) {
  if (mood === "honger") {
    return <ellipse className="pagi-pupil" cx={100} cy={106} rx={7} ry={9} />;
  }
  if (mood === "slaapt") {
    return <path className="pagi-line" d="M93 104 Q100 108 107 104" />;
  }
  return <path className="pagi-line" d="M86 100 Q100 114 114 100" />;
}

export function Avatar({ mood, lookingDown, animation }: AvatarProps) {
  const classNames = ["pagi-svg", `pagi-svg--${mood}`];
  if (animation) classNames.push(`pagi-svg--${animation}`);

  return (
    <svg
      className={classNames.join(" ")}
      viewBox="28 -4 144 194"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse className="pagi-foot" cx={78} cy={170} rx={14} ry={7} />
      <ellipse className="pagi-foot" cx={122} cy={170} rx={14} ry={7} />
      <ellipse className="pagi-arm" cx={44} cy={110} rx={6} ry={12} />
      <ellipse className="pagi-arm" cx={156} cy={110} rx={6} ry={12} />
      <path
        className="pagi-body"
        d="M58 14 H128 L152 38 V150 Q152 166 136 166 H64 Q48 166 48 150 V24 Q48 14 58 14 Z"
      />
      <path className="pagi-fold" d="M128 14 V30 Q128 38 136 38 H152 Z" />
      <g className="pagi-text-lines">
        <path d="M70 128 H130" />
        <path d="M70 138 H122" />
        <path d="M70 148 H126" />
      </g>
      <circle className="pagi-cheek" cx={64} cy={92} r={7} />
      <circle className="pagi-cheek" cx={136} cy={92} r={7} />
      <Eyes mood={mood} lookingDown={lookingDown} />
      <Mouth mood={mood} />
      {mood === "slaapt" && (
        <g className="pagi-zz">
          <text x={150} y={10} fontSize={26}>
            z
          </text>
          <text x={166} y={-6} fontSize={18}>
            z
          </text>
        </g>
      )}
    </svg>
  );
}
