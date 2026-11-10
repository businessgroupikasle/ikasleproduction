export interface WorkProject {
  slug: string
  title: string
  category: string
  categorySlug: 'commercial-films' | 'photography' | 'brand-campaigns' | 'social-content' | 'creative-productions'
  year: string
  client: string
  tone: 'violet' | 'silver' | 'amber' | 'blue' | 'rose'
  summary: string
  tagline: string
  image: string
  aspectRatio: string
  timecode: string
  cameraPackage: string
  lensPackage: string
  lightingSetup: string
  colorGrade: string
  soundDesign: string
  deliverables: string[]
  tags: string[]
  quote: string
  btsImage: string
  btsTitle: string
  btsDescription: string
  hudData: {
    iso: string
    shutter: string
    wb: string
    fps: string
    iris: string
    lut: string
  }
}

export const WORK_PROJECTS: WorkProject[] = [
  {
    slug: 'kinetic-brand-film',
    title: 'Kinetic Brand Film',
    category: 'Commercial Films',
    categorySlug: 'commercial-films',
    year: '2025',
    client: 'Aero Dynamics / Cadence',
    tone: 'violet',
    summary: 'A high-octane commercial film exploring aerodynamic propulsion, kinetic velocity, and precision-engineered motion.',
    tagline: 'Velocity sculpted in 2.39:1 widescreen anamorphic.',
    image: '/assets/projects/kinetic-brand-film.jpg',
    aspectRatio: '2.39:1 Anamorphic',
    timecode: 'TC 00:01:24:18',
    cameraPackage: 'ARRI Alexa Mini LF',
    lensPackage: 'Cooke Anamorphic /i Full Frame Plus',
    lightingSetup: 'ARRI SkyPanel S360-C & Astera Titan Tubes',
    colorGrade: 'Kodak 5219 500T 35mm Print Emulation',
    soundDesign: 'Dolby Atmos 7.1.4 / Sub-bass Foley & Synths',
    deliverables: ['60s Master Cinema Cut', '30s Broadcast TVC', '15s Social Teasers', 'High-Res Stills Vault'],
    tags: ['Commercial', 'Automotive', 'Anamorphic 4K'],
    quote: 'Rhythm, tension, and kinetic precision in every single frame.',
    btsImage: '/assets/gallery/canon-cinema-rig.jpg',
    btsTitle: '60mph Tracking Rigging',
    btsDescription: 'Rigged with dual wireless follow-focus and specialized gyro-stabilizer for 60mph high-speed tracking sequences.',
    hudData: {
      iso: '800',
      shutter: '180.0°',
      wb: '5600K',
      fps: '24.00',
      iris: 'T2.0',
      lut: 'ARRI Log-C to 709',
    },
  },
  {
    slug: 'human-light',
    title: 'Human / Light',
    category: 'Photography',
    categorySlug: 'photography',
    year: '2025',
    client: 'Lumina Editorial & Gallery',
    tone: 'silver',
    summary: 'A sculptural editorial portrait series built around sculpted directional light, micro-shadows, and raw human expression.',
    tagline: 'Light as an architectural element of the human form.',
    image: '/assets/projects/human-light.jpg',
    aspectRatio: '4:5 Medium Format',
    timecode: 'FRAME #0412',
    cameraPackage: 'Hasselblad H6D-100c',
    lensPackage: 'HC 100mm f/2.2 & HC 50mm-II',
    lightingSetup: 'Broncolor Para 133FB with Scrim & Negative Fill',
    colorGrade: 'Sculpted Monochrome Split-Tone / Archival Silver',
    soundDesign: 'Natural Studio Ambience / Analog Shutter',
    deliverables: ['18 Curated Fine Art Plates', 'Billboard Key Visuals', 'Exhibition Archival Book'],
    tags: ['Editorial', 'Portraits', 'Fine Art'],
    quote: 'Stripping away the excess to let light articulate the truth.',
    btsImage: '/assets/gallery/photographer-mirror.jpg',
    btsTitle: 'Directional Negative Fill',
    btsDescription: 'Crafted using single-source directional tungsten lighting with hand-held silver bounce boards to isolate authentic facial contouring.',
    hudData: {
      iso: '100',
      shutter: '1/250s',
      wb: '5200K',
      fps: 'Stills',
      iris: 'f/4.5',
      lut: 'Silver Halide Mono',
    },
  },
  {
    slug: 'objects-in-motion',
    title: 'Objects in Motion',
    category: 'Brand Campaigns',
    categorySlug: 'brand-campaigns',
    year: '2024',
    client: 'Vanguard Industrial Design',
    tone: 'amber',
    summary: 'A multi-channel campaign presentation capturing material friction, thermal glow, and synchronized product mechanics at 1000fps.',
    tagline: 'High-speed physics meets tactile industrial luxury.',
    image: '/assets/projects/objects-in-motion.jpg',
    aspectRatio: '16:9 DCI 4K',
    timecode: 'TC 00:03:12:04',
    cameraPackage: 'RED V-Raptor 8K VV + Phantom Flex 4K',
    lensPackage: 'Leica Summicron-C Primes & Macro 90mm',
    lightingSetup: 'High-Speed Flicker-Free HMI 18kW Array',
    colorGrade: 'Warm Amber High-Contrast Tungsten',
    soundDesign: 'Tactile Micro-Foley & Spatial Transient Accents',
    deliverables: ['Campaign Anthem Film', '1000fps Macro Plates', 'Global Retail In-Store Display Loops'],
    tags: ['High Speed', 'Macro Textures', '1000 FPS'],
    quote: 'When time slows down by 40x, pure engineering becomes sculpture.',
    btsImage: '/assets/gallery/creative-studio-session.jpg',
    btsTitle: 'Robotic Motion Control',
    btsDescription: 'Filmed on custom motion-control robotic arms synchronizing shutter timing with liquid displacement at 1000 frames per second.',
    hudData: {
      iso: '1250',
      shutter: '90.0°',
      wb: '3200K',
      fps: '1000.00',
      iris: 'T2.8',
      lut: 'Vanguard Amber LUT',
    },
  },
  {
    slug: 'vertical-culture',
    title: 'Vertical Culture',
    category: 'Social Content',
    categorySlug: 'social-content',
    year: '2025',
    client: 'Pulse Media Studios',
    tone: 'blue',
    summary: 'A social-first episodic content system engineered for high-engagement mobile viewing with razor-sharp editorial cutdowns.',
    tagline: 'Episodic storytelling native to 9:16 mobile feeds.',
    image: '/assets/projects/vertical-culture.jpg',
    aspectRatio: '9:16 Vertical',
    timecode: 'TC 00:00:45:22',
    cameraPackage: 'Sony FX9 & Dual FX3 Multi-Cam Rig',
    lensPackage: 'Sony G-Master 24-70mm & 50mm f/1.2 GM',
    lightingSetup: 'Aputure 600d Pro with Lantern Diffusers',
    colorGrade: 'Clean Modern High-Key with Neon Accents',
    soundDesign: 'Punchy Platform-Optimized Mix / Binaural Spatial Audio',
    deliverables: ['24 Episodic Micro-Stories', 'TikTok & Reels 4K Master', 'Modular Soundbite Library'],
    tags: ['Vertical 9:16', 'Episodic', 'Creator Culture'],
    quote: 'The first three seconds demand wonder; the remaining sixty deliver mastery.',
    btsImage: '/assets/gallery/editorial-just-do-it.jpg',
    btsTitle: 'Hook-First Mobile Framework',
    btsDescription: 'Engineered from the ground up for mobile screens with modular hook-first pacing and dynamic typography integration.',
    hudData: {
      iso: '640',
      shutter: '180.0°',
      wb: '5600K',
      fps: '60.00',
      iris: 'f/1.8',
      lut: 'S-Log3 to Rec709',
    },
  },
  {
    slug: 'after-dark',
    title: 'After Dark',
    category: 'Creative Productions',
    categorySlug: 'creative-productions',
    year: '2024',
    client: 'Aether Independent Cinema',
    tone: 'rose',
    summary: 'A nocturnal, atmosphere-led independent film treatment exploring sodium vapor streets, neon haze, and twilight stillness.',
    tagline: 'A cinematic noir drenched in neon rain and twilight.',
    image: '/assets/projects/after-dark.jpg',
    aspectRatio: '2.40:1 CinemaScope',
    timecode: 'TC 00:02:58:11',
    cameraPackage: 'Sony Venice 2 (Dual Native ISO 3200)',
    lensPackage: 'Vintage Zeiss Super Speed T1.3 Primes',
    lightingSetup: 'Practical Neon, Wet Pavement Reflections & Sodium Vapor',
    colorGrade: 'Deep Cyan Shadows & Warm Sodium Amber Halation',
    soundDesign: 'Cinematic Drone Soundscape & Night City Reverb',
    deliverables: ['18min Independent Short Film', 'Original Soundtrack Master', 'Festival DCP Package'],
    tags: ['Nocturnal', 'Atmospheric', 'Low Light'],
    quote: 'Shadow is not the absence of light; it is the stage where mood comes alive.',
    btsImage: '/assets/services/video-production/cine-smoke.jpg',
    btsTitle: 'Atmospheric Fog & Practical Lights',
    btsDescription: 'Filmed exclusively during the 90-minute astronomical twilight window and night rain to capture true atmospheric density.',
    hudData: {
      iso: '3200',
      shutter: '180.0°',
      wb: '4300K',
      fps: '24.00',
      iris: 'T1.3',
      lut: 'Nocturne Cyan LUT',
    },
  },
]

export const WORK_CATEGORIES = [
  { id: 'all', label: 'All Works' },
  { id: 'commercial-films', label: 'Commercial Films' },
  { id: 'photography', label: 'Photography' },
  { id: 'brand-campaigns', label: 'Brand Campaigns' },
  { id: 'social-content', label: 'Social Content' },
  { id: 'creative-productions', label: 'Creative Productions' },
] as const

