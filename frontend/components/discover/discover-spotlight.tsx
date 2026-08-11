'use client';

import { Sparkles } from 'lucide-react';
import {
  MOCK_CULTS,
  formatRate,
  getRateLabel,
  type FreelancerDiscoverItem,
} from './mock-data';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { SpotlightCard } from './spotlight-card';

interface DiscoverSpotlightProps {
  freelancers: FreelancerDiscoverItem[];
}

export function DiscoverSpotlight({ freelancers }: DiscoverSpotlightProps) {
  const featuredCult = MOCK_CULTS.find((c) => c.isFeatured) || MOCK_CULTS[0];
  const featuredFreelancer =
    freelancers.find((f) => f.isFeatured) || freelancers[0];

  if (!featuredFreelancer) {
    return null;
  }

  const freelancerImage =
    featuredFreelancer.portfolio[0]?.image ?? featuredFreelancer.coverImage;

  return (
    <section className="border-b border-border bg-background/50 px-4 sm:px-6 md:px-10 lg:px-12 py-8 md:py-12 w-full">
      <div className="w-full space-y-6">
        {/* Section Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-foreground font-bold">
            <Sparkles className="size-4 text-primary selection:text-background selection:bg-primary animate-pulse" />
            <span>SPOTLIGHT // HIGHLIGHTS OF THE MONTH</span>
          </div>

          <span className="font-mono text-[10px] uppercase text-muted-foreground hidden sm:inline-block">
            HANDPICKED COLLECTIVES & TALENT
          </span>
        </div>

        {/* Spotlight Bento Grid — both tiles render through the same SpotlightCard shell */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <SpotlightCard
            className="col-span-12 lg:col-span-8"
            href={`/discover/cult/${featuredCult.slug}`}
            image={featuredCult.coverImage}
            imageAlt={featuredCult.name}
            isAvailable={featuredCult.availability === 'AVAILABLE'}
            badgeLabel="FEATURED COLLECTIVE"
            title={featuredCult.name}
            location={featuredCult.location}
            quote={
              featuredCult.featuredQuote ||
              `${featuredCult.members.length} visionaries, one invoice held securely in escrow.`
            }
            metaRow={
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {featuredCult.members.map((m) => (
                    <Avatar
                      key={m.id}
                      className="size-8 border border-border shrink-0"
                    >
                      <AvatarImage src={m.avatar} alt={m.name} />
                      <AvatarFallback className="font-mono text-[9px]">
                        {m.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="font-mono text-xs font-semibold text-foreground">
                  {featuredCult.members.length} Members
                </span>
              </div>
            }
            tags={featuredCult.tags.slice(0, 3)}
            footerLabel="Starting at"
            price={featuredCult.startingPrice}
            rating={featuredCult.rating}
            reviewCount={featuredCult.reviewCount}
            ctaLabel="View Work"
            delay={0}
          />

          <SpotlightCard
            className="col-span-12 lg:col-span-4"
            href={`/discover/freelancer/${featuredFreelancer.username}`}
            image={freelancerImage}
            imageAlt={`${featuredFreelancer.name}'s work`}
            isAvailable={featuredFreelancer.availability === 'AVAILABLE'}
            badgeLabel="SOLO VISIONARY IN FOCUS"
            title={featuredFreelancer.name}
            location={featuredFreelancer.location}
            quote={featuredFreelancer.headline}
            metaRow={
              <div className="flex items-center gap-2">
                <Avatar className="size-8 border border-border shrink-0">
                  <AvatarImage
                    src={featuredFreelancer.avatarUrl}
                    alt={featuredFreelancer.name}
                  />
                  <AvatarFallback className="font-mono text-[9px]">
                    {featuredFreelancer.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-mono text-xs font-semibold text-foreground">
                  @{featuredFreelancer.username} &middot;{' '}
                  {featuredFreelancer.experienceYears} YRS &middot;{' '}
                  {featuredFreelancer.completedProjects} Projects
                </span>
              </div>
            }
            tags={featuredFreelancer.skills.slice(0, 3)}
            footerLabel={getRateLabel(featuredFreelancer.rateType)}
            price={formatRate(
              featuredFreelancer.rateType,
              featuredFreelancer.rateAmount
            )}
            rating={featuredFreelancer.rating}
            reviewCount={featuredFreelancer.reviewCount}
            ctaLabel="View Profile"
            delay={0.1}
          />
        </div>
      </div>
    </section>
  );
}
