export interface CultMemberDetail {
  id: string;
  name: string;
  role: string;
  avatar: string;
  username: string;
}

export interface CultDiscoverItem {
  id: string;
  type: 'cult';
  name: string;
  slug: string;
  tagline: string;
  bio: string;
  coverImage: string;
  avatarUrl: string;
  members: CultMemberDetail[];
  tags: string[];
  location: string;
  startingPrice: string;
  startingPriceNum: number;
  turnaround: string;
  completedProjects: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  availability: 'AVAILABLE' | 'BUSY' | 'NOT_AVAILABLE';
  isFeatured?: boolean;
  featuredQuote?: string;
  portfolio: { id: string; title: string; image: string; category: string }[];
  equipment: string[];
}

export interface FreelancerDiscoverItem {
  id: string;
  type: 'freelancer';
  name: string;
  username: string;
  headline: string;
  bio: string;
  avatarUrl: string;
  coverImage: string;
  location: string;
  skills: string[];
  // Null when a real creative hasn't set a rate yet — distinct from
  // rateType === 'NEGOTIABLE', which is an explicit choice.
  rateType: RateType | null;
  // Null when rateType is 'NEGOTIABLE'/unset — no fixed number to sort/display.
  rateAmount: number | null;
  experienceYears: number;
  completedProjects: number;
  // Null when the creative has no reviews yet.
  rating: number | null;
  reviewCount: number;
  isVerified: boolean;
  availability: 'AVAILABLE' | 'BUSY' | 'NOT_AVAILABLE';
  isFeatured?: boolean;
  portfolio: { id: string; title: string; image: string; category: string }[];
  tools: string[];
}

export type DiscoverItem = CultDiscoverItem | FreelancerDiscoverItem;

export const CATEGORIES = [
  'All Skills',
  'ARRI Alexa',
  'Anamorphic Lenses',
  'Color Grading',
  'Lighting Direction',
  'Unreal Engine 5',
  'Blender 3D',
  'Modular Synths',
  'Costume Design',
  'Custom FPV Rigs',
] as const;

// Mirrors the backend `RateType` enum.
export type RateType = 'HOURLY' | 'DAILY' | 'PROJECT' | 'NEGOTIABLE';

export function getRateLabel(rateType: RateType | null): string {
  switch (rateType) {
    case 'HOURLY':
      return 'Hourly Rate';
    case 'DAILY':
      return 'Day Rate';
    case 'PROJECT':
      return 'Project Rate';
    case 'NEGOTIABLE':
    case null:
      return 'Rate';
  }
}

export function formatRate(
  rateType: RateType | null,
  rateAmount: number | null
): string {
  if (rateType === null) {
    return 'Rate not set';
  }

  if (rateType === 'NEGOTIABLE' || rateAmount === null) {
    return 'Negotiable';
  }

  const formatted = `₹${rateAmount.toLocaleString('en-IN')}`;

  switch (rateType) {
    case 'HOURLY':
      return `${formatted} / hr`;
    case 'DAILY':
      return `${formatted} / day`;
    case 'PROJECT':
      return `${formatted} / project`;
  }
}

export const MOCK_CULTS: CultDiscoverItem[] = [
  {
    id: 'cult-1',
    type: 'cult',
    name: 'Sangeet Cult',
    slug: 'sangeet-cult',
    tagline: 'High-concept film, fashion & wedding narrative collective.',
    bio: 'A unified collective of 5 visionary creators based out of Udaipur and Mumbai. We combine cinematic documentary film, editorial fashion styling, set choreography, and color grading into seamless single-escrow productions.',
    coverImage:
      'https://images.unsplash.com/photo-1587090564077-c7b8f2f1249e?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=srgb&fm=jpg&q=85&w=300',
    members: [
      {
        id: 'm1',
        name: 'Kabir Mehta',
        role: 'Director / DP',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=srgb&fm=jpg&q=85&w=200',
        username: 'kabirfilm',
      },
      {
        id: 'm2',
        name: 'Rhea Sen',
        role: 'Stylist & Costume',
        avatar:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=srgb&fm=jpg&q=85&w=200',
        username: 'rheastyles',
      },
      {
        id: 'm3',
        name: 'Devan Sharma',
        role: 'Choreographer',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=srgb&fm=jpg&q=85&w=200',
        username: 'devanmoves',
      },
      {
        id: 'm4',
        name: 'Aanya Roy',
        role: 'Lead Colorist',
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=srgb&fm=jpg&q=85&w=200',
        username: 'aanyacolor',
      },
      {
        id: 'm5',
        name: 'Tariq Khan',
        role: 'Sound Designer',
        avatar:
          'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?crop=entropy&cs=srgb&fm=jpg&q=85&w=200',
        username: 'tariqaudio',
      },
    ],
    tags: ['Cinema Film', 'Editorial', 'Heritage Weddings', 'Single Escrow'],
    location: 'Mumbai / Udaipur',
    startingPrice: '₹4,20,000',
    startingPriceNum: 420000,
    turnaround: '5 - 7 Days',
    completedProjects: 48,
    rating: 4.98,
    reviewCount: 36,
    isVerified: true,
    availability: 'AVAILABLE',
    isFeatured: true,
    featuredQuote:
      'One brief. Five visionaries. One invoice held securely in escrow.',
    portfolio: [
      {
        id: 'p1',
        title: 'Udaipur Royal Symphony',
        image:
          'https://images.unsplash.com/photo-1587090564077-c7b8f2f1249e?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
        category: 'Cinematic Film',
      },
      {
        id: 'p2',
        title: 'Vogue Heritage Spread',
        image:
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
        category: 'Fashion Styling',
      },
      {
        id: 'p3',
        title: 'Palace After Dark',
        image:
          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
        category: 'Choreography & Motion',
      },
    ],
    equipment: [
      'ARRI Alexa Mini LF',
      'Cooke Anamorphic Lenses',
      'RED V-Raptor 8K',
      'Ronin 2 Rig',
      'Aputure 1200d Lighting Array',
    ],
  },
  {
    id: 'cult-2',
    type: 'cult',
    name: 'HyperNeon 3D',
    slug: 'hyperneon-3d',
    tagline: 'Cyberpunk CGI, spatial design & immersive brand experiences.',
    bio: 'Boutique 3D animation collective pushing the boundaries of real-time Unreal Engine 5 visual graphics, CGI product reveals, and futuristic metaverse environments for global tech & fashion brands.',
    coverImage:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
    avatarUrl:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=srgb&fm=jpg&q=85&w=300',
    members: [
      {
        id: 'hm1',
        name: 'Zane Malik',
        role: '3D Art Director',
        avatar:
          'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?crop=entropy&cs=srgb&fm=jpg&q=85&w=200',
        username: 'zaneneon',
      },
      {
        id: 'hm2',
        name: 'Kira Tanaka',
        role: 'Houdini FX Artist',
        avatar:
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=srgb&fm=jpg&q=85&w=200',
        username: 'kirafx',
      },
      {
        id: 'hm3',
        name: 'Alex Rivera',
        role: 'Unreal Engine Specialist',
        avatar:
          'https://images.unsplash.com/photo-1527980965255-d3b416303d12?crop=entropy&cs=srgb&fm=jpg&q=85&w=200',
        username: 'alexunreal',
      },
    ],
    tags: ['Unreal Engine 5', 'Houdini FX', 'Octane Render', 'Spatial 3D'],
    location: 'Bengaluru / Remote',
    startingPrice: '₹3,50,000',
    startingPriceNum: 350000,
    turnaround: '7 - 10 Days',
    completedProjects: 62,
    rating: 4.95,
    reviewCount: 41,
    isVerified: true,
    availability: 'AVAILABLE',
    portfolio: [
      {
        id: 'hp1',
        title: 'Cyberpunk Sneaker Reveal',
        image:
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
        category: '3D Product CGI',
      },
      {
        id: 'hp2',
        title: 'Neo Tokyo Virtual Stage',
        image:
          'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
        category: 'Spatial Environment',
      },
    ],
    equipment: [
      'Dual RTX 4090 Rendering Farm',
      'SideFX Houdini Studio',
      'Cinema 4D + Redshift',
      'Unreal Virtual Production Rig',
    ],
  },
  {
    id: 'cult-3',
    type: 'cult',
    name: 'Nocturne Sound',
    slug: 'nocturne-sound',
    tagline: 'Experimental score, spatial audio & mixing for feature films.',
    bio: 'Audio collective specializing in custom analog synthesizer scoring, Dolby Atmos spatial mixing, and foley sound design. Trusted by independent film directors and streaming commercial campaigns.',
    coverImage:
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
    avatarUrl:
      'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?crop=entropy&cs=srgb&fm=jpg&q=85&w=300',
    members: [
      {
        id: 'nm1',
        name: 'Arjun Das',
        role: 'Lead Composer',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=srgb&fm=jpg&q=85&w=200',
        username: 'arjunsound',
      },
      {
        id: 'nm2',
        name: 'Siddharth Rao',
        role: 'Atmos Mixing Engineer',
        avatar:
          'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?crop=entropy&cs=srgb&fm=jpg&q=85&w=200',
        username: 'sidatmos',
      },
    ],
    tags: ['Dolby Atmos', 'Analog Synths', 'Foley Recording', 'Film Score'],
    location: 'Goa / Mumbai',
    startingPrice: '₹1,80,000',
    startingPriceNum: 180000,
    turnaround: '4 - 6 Days',
    completedProjects: 39,
    rating: 4.92,
    reviewCount: 28,
    isVerified: true,
    availability: 'AVAILABLE',
    portfolio: [
      {
        id: 'np1',
        title: 'Dark Waters Motion Score',
        image:
          'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
        category: 'Original Score',
      },
      {
        id: 'np2',
        title: 'Sonic Branding Campaign',
        image:
          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
        category: 'Spatial Sound Design',
      },
    ],
    equipment: [
      'SSL AWS 948 Console',
      'Moog One Analog Synthesizer',
      'Genelec 7.1.4 Dolby Atmos Array',
      'Neumann U87 Microphones',
    ],
  },
  {
    id: 'cult-4',
    type: 'cult',
    name: 'Vogue Atelier',
    slug: 'vogue-atelier',
    tagline:
      'High fashion styling, set design & creative direction collective.',
    bio: 'A squad of celebrity stylists, art directors, and set decorators crafting editorial shoots, runway shows, and commercial brand aesthetics across South Asia.',
    coverImage:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=srgb&fm=jpg&q=85&w=300',
    members: [
      {
        id: 'vm1',
        name: 'Natasha Kapoor',
        role: 'Fashion Director',
        avatar:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=srgb&fm=jpg&q=85&w=200',
        username: 'natashastyle',
      },
      {
        id: 'vm2',
        name: 'Vikram Joshi',
        role: 'Set Decorator',
        avatar:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=srgb&fm=jpg&q=85&w=200',
        username: 'vikramsets',
      },
    ],
    tags: ['Editorial Fashion', 'Runway Direction', 'Set Design', 'Lookbooks'],
    location: 'New Delhi / Mumbai',
    startingPrice: '₹2,90,000',
    startingPriceNum: 290000,
    turnaround: '3 - 5 Days',
    completedProjects: 54,
    rating: 4.97,
    reviewCount: 45,
    isVerified: true,
    availability: 'BUSY',
    portfolio: [
      {
        id: 'vp1',
        title: 'Silk & Shadows Editorial',
        image:
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
        category: 'Fashion Editorial',
      },
    ],
    equipment: [
      'Prop & Archive Wardrobe Vault',
      'ProFoto D2 Lighting Rigs',
      'Hasselblad H6D-100c System',
    ],
  },
];

export function getCultBySlug(slug: string): CultDiscoverItem | undefined {
  return MOCK_CULTS.find((c) => c.slug === slug);
}
