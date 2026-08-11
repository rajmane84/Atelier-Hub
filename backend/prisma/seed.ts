import { auth } from '../src/auth';
import { prisma } from '../src/util/prisma';
import {
  AvailabilityStatus,
  ClientType,
  CompanySize,
  CultMemberRole,
  CultMembershipStatus,
  Industry,
  RateType,
} from '@prisma/client';

const SEED_PASSWORD = 'Password123!';

// ---------------------------- Seed data -----------------------------------

interface FreelancerSeed {
  email: string;
  name: string;
  username: string;
  headline: string;
  bio: string;
  location: string;
  avatarUrl: string;
  coverImage: string;
  skills: string[];
  tools: string[];
  rateType: RateType;
  rateAmount: number | null;
  experienceYears: number;
  isVerified: boolean;
  isFeatured: boolean;
  completedProjects: number;
  portfolio: { title: string; coverImageUrl: string; category: string }[];
}

const FREELANCERS: FreelancerSeed[] = [
  {
    email: 'aarav.sharma@seed.cre8ivecult.dev',
    name: 'Aarav Sharma',
    username: 'aarav.frames',
    headline: 'Senior Cinematographer & Arri/RED Specialist',
    bio: '10+ years directing photography for music videos, luxury brand ads, and narrative feature films. Master of low-light anamorphic framing and high-speed robotic camera rigs.',
    location: 'Mumbai, India',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=srgb&fm=jpg&q=85&w=300',
    coverImage:
      'https://images.unsplash.com/photo-1611784728558-6c7d9b409cdf?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
    skills: [
      'ARRI Alexa',
      'Anamorphic Lenses',
      'Color Grading',
      'Lighting Direction',
    ],
    tools: [
      'ARRI Alexa Mini LF',
      'Kowa Anamorphic Lenses',
      'DaVinci Resolve Studio',
      'Aputure 600d Pro',
    ],
    rateType: RateType.DAILY,
    rateAmount: 45000,
    experienceYears: 10,
    isVerified: true,
    isFeatured: true,
    completedProjects: 112,
    portfolio: [
      {
        title: 'Neon Nights Music Video',
        coverImageUrl:
          'https://images.unsplash.com/photo-1611784728558-6c7d9b409cdf?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
        category: 'Cinematography',
      },
      {
        title: 'Maharaja Heritage Commercial',
        coverImageUrl:
          'https://images.unsplash.com/photo-1587090564077-c7b8f2f1249e?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
        category: 'Commercial AD',
      },
    ],
  },
  {
    email: 'maya.lin@seed.cre8ivecult.dev',
    name: 'Maya Lin',
    username: 'mayalin.3d',
    headline: '3D Generalist & Real-Time Unreal Engine Artist',
    bio: 'Creating photorealistic product renders, procedural environment designs, and high-octane 3D visual art for tech disruptors and web3 experiences.',
    location: 'Bengaluru, India',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=srgb&fm=jpg&q=85&w=300',
    coverImage:
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
    skills: [
      'Unreal Engine 5',
      'Blender 3D',
      'Substance Painter',
      'Octane Render',
    ],
    tools: ['Blender 4.2', 'Unreal Engine 5.4', 'ZBrush', 'Substance 3D Suite'],
    rateType: RateType.PROJECT,
    rateAmount: 250000,
    experienceYears: 6,
    isVerified: true,
    isFeatured: false,
    completedProjects: 78,
    portfolio: [
      {
        title: 'Futuristic EV Concept',
        coverImageUrl:
          'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
        category: '3D Renders',
      },
    ],
  },
  {
    email: 'kabir.varma@seed.cre8ivecult.dev',
    name: 'Kabir Varma',
    username: 'kabir.sound',
    headline: 'Sound Designer & Modular Synthesist',
    bio: 'Crafting immersive soundscapes, foley design, and punchy audio post-production for AAA game trailers, short films, and high-fashion commercials.',
    location: 'Goa, India',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=srgb&fm=jpg&q=85&w=300',
    coverImage:
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
    skills: ['Modular Synths', 'Pro Tools HD', 'Game Audio (Wwise)'],
    tools: [
      'Eurorack Modular Synth',
      'Pro Tools Ultimate',
      'Universal Audio Apollo x8p',
    ],
    rateType: RateType.HOURLY,
    rateAmount: 2500,
    experienceYears: 8,
    isVerified: true,
    isFeatured: false,
    completedProjects: 64,
    portfolio: [
      {
        title: 'Cyberpunk Game Teaser',
        coverImageUrl:
          'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
        category: 'Sound Design',
      },
    ],
  },
  {
    email: 'zoya.chen@seed.cre8ivecult.dev',
    name: 'Zoya Chen',
    username: 'zoyastyles',
    headline: 'Editorial Costume Designer & Fashion Curator',
    bio: 'Specializing in avant-garde costume curation, street-style editorial spreads, and celebrity red carpet styling across Mumbai & London.',
    location: 'Mumbai / London',
    avatarUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=srgb&fm=jpg&q=85&w=300',
    coverImage:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
    skills: [
      'Costume Design',
      'Creative Direction',
      'Archive Pulls',
      'Lookbook Curation',
    ],
    tools: ['Custom Tailoring Atelier', 'Archive Designer Wardrobe'],
    rateType: RateType.DAILY,
    rateAmount: 35000,
    experienceYears: 7,
    isVerified: true,
    isFeatured: false,
    completedProjects: 89,
    portfolio: [
      {
        title: 'Tokyo Streetwear Lookbook',
        coverImageUrl:
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
        category: 'Fashion Curation',
      },
    ],
  },
  {
    email: 'priya.nair@seed.cre8ivecult.dev',
    name: 'Priya Nair',
    username: 'priyadrones',
    headline: 'DGCA Certified FPV Drone Pilot & Aerial DP',
    bio: 'High-speed cinematic FPV drone operator for action sequences, landscape car commercials, and indoor fly-throughs. Experienced in extreme environments.',
    location: 'Kochi, India',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=srgb&fm=jpg&q=85&w=300',
    coverImage:
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
    skills: ['Custom FPV Rigs', 'RED Komodo Aerial', 'High-Speed Tracking'],
    tools: ['Custom 7" FPV Drone', 'RED Komodo 6K', 'DJI Inspire 3'],
    // Deliberately NEGOTIABLE + no reviews below — exercises the "New" /
    // "Negotiable" fallback UI paths on the discover page.
    rateType: RateType.NEGOTIABLE,
    rateAmount: null,
    experienceYears: 5,
    isVerified: true,
    isFeatured: false,
    completedProjects: 55,
    portfolio: [
      {
        title: 'Himalayan Ridge Drift',
        coverImageUrl:
          'https://images.unsplash.com/photo-1508614589041-895b88991e3e?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
        category: 'FPV Cinema',
      },
    ],
  },
];

interface CultSeed {
  name: string;
  slug: string;
  tagline: string;
  bio: string;
  avatarUrl: string;
  ownerEmail: string;
  memberEmail: string;
}

// Reuses two of the freelancers above as members — a freelancer can belong
// to a cult and still show up individually on /discover/freelancer.
const CULTS: CultSeed[] = [
  {
    name: 'Sangeet Cult',
    slug: 'sangeet-cult',
    tagline: 'High-concept film, fashion & wedding narrative collective.',
    bio: 'A unified collective combining cinematic documentary film and editorial fashion styling into single-escrow productions.',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=srgb&fm=jpg&q=85&w=300',
    ownerEmail: 'aarav.sharma@seed.cre8ivecult.dev',
    memberEmail: 'zoya.chen@seed.cre8ivecult.dev',
  },
  {
    name: 'HyperNeon 3D',
    slug: 'hyperneon-3d',
    tagline: 'Cyberpunk CGI, spatial design & immersive brand experiences.',
    bio: 'Boutique 3D animation collective pushing real-time Unreal Engine 5 visual graphics and CGI product reveals.',
    avatarUrl:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=srgb&fm=jpg&q=85&w=300',
    ownerEmail: 'maya.lin@seed.cre8ivecult.dev',
    memberEmail: 'kabir.varma@seed.cre8ivecult.dev',
  },
];

interface ClientSeed {
  email: string;
  name: string;
  clientType: ClientType;
  companyName?: string;
  industry?: Industry;
  companySize?: CompanySize;
  bio: string;
  location: string;
}

const CLIENTS: ClientSeed[] = [
  {
    email: 'meera.kapoor@seed.cre8ivecult.dev',
    name: 'Meera Kapoor',
    clientType: ClientType.INDIVIDUAL,
    bio: 'Independent filmmaker commissioning short-form brand documentaries.',
    location: 'Mumbai, India',
  },
  {
    email: 'contact@studionine.seed.cre8ivecult.dev',
    name: 'Studio Nine',
    clientType: ClientType.COMPANY,
    companyName: 'Studio Nine',
    industry: Industry.ADVERTISING_MARKETING,
    companySize: CompanySize.SMALL,
    bio: 'Boutique ad agency booking creatives for campaign shoots.',
    location: 'Bengaluru, India',
  },
  {
    email: 'hello@rohanstudios.seed.cre8ivecult.dev',
    name: 'Rohan Studios',
    clientType: ClientType.COMPANY,
    companyName: 'Rohan Studios',
    industry: Industry.FILM_TV_ENTERTAINMENT,
    companySize: CompanySize.MEDIUM,
    bio: 'Production house booking crews for feature and OTT projects.',
    location: 'Mumbai, India',
  },
];

// [clientEmail, freelancerUsername, rating, comment]
const REVIEWS: [string, string, number, string][] = [
  [
    'meera.kapoor@seed.cre8ivecult.dev',
    'aarav.frames',
    5,
    'Exceptional eye for light — delivered exactly the mood we pitched.',
  ],
  [
    'contact@studionine.seed.cre8ivecult.dev',
    'mayalin.3d',
    5,
    'Renders were client-ready on the first pass. Will rebook.',
  ],
  [
    'hello@rohanstudios.seed.cre8ivecult.dev',
    'zoyastyles',
    5,
    'Sourced pieces we could never have found ourselves.',
  ],
  [
    'meera.kapoor@seed.cre8ivecult.dev',
    'kabir.sound',
    4,
    'Great soundscape, took a couple of revisions to nail the mix.',
  ],
];

// ---------------------------- Helpers -----------------------------------

async function getOrCreateAuthUser(email: string, name: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;

  const result = await auth.api.signUpEmail({
    body: { email, password: SEED_PASSWORD, name },
  });

  const user = await prisma.user.findUnique({
    where: { id: result.user.id },
  });
  if (!user) throw new Error(`Failed to create user for ${email}`);
  return user;
}

async function getOrCreateSkill(name: string) {
  const existing = await prisma.skill.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } },
  });
  if (existing) return existing;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return prisma.skill.create({ data: { name, slug } });
}

// ---------------------------- Seed steps -----------------------------------

async function seedFreelancers() {
  const profileIds = new Map<string, string>(); // username -> creativeProfileId

  for (const f of FREELANCERS) {
    const user = await getOrCreateAuthUser(f.email, f.name);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        username: f.username,
        role: 'CREATIVE',
        emailVerified: true,
        image: f.avatarUrl,
      },
    });

    const profile = await prisma.creativeProfile.upsert({
      where: { userId: user.id },
      update: {
        headline: f.headline,
        bio: f.bio,
        location: f.location,
        coverImage: f.coverImage,
        rateType: f.rateType,
        rateAmount: f.rateAmount,
        experienceYears: f.experienceYears,
        tools: f.tools,
        isVerified: f.isVerified,
        isFeatured: f.isFeatured,
        completedProjects: f.completedProjects,
        availability: AvailabilityStatus.AVAILABLE,
        onboardingCompleted: true,
      },
      create: {
        userId: user.id,
        headline: f.headline,
        bio: f.bio,
        location: f.location,
        coverImage: f.coverImage,
        rateType: f.rateType,
        rateAmount: f.rateAmount,
        experienceYears: f.experienceYears,
        tools: f.tools,
        isVerified: f.isVerified,
        isFeatured: f.isFeatured,
        completedProjects: f.completedProjects,
        availability: AvailabilityStatus.AVAILABLE,
        onboardingCompleted: true,
      },
    });

    profileIds.set(f.username, profile.id);

    // Replace skills/portfolio each run rather than accumulate duplicates.
    await prisma.creativeSkill.deleteMany({
      where: { creativeProfileId: profile.id },
    });
    for (const skillName of f.skills) {
      const skill = await getOrCreateSkill(skillName);
      await prisma.creativeSkill.create({
        data: {
          creativeProfileId: profile.id,
          skillId: skill.id,
          name: skill.name,
          level: 'EXPERT',
        },
      });
    }

    await prisma.portfolioItem.deleteMany({
      where: { ownerCreativeProfileId: profile.id },
    });
    for (const item of f.portfolio) {
      await prisma.portfolioItem.create({
        data: {
          title: item.title,
          coverImageUrl: item.coverImageUrl,
          category: item.category,
          ownerType: 'FREELANCER',
          ownerCreativeProfileId: profile.id,
        },
      });
    }

    console.log(`  freelancer: ${f.name} (@${f.username})`);
  }

  return profileIds;
}

async function seedCults(profileIds: Map<string, string>) {
  for (const c of CULTS) {
    const ownerFreelancer = FREELANCERS.find((f) => f.email === c.ownerEmail)!;
    const ownerUser = await prisma.user.findUniqueOrThrow({
      where: { email: c.ownerEmail },
    });
    const ownerProfileId = profileIds.get(ownerFreelancer.username)!;
    const memberFreelancer = FREELANCERS.find(
      (f) => f.email === c.memberEmail
    )!;
    const memberProfileId = profileIds.get(memberFreelancer.username)!;

    const cult = await prisma.cult.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        tagline: c.tagline,
        bio: c.bio,
        avatarUrl: c.avatarUrl,
      },
      create: {
        name: c.name,
        slug: c.slug,
        tagline: c.tagline,
        bio: c.bio,
        avatarUrl: c.avatarUrl,
        createdByUserId: ownerUser.id,
      },
    });

    await prisma.cultMembership.upsert({
      where: {
        cultId_creativeProfileId: {
          cultId: cult.id,
          creativeProfileId: ownerProfileId,
        },
      },
      update: {
        role: CultMemberRole.OWNER,
        status: CultMembershipStatus.ACTIVE,
      },
      create: {
        cultId: cult.id,
        creativeProfileId: ownerProfileId,
        role: CultMemberRole.OWNER,
        status: CultMembershipStatus.ACTIVE,
      },
    });

    await prisma.cultMembership.upsert({
      where: {
        cultId_creativeProfileId: {
          cultId: cult.id,
          creativeProfileId: memberProfileId,
        },
      },
      update: {
        role: CultMemberRole.MEMBER,
        status: CultMembershipStatus.ACTIVE,
      },
      create: {
        cultId: cult.id,
        creativeProfileId: memberProfileId,
        role: CultMemberRole.MEMBER,
        status: CultMembershipStatus.ACTIVE,
      },
    });

    console.log(`  cult: ${c.name} (owner: ${ownerFreelancer.name})`);
  }
}

async function seedClients() {
  for (const c of CLIENTS) {
    const user = await getOrCreateAuthUser(c.email, c.name);

    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'CLIENT', emailVerified: true },
    });

    await prisma.clientProfile.upsert({
      where: { userId: user.id },
      update: {
        clientType: c.clientType,
        companyName: c.companyName,
        industry: c.industry,
        companySize: c.companySize,
        bio: c.bio,
        location: c.location,
        onboardingCompleted: true,
      },
      create: {
        userId: user.id,
        clientType: c.clientType,
        companyName: c.companyName,
        industry: c.industry,
        companySize: c.companySize,
        bio: c.bio,
        location: c.location,
        onboardingCompleted: true,
      },
    });

    console.log(`  client: ${c.name}`);
  }
}

async function seedReviews(profileIds: Map<string, string>) {
  for (const [clientEmail, username, rating, comment] of REVIEWS) {
    const reviewer = await prisma.user.findUniqueOrThrow({
      where: { email: clientEmail },
    });
    const creativeProfileId = profileIds.get(username)!;

    await prisma.review.upsert({
      where: {
        reviewerUserId_creativeProfileId: {
          reviewerUserId: reviewer.id,
          creativeProfileId,
        },
      },
      update: { rating, comment },
      create: {
        reviewerUserId: reviewer.id,
        creativeProfileId,
        rating,
        comment,
      },
    });
  }
  console.log(`  reviews: ${REVIEWS.length}`);
}

async function main() {
  console.log('Seeding freelancers...');
  const profileIds = await seedFreelancers();

  console.log('Seeding cults...');
  await seedCults(profileIds);

  console.log('Seeding clients...');
  await seedClients();

  console.log('Seeding reviews...');
  await seedReviews(profileIds);

  console.log('\nDone. All seed users share the password:', SEED_PASSWORD);
  console.log('Freelancers:', FREELANCERS.map((f) => f.email).join(', '));
  console.log('Clients:', CLIENTS.map((c) => c.email).join(', '));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
