/**
 * Which "scene" the site-wide animated backdrop plays for a route.
 * The scene switches individual layers on or off (CSS: `.site-backdrop[data-scene]`) and
 * the hue tints the whole backdrop, so each page has its own mood while staying one family.
 */
export type Scene = 'home' | 'services' | 'service' | 'about' | 'work' | 'contact' | 'legal' | 'lost'

export interface SceneInfo {
  scene: Scene
  /** HSL hue (0–360) the backdrop is tinted with. The brand violet sits around 268. */
  hue: number
}

const SERVICE_HUES: Record<string, number> = {
  photography: 272,
  'video-production': 252,
  'content-creation': 284,
  'creative-solutions': 296,
}

export function sceneFor(pathname: string): SceneInfo {
  const path = pathname.replace(/\/+$/, '') || '/'

  if (path === '/') return { scene: 'home', hue: 268 }
  if (path === '/about') return { scene: 'about', hue: 280 }
  if (path === '/services') return { scene: 'services', hue: 258 }
  if (
    path === '/work' ||
    path.startsWith('/work/') ||
    path === '/portfolio' ||
    path.startsWith('/portfolio/')
  )
    return { scene: 'work', hue: 290 }
  if (path === '/contact') return { scene: 'contact', hue: 250 }
  if (path === '/privacy-policy' || path === '/terms-and-conditions') return { scene: 'legal', hue: 264 }

  if (path.startsWith('/services/')) {
    const slug = path.slice('/services/'.length)
    const hue = SERVICE_HUES[slug]
    // An unknown slug redirects to the 404 page, which gets the "lost" scene.
    if (hue !== undefined) return { scene: 'service', hue }
  }

  return { scene: 'lost', hue: 352 }
}
