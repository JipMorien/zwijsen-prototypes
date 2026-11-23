import {
  Activity,
  Apple,
  Bird,
  BrickWall,
  Bridge,
  Cable,
  Cat,
  Dog,
  Droplets,
  Flower2,
  Footprints,
  HeartHandshake,
  Gem,
  Hand,
  House,
  Leaf,
  Megaphone,
  MoonStar,
  Mountain,
  PawPrint,
  Route,
  Shirt,
  Sparkles,
  Sprout,
  Star,
  TreeDeciduous,
  Trees,
  Waves,
  Wheat,
  Wind,
  type LucideIcon,
} from 'lucide-react'
import type { Illustration, StoryColor } from '../types/story'

const icons: Record<Illustration, LucideIcon> = {
  forest: Trees,
  mill: Wheat,
  stream: Waves,
  flowers: Flower2,
  tracks: PawPrint,
  owl: Bird,
  thorns: Sprout,
  slope: Mountain,
  swamp: Droplets,
  bridge: Bridge,
  stones: BrickWall,
  fox: Dog,
  apple: Apple,
  glove: Hand,
  rope: Cable,
  tree: TreeDeciduous,
  loud: Megaphone,
  shake: Wind,
  cat: Cat,
  wish: Gem,
  home: House,
  night: MoonStar,
  detour: Route,
  torn: Shirt,
  wetShoe: Footprints,
  shaky: Activity,
  tiredFox: Dog,
  friend: HeartHandshake,
}

/** Small line drawings scattered over a cover, like the doodle pattern on Estafette books. */
const doodles: { Icon: LucideIcon; x: number; y: number; r: number }[] = [
  { Icon: Leaf, x: 8, y: 14, r: -15 },
  { Icon: Star, x: 84, y: 10, r: 10 },
  { Icon: Bird, x: 70, y: 72, r: -8 },
  { Icon: Sparkles, x: 16, y: 76, r: 12 },
  { Icon: Flower2, x: 90, y: 46, r: 20 },
  { Icon: PawPrint, x: 4, y: 46, r: -25 },
  { Icon: Leaf, x: 44, y: 86, r: 35 },
  { Icon: Star, x: 30, y: 6, r: -10 },
]

export function IllustrationIcon({ name, size = 72 }: { name: Illustration; size?: number }) {
  const Icon = icons[name]
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true" />
}

/** A coloured panel with a line-icon placeholder illustration. */
export function Scene({
  name,
  color,
  size = 'large',
}: {
  name: Illustration
  color: StoryColor
  size?: 'large' | 'small'
}) {
  return (
    <div className={`scene scene-${color} scene-${size}`} aria-hidden="true">
      {doodles.map(({ Icon, x, y, r }, index) => (
        <Icon
          key={index}
          className="scene-doodle"
          size={size === 'large' ? 26 : 16}
          strokeWidth={1.5}
          style={{ left: `${x}%`, top: `${y}%`, transform: `rotate(${r}deg)` }}
        />
      ))}
      <span className="scene-main">
        <IllustrationIcon name={name} size={size === 'large' ? 88 : 44} />
      </span>
    </div>
  )
}
