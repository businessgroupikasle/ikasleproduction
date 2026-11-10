import { Camera, Compass, Link2, type LucideIcon } from 'lucide-react'

/**
 * Copy for the About page. The wording stays close to the studio's original About text;
 * no figures or client claims are invented here.
 */
export const aboutHero = {
  badge: 'ABOUT / THE STUDIO',
  description:
    'IKASLÉ Productions brings photography, filmmaking, content, and creative thinking together under one production-minded approach.',
  metaDescription: 'Meet the creative production approach behind IKASLÉ Productions in Coimbatore.',
  metaTags: ['Photography', 'Filmmaking', 'Content', 'Creative Thinking', 'Coimbatore Studio'],
  focusNote: 'Coimbatore studio base · Soundstage & mobile units',
} as const

/** Frames cycled in the hero viewfinder (placeholder imagery from the repo). */
export interface AboutFrame {
  id: string
  label: string
  caption: string
  image: string
  alt: string
  focus?: string
}

export const ABOUT_FRAMES: readonly AboutFrame[] = [
  {
    id: 'on-set',
    label: 'ON SET',
    caption: 'Where the idea meets the camera',
    image: '/assets/projects/kinetic-brand-film.jpg',
    alt: 'Film crew shooting on a white studio set with cinema cameras and softbox lighting',
    focus: 'center 55%',
  },
  {
    id: 'in-the-room',
    label: 'IN THE ROOM',
    caption: 'Where the idea takes shape',
    image: '/assets/gallery/creative-studio-session.jpg',
    alt: 'Creative team pinning concept sheets to a studio wall',
  },
  {
    id: 'behind-the-lens',
    label: 'BEHIND THE LENS',
    caption: 'Where it gets captured',
    image: '/assets/services/video-production/cine-wide.jpg',
    alt: 'Cinema camera on a plinth beneath a single spotlight beam',
  },
]

export const aboutManifesto = {
  eyebrow: '02 / THE APPROACH',
  statement: 'Creative thinking belongs close to the camera.',
  paragraphs: [
    'We shape work from the first conversation through delivery. That means the visual idea stays connected to what can be made—beautifully, thoughtfully, and with purpose.',
    'Our role can begin with a defined brief or a blank page. In both cases, we look for the clearest visual language for the story and the audience.',
  ],
} as const

export interface AboutPrinciple {
  index: string
  icon: LucideIcon
  title: string
  text: string
}

export const ABOUT_PRINCIPLES: readonly AboutPrinciple[] = [
  {
    index: '01',
    icon: Camera,
    title: 'Thinking beside the camera',
    text: 'Ideas are shaped next to the people who will shoot, edit, and finish them, so the concept and the frame stay one thing.',
  },
  {
    index: '02',
    icon: Link2,
    title: 'Beautiful, and buildable',
    text: 'Every visual decision stays connected to what can actually be made, then crafted thoughtfully and with purpose.',
  },
  {
    index: '03',
    icon: Compass,
    title: 'Brief or blank page',
    text: 'We can begin with a defined brief or a blank page. Either way, we look for the clearest visual language for the story and the audience.',
  },
]

export const aboutProcess = {
  eyebrow: '03 / HOW WE WORK',
  title: 'FROM THE FIRST IDEA TO THE FINAL FRAME.',
  subtitle: 'Six stages, one connected team. Roll the strip to see how a project moves from brief to delivery.',
} as const

export const aboutCta = {
  eyebrow: 'READY WHEN YOU ARE',
  description:
    'Headquartered in Coimbatore with production capabilities deployed across South India and worldwide — whether you arrive with a defined brief or a blank page, we will build the production around it.',
} as const
