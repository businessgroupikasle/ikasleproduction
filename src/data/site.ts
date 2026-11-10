import { Aperture, Clapperboard, Lightbulb, Share2 } from 'lucide-react'

export const services = [
  {
    slug: 'photography',
    index: '01',
    title: 'Photography',
    icon: Aperture,
    description: 'Professional visuals that bring products, people, and brands into focus.',
    detail: 'Purposeful image-making for brands, products, portraits, and editorial stories—from visual planning through the final grade.',
    tags: ['Campaign & Editorial', 'Product & People', 'Retouching & Grade'],
  },
  {
    slug: 'video-production',
    index: '02',
    title: 'Video Production',
    icon: Clapperboard,
    description: 'Creative films, promotional videos, branded content, and cinematic storytelling.',
    detail: 'End-to-end film production shaped around the idea: treatments, crews, shoots, edits, sound, colour, and delivery.',
    tags: ['Commercial Films', 'Brand Content', 'Cinematic Direction'],
  },
  {
    slug: 'content-creation',
    index: '03',
    title: 'Content Creation',
    icon: Share2,
    description: 'Engaging content designed for digital platforms and modern audiences.',
    detail: 'A repeatable content system with platform-aware concepts, flexible formats, and a consistent visual voice.',
    tags: ['Digital & Social', 'Modular Cutdowns', 'Content Systems'],
  },
  {
    slug: 'creative-solutions',
    index: '04',
    title: 'Creative Solutions',
    icon: Lightbulb,
    description: 'Concept development, visual direction, and production-led creative solutions.',
    detail: 'Creative direction that connects the brief to a practical, production-ready visual world.',
    tags: ['Creative Direction', 'Visual Treatments', 'Production Design'],
  },
] as const

export const projects = [
  { slug: 'kinetic-brand-film', title: 'Kinetic Brand Film', category: 'Commercial Films', year: 'Concept', tone: 'violet', summary: 'A sample case-study structure showing how a high-energy brand film could be presented.', image: '/assets/projects/kinetic-brand-film.jpg' },
  { slug: 'human-light', title: 'Human / Light', category: 'Photography', year: 'Concept', tone: 'silver', summary: 'A sample editorial portrait series built around sculpted light and human expression.', image: '/assets/projects/human-light.jpg' },
  { slug: 'objects-in-motion', title: 'Objects in Motion', category: 'Brand Campaigns', year: 'Concept', tone: 'amber', summary: 'A sample campaign presentation exploring rhythm, material, and product movement.', image: '/assets/projects/objects-in-motion.jpg' },
  { slug: 'vertical-culture', title: 'Vertical Culture', category: 'Social Content', year: 'Concept', tone: 'blue', summary: 'A sample social-first content system designed for flexible episodic storytelling.', image: '/assets/projects/vertical-culture.jpg' },
  { slug: 'after-dark', title: 'After Dark', category: 'Creative Productions', year: 'Concept', tone: 'rose', summary: 'A sample visual treatment for a nocturnal, atmosphere-led independent production.', image: '/assets/projects/after-dark.jpg' },
] as const

export const process = [
  ['01', 'Discover', 'Understand the vision, audience, and creative objective.'],
  ['02', 'Concept', 'Develop the story, direction, mood and visual treatment.'],
  ['03', 'Pre-Production', 'Plan scripts, storyboards, shot lists, locations and schedules.'],
  ['04', 'Production', 'Bring the creative vision to life through filming and photography.'],
  ['05', 'Post-Production', 'Edit, grade, mix sound, refine motion graphics and finalize the content.'],
  ['06', 'Delivery', 'Prepare and deliver platform-ready creative assets.'],
] as const
