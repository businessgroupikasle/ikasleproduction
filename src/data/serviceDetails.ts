import { Aperture, Camera, Clapperboard, Film, Lightbulb, Send, Share2, Smartphone, Compass, type LucideIcon } from 'lucide-react'
import { PHOTOGRAPHY_DELIVERABLES, PHOTOGRAPHY_SERVICES } from './photography'

/** Which screen effect + sound the hero "signature" button fires. */
export type SignatureEffect = 'shutter' | 'clapper' | 'publish' | 'spark'

/** Which HUD treatment wraps the discipline preview image. */
export type PreviewStyle = 'camera' | 'cinema' | 'format' | 'studio'

/** Frame ratios available in the Content Creation format switcher. */
export type FrameFormat = '9:16' | '4:5' | '1:1' | '16:9'

export interface ServiceDiscipline {
  id: string
  index: string
  title: string
  tagline: string
  description: string
  deliverables: string[]
  specs: string
  image: string
  alt: string
  /** CSS object-position used to frame the image inside the 16:10 preview. */
  focus?: string
  /** Default frame ratio for the `format` preview style. */
  format?: FrameFormat
}

export interface ServiceDetailConfig {
  slug: string
  /** Eyebrow pill in the hero, e.g. "SERVICES / 02 · MOTION & STORY". */
  badge: string
  badgeIcon: LucideIcon
  title: string
  description: string
  metaDescription: string
  metaTags: string[]
  signature: {
    effect: SignatureEffect
    icon: LucideIcon
    label: string
    ariaLabel: string
    hint: string
    note: string
  }
  deliverables: readonly { title: string; description: string }[]
  deliverablesFootnote: string
  previewStyle: PreviewStyle
  previewIcon: LucideIcon
  disciplines: {
    title: string
    subtitle: string
    items: ServiceDiscipline[]
  }
  cta: { description: string }
}

const photography: ServiceDetailConfig = {
  slug: 'photography',
  badge: 'SERVICES / 01 · CRAFT & VISION',
  badgeIcon: Aperture,
  title: 'PHOTOGRAPHY',
  description:
    'Purposeful image-making for brands, products, portraits, and editorial stories — from visual planning through the final grade.',
  metaDescription:
    'Purposeful image-making for brands, products, portraits, and editorial stories — from visual planning through the final grade.',
  metaTags: ['100MP Resolution', '16-Bit RAW Grade', 'Sculpted Light', 'Master Retouching'],
  signature: {
    effect: 'shutter',
    icon: Camera,
    label: 'Trigger Studio Shutter',
    ariaLabel: 'Trigger studio camera shutter sound',
    hint: 'Click to trigger camera shutter',
    note: 'Phase One & Hasselblad Medium Format Systems',
  },
  deliverables: PHOTOGRAPHY_DELIVERABLES,
  deliverablesFootnote: 'Calibrated proofing & archival grade color delivery',
  previewStyle: 'camera',
  previewIcon: Camera,
  disciplines: {
    title: 'PHOTOGRAPHY SERVICES.',
    subtitle:
      'From tactile product reflections to multi-market commercial narratives, explore each specialized photographic medium crafted by our studio.',
    items: PHOTOGRAPHY_SERVICES,
  },
  cta: {
    description:
      'Whether you need a defining editorial portrait, a global commercial campaign, or an extensive product catalog, we bring visual precision and cinematic craft to every frame.',
  },
}

const videoProduction: ServiceDetailConfig = {
  slug: 'video-production',
  badge: 'SERVICES / 02 · MOTION & STORY',
  badgeIcon: Clapperboard,
  title: 'VIDEO PRODUCTION',
  description:
    'End-to-end film production shaped around the idea — treatments, crews, shoots, edits, sound, colour, and delivery.',
  metaDescription:
    'End-to-end film production shaped around the idea — treatments, crews, shoots, edits, sound, colour, and delivery.',
  metaTags: ['4K Cinema Capture', 'Colour-Graded Masters', 'Sound Design & Mix', 'Platform Delivery'],
  signature: {
    effect: 'clapper',
    icon: Clapperboard,
    label: 'Call Action',
    ariaLabel: 'Call Action: play clapperboard snap and action sound',
    hint: 'Click to call action',
    note: 'Cinema cameras · Cine primes · Full crew',
  },
  deliverables: [
    {
      title: 'Creative treatment and planning',
      description: 'Scripts, storyboards, shot lists, casting and scheduling, so every frame on the day is already decided.',
    },
    {
      title: 'Production and direction',
      description: 'Full crews, cinema cameras, lighting and on-set direction delivered under one coordinated roof.',
    },
    {
      title: 'Edit, sound and colour grade',
      description: 'Story-first edits, sound design and mix, motion graphics, and a calibrated colour finish.',
    },
  ],
  deliverablesFootnote: 'Broadcast-ready masters, captions & platform exports',
  previewStyle: 'cinema',
  previewIcon: Film,
  disciplines: {
    title: 'VIDEO PRODUCTION SERVICES.',
    subtitle:
      'From thirty-second commercials to event aftermovies, explore each film format our studio plans, shoots, and finishes end to end.',
    items: [
      {
        id: 'commercial',
        index: '01',
        title: 'Commercial Films',
        tagline: 'Thirty seconds that sell a whole world',
        description:
          'High-craft TV, cinema, and digital commercials where concept, casting, cinematography, and finishing are directed as one idea.',
        deliverables: ['Concept & script development', 'Full-crew shoot & direction', 'Hero spot + cutdown edits', 'Sound mix & broadcast delivery'],
        specs: 'Cinema Cameras · Cine Primes · 4K DCI · 24 FPS',
        image: '/assets/projects/kinetic-brand-film.jpg',
        alt: 'Film crew shooting a commercial on a white studio set with cinema cameras and softbox lighting',
        focus: 'center 58%',
      },
      {
        id: 'brand',
        index: '02',
        title: 'Brand Films',
        tagline: 'Identity in motion, told with intent',
        description:
          'Narrative-led films that express what a brand believes: origin stories, manifestos, and campaign hero films with a cinematic point of view.',
        deliverables: ['Manifesto & origin films', 'Narrative treatment & scripting', 'Director-led cinematography', 'Colour-graded hero master'],
        specs: 'Anamorphic Optics · Practical Lighting · Filmic Colour Pipeline',
        image: '/assets/services/video-production/cine-wide.jpg',
        alt: 'Cinema camera on a plinth beneath a single spotlight beam',
      },
      {
        id: 'product',
        index: '03',
        title: 'Product Films',
        tagline: 'Macro motion & tactile detail',
        description:
          'Precision macro and controlled-motion cinematography that makes materials, mechanisms, and finishes look as desirable as they feel.',
        deliverables: ['Hero product reveals', 'Macro & texture sequences', 'Launch & teaser edits', 'Packshot loops for web and retail'],
        specs: 'Macro Lenses · Slider & Gimbal Rigs · Controlled Studio Light',
        image: '/assets/services/video-production/cine-lens.jpg',
        alt: 'Close-up of a cinema camera and lens lit by a soft spotlight',
      },
      {
        id: 'corporate',
        index: '04',
        title: 'Corporate Videos',
        tagline: 'Leadership, culture & clarity on camera',
        description:
          'Company films, founder stories, explainers, and investor-ready videos that present people and purpose with confidence and polish.',
        deliverables: ['Leadership & founder interviews', 'Culture & workplace stories', 'Explainer & training videos', 'Annual report & investor films'],
        specs: 'Two-Camera Interview Setup · Lavalier Audio · Teleprompter',
        image: '/assets/photography/corporate.jpg',
        alt: 'Executive in a navy suit adjusting a jacket in a modern building',
      },
      {
        id: 'event',
        index: '05',
        title: 'Event Films',
        tagline: 'Atmosphere, energy & the moments between',
        description:
          'Multi-camera coverage and fast-turnaround aftermovies for launches, concerts, summits, and celebrations that carry the energy of the room.',
        deliverables: ['Multi-camera live coverage', 'Same-day highlight edits', 'Aftermovies & recap reels', 'Speaker & keynote capture'],
        specs: 'Multi-Cam Coverage · Low-Light Sensors · Live Audio Capture',
        image: '/assets/photography/event.jpg',
        alt: 'Confetti falling over a cheering concert crowd under stage lights',
      },
      {
        id: 'wedding',
        index: '06',
        title: 'Wedding Films',
        tagline: 'Cinematic romance, unscripted emotion',
        description:
          'Documentary-style wedding films that preserve the vows, the laughter, and the quiet moments in a timeless, filmic edit.',
        deliverables: ['Full-day documentary coverage', 'Highlight film & teaser', 'Ceremony & speech edits', 'Licensed score & sound design'],
        specs: 'Handheld & Gimbal Coverage · Natural Light · Film Emulation Grade',
        image: '/assets/photography/wedding.jpg',
        alt: 'Couple holding a bouquet in warm golden backlight',
      },
      {
        id: 'trailers',
        index: '07',
        title: 'Trailers & Short Films',
        tagline: 'Tension, rhythm & the perfect hook',
        description:
          'Story-driven teasers, trailers, and short films for launches, music, and independent productions, cut for rhythm and emotional pull.',
        deliverables: ['Trailers & teasers', 'Short-form narrative films', 'Music & lyric visuals', 'Title design & key art stills'],
        specs: 'Dramatic Contrast · Sound-Led Editing · Title Design',
        image: '/assets/services/video-production/cine-smoke.jpg',
        alt: 'Cinema camera lit by a dramatic beam of light and swirling smoke',
      },
      {
        id: 'post',
        index: '08',
        title: 'Post-Production & Grade',
        tagline: 'Edit, sound, colour & motion, finished properly',
        description:
          'A complete finishing suite: story edits, sound design, motion graphics, and calibrated colour to deliver a polished master for every platform.',
        deliverables: ['Offline & online editing', 'Sound design & final mix', 'Motion graphics & titles', 'Colour grade & multi-format delivery'],
        specs: 'Log-Colour Pipeline · Calibrated Grading · Stereo & 5.1 Mix',
        image: '/assets/services/video-production/cine-tilt.jpg',
        alt: 'Cinema camera angled through drifting smoke in a dark studio',
      },
    ],
  },
  cta: {
    description:
      'Whether you need a thirty-second commercial, a brand film, or a full event aftermovie, we plan, shoot, and finish every frame with cinematic intent.',
  },
}

const contentCreation: ServiceDetailConfig = {
  slug: 'content-creation',
  badge: 'SERVICES / 03 · PLATFORM & PULSE',
  badgeIcon: Share2,
  title: 'CONTENT CREATION',
  description:
    'A repeatable content system with platform-aware concepts, flexible formats, and a consistent visual voice.',
  metaDescription:
    'A repeatable content system with platform-aware concepts, flexible formats, and a consistent visual voice.',
  metaTags: ['Platform-Native Formats', 'Modular Cutdowns', 'Consistent Visual Voice', 'Always-On Systems'],
  signature: {
    effect: 'publish',
    icon: Send,
    label: 'Go Live',
    ariaLabel: 'Go Live: play publish sound and live effect',
    hint: 'Click to publish',
    note: 'Reels · Shorts · TikTok · LinkedIn · YouTube',
  },
  deliverables: [
    {
      title: 'Content concepts and formats',
      description: 'Recurring series, hooks, and story formats built around your audience and the way each platform is watched.',
    },
    {
      title: 'Platform-ready production',
      description: 'Shot, edited, and captioned for Reels, Shorts, TikTok, LinkedIn, and YouTube with native pacing.',
    },
    {
      title: 'Modular aspect ratios and cutdowns',
      description: 'One shoot delivered as 9:16, 4:5, 1:1, and 16:9 versions, plus short cutdowns for every placement.',
    },
  ],
  deliverablesFootnote: 'Every format exported, named & ready to post',
  previewStyle: 'format',
  previewIcon: Smartphone,
  disciplines: {
    title: 'CONTENT CREATION SERVICES.',
    subtitle:
      'From scroll-stopping reels to always-on content systems, explore the formats we design for every platform and audience.',
    items: [
      {
        id: 'reels',
        index: '01',
        title: 'Reels & Short-Form',
        tagline: 'Hooks, pace & thumb-stopping rhythm',
        description:
          'Vertical-first short videos designed around the first three seconds, native editing rhythm, and the way each platform rewards attention.',
        deliverables: ['Hook-led concepts & scripts', 'Vertical shoot & edit', 'Captions, sound & trending formats', 'Reels, Shorts & TikTok exports'],
        specs: 'Reels · Shorts · TikTok',
        image: '/assets/projects/vertical-culture.jpg',
        alt: 'Creator framing a vertical shot with a phone on a gimbal in a bright studio',
        focus: 'center 40%',
        format: '9:16',
      },
      {
        id: 'campaigns',
        index: '02',
        title: 'Social Campaigns',
        tagline: 'One big idea, a hundred small moments',
        description:
          'Campaign-wide content architectures that turn a single concept into coordinated posts, stories, and films across every channel.',
        deliverables: ['Campaign concept & key visuals', 'Multi-channel content calendars', 'Story, feed & carousel assets', 'Launch, teaser & sustain phases'],
        specs: 'Instagram · LinkedIn · X · Facebook',
        image: '/assets/gallery/editorial-just-do-it.jpg',
        alt: 'Black and white editorial campaign poster with bold headline and red banner',
        focus: 'center 30%',
        format: '4:5',
      },
      {
        id: 'creator',
        index: '03',
        title: 'Creator-Led Content',
        tagline: 'Authentic voices, polished production',
        description:
          'Collaborations with creators and in-house talent that keep the human feel of UGC while meeting your brand’s standard of craft.',
        deliverables: ['Creator briefing & direction', 'UGC-style product content', 'Founder & team-led series', 'Raw-to-polished post workflow'],
        specs: 'Creator Collabs · UGC · Founder Content',
        image: '/assets/gallery/photographer-mirror.jpg',
        alt: 'Creator holding a camera in a mirror reflection',
        focus: 'center 45%',
        format: '9:16',
      },
      {
        id: 'lifestyle',
        index: '04',
        title: 'Fashion & Lifestyle Content',
        tagline: 'Colour, attitude & scroll-stopping style',
        description:
          'Style-led photo and video content for fashion, beauty, and lifestyle brands, built to look native in feeds and lookbooks.',
        deliverables: ['Lookbook reels & stills', 'Behind-the-scenes content', 'Drop & launch content packs', 'Influencer-ready asset kits'],
        specs: 'Instagram · Pinterest · TikTok Shop',
        image: '/assets/photography/fashion.jpg',
        alt: 'Model in striped trousers against a teal wall with a neon sign',
        focus: 'center 60%',
        format: '4:5',
      },
      {
        id: 'systems',
        index: '05',
        title: 'Content Systems & Planning',
        tagline: 'A repeatable engine, not a one-off post',
        description:
          'Strategy, calendars, and production workflows that keep a consistent voice and a steady rhythm of content without reinventing the wheel every week.',
        deliverables: ['Content pillars & formats', 'Monthly production calendars', 'Batch shoot planning', 'Templates & brand guidelines'],
        specs: 'Planning · Batching · Brand Templates',
        image: '/assets/gallery/creative-studio-session.jpg',
        alt: 'Team arranging printed content ideas across a studio wall and table',
        format: '1:1',
      },
      {
        id: 'cutdowns',
        index: '06',
        title: 'Cutdowns & Versioning',
        tagline: 'One shoot, every format',
        description:
          'Modular editing that transforms a single hero asset into every ratio, length, and platform specification you need.',
        deliverables: ['9:16, 4:5, 1:1 & 16:9 versions', '6, 15 & 30-second cutdowns', 'Subtitles & localised versions', 'Organised, named export packs'],
        specs: '9:16 · 4:5 · 1:1 · 16:9',
        image: '/assets/photography/commercial.jpg',
        alt: 'Camera tossed in the air in an autumn forest',
        focus: 'center 40%',
        format: '16:9',
      },
    ],
  },
  cta: {
    description:
      'Whether you need a launch-week campaign, a creator partnership, or a content engine that runs all year, we build the formats and the system behind them.',
  },
}

const creativeSolutions: ServiceDetailConfig = {
  slug: 'creative-solutions',
  badge: 'SERVICES / 04 · IDEA & DIRECTION',
  badgeIcon: Lightbulb,
  title: 'CREATIVE SOLUTIONS',
  description:
    'Creative direction that connects the brief to a practical, production-ready visual world.',
  metaDescription:
    'Creative direction that connects the brief to a practical, production-ready visual world.',
  metaTags: ['Concept to Production', 'Visual Treatments', 'Story Systems', 'Art Direction'],
  signature: {
    effect: 'spark',
    icon: Lightbulb,
    label: 'Spark an Idea',
    ariaLabel: 'Spark an Idea: play chime and light effect',
    hint: 'Click to spark an idea',
    note: 'Strategy · Concept · Treatment · Production',
  },
  deliverables: [
    {
      title: 'Creative direction',
      description: 'A clear point of view for the brief: the idea, tone, audience, and the visual language that carries them.',
    },
    {
      title: 'Visual treatments and story systems',
      description: 'Moodboards, look decks, and storyboards that make the idea tangible before a single frame is shot.',
    },
    {
      title: 'Production design and supervision',
      description: 'Sets, styling, props, and on-shoot supervision so the approved world is the one that reaches the screen.',
    },
  ],
  deliverablesFootnote: 'Decks, treatments & production-ready briefs',
  previewStyle: 'studio',
  previewIcon: Compass,
  disciplines: {
    title: 'CREATIVE DISCIPLINES.',
    subtitle:
      'From the first spark of an idea to a fully designed production world, explore the creative services that shape every project we make.',
    items: [
      {
        id: 'direction',
        index: '01',
        title: 'Creative Direction',
        tagline: 'A clear point of view for every brief',
        description:
          'The idea, tone, and visual language that hold a project together, defined with you before production starts and protected through delivery.',
        deliverables: ['Brief interrogation & positioning', 'Core idea & tone of voice', 'Visual language & references', 'Direction through production'],
        specs: 'Strategy · Tone · Visual Language',
        image: '/assets/projects/objects-in-motion.jpg',
        alt: 'Two creative directors reviewing campaign boards in a bright studio',
        focus: 'center 22%',
      },
      {
        id: 'concept',
        index: '02',
        title: 'Concept Development',
        tagline: 'From blank page to big idea',
        description:
          'Collaborative ideation sessions that produce distinct, buildable concepts, with the reasoning to help you choose between them.',
        deliverables: ['Ideation workshops', 'Concept routes & headlines', 'Narrative & script outlines', 'Concept presentation decks'],
        specs: 'Workshops · Routes · Narrative Outlines',
        image: '/assets/gallery/creative-studio-session.jpg',
        alt: 'Creative team pinning concept sheets to a studio wall',
      },
      {
        id: 'treatments',
        index: '03',
        title: 'Visual Treatments & Moodboards',
        tagline: 'See the film before it exists',
        description:
          'Look decks, moodboards, and colour studies that translate the idea into something everyone can see, react to, and approve.',
        deliverables: ['Moodboards & look decks', 'Colour & lighting studies', 'Reference reels', 'Tone & framing guides'],
        specs: 'Look Decks · Colour Studies · Reference Reels',
        image: '/assets/projects/objects-in-motion.jpg',
        alt: 'Printed moodboard frames and colour studies spread across a table',
        focus: 'center 92%',
      },
      {
        id: 'storyboards',
        index: '04',
        title: 'Storyboards & Pre-Vis',
        tagline: 'Every shot decided before the shoot day',
        description:
          'Boards, shot lists, and animatics that lock in the story, the coverage, and the schedule, saving time and money on set.',
        deliverables: ['Storyboards & animatics', 'Shot lists & coverage plans', 'Location & schedule planning', 'Pre-production packs'],
        specs: 'Boards · Animatics · Shot Lists',
        image: '/assets/projects/kinetic-brand-film.jpg',
        alt: 'Crew monitoring shots on set with camera monitors and lighting',
        focus: 'center 28%',
      },
      {
        id: 'production-design',
        index: '05',
        title: 'Production Design & Styling',
        tagline: 'Built worlds that feel intentional',
        description:
          'Sets, styling, props, and wardrobe designed as one cohesive world and supervised on the day so the approved look is the one captured.',
        deliverables: ['Set & prop design', 'Wardrobe & styling direction', 'Art department supervision', 'On-shoot creative supervision'],
        specs: 'Set Design · Styling · On-Set Supervision',
        image: '/assets/photography/architectural.jpg',
        alt: 'Modern architectural space with warm interior lighting at dusk',
      },
      {
        id: 'visual-systems',
        index: '06',
        title: 'Brand Visual Systems',
        tagline: 'Key visuals that hold together everywhere',
        description:
          'Typography, colour, and image rules built into reusable key visuals and campaign templates, so every asset looks like the same brand.',
        deliverables: ['Key visual development', 'Typography & colour systems', 'Campaign templates', 'Guidelines & asset libraries'],
        specs: 'Key Visuals · Typography · Templates',
        image: '/assets/gallery/editorial-just-do-it.jpg',
        alt: 'Editorial key visual with bold typography over a newsprint texture',
        focus: 'center 12%',
      },
    ],
  },
  cta: {
    description:
      'Whether you have a loose brief or a fully formed idea, we shape the concept, the look, and the production plan that carries it from page to screen.',
  },
}

export const serviceDetails: Record<string, ServiceDetailConfig> = {
  [photography.slug]: photography,
  [videoProduction.slug]: videoProduction,
  [contentCreation.slug]: contentCreation,
  [creativeSolutions.slug]: creativeSolutions,
}

/** Content Creation format switcher options (ratio value + human label). */
export const FRAME_FORMATS: readonly { value: FrameFormat; label: string; ratio: number }[] = [
  { value: '9:16', label: 'Reels', ratio: 9 / 16 },
  { value: '4:5', label: 'Feed', ratio: 4 / 5 },
  { value: '1:1', label: 'Square', ratio: 1 },
  { value: '16:9', label: 'Wide', ratio: 16 / 9 },
]
