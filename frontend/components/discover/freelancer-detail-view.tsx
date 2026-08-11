'use client';

import Link from 'next/link';
import { FreelancerDiscoverItem, formatRate, getRateLabel } from './mock-data';
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  Briefcase,
  Wrench,
  Sparkles,
  CheckCircle2,
  Lock,
  Share2,
  Award,
  MessageSquare,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

interface FreelancerDetailViewProps {
  freelancer: FreelancerDiscoverItem;
}

export function FreelancerDetailView({
  freelancer,
}: FreelancerDetailViewProps) {
  const isAvailable = freelancer.availability === 'AVAILABLE';

  return (
    <div className="min-h-screen bg-background text-foreground w-full">
      {/* Top Navigation & Breadcrumb Rail */}
      <div className="border-b border-border bg-card px-4 sm:px-6 md:px-10 lg:px-12 py-4 flex items-center justify-between font-mono text-xs uppercase tracking-wider">
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="size-4 text-primary selection:text-background selection:bg-primary group-hover:-translate-x-1 transition-transform" />
          <span>Back to Discover</span>
        </Link>

        <div className="flex items-center gap-2 text-muted-foreground">
          <span>/ DISCOVER</span>
          <span>/ FREELANCER</span>
          <span className="text-foreground font-bold">
            / @{freelancer.username}
          </span>
        </div>
      </div>

      {/* Hero Cover & Profile Header */}
      <section className="relative w-full border-b border-border bg-background">
        <div className="h-48 sm:h-56 md:h-64 w-full overflow-hidden relative">
          <img
            src={freelancer.coverImage}
            alt={freelancer.name}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
        </div>

        <div className="px-4 sm:px-6 md:px-10 lg:px-12 pb-8 -mt-16 relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Avatar & Headline Info */}
            <div className="flex items-end gap-5">
              <Avatar className="size-24 sm:size-32 border-4 border-background bg-card shrink-0">
                <AvatarImage src={freelancer.avatarUrl} alt={freelancer.name} />
                <AvatarFallback className="font-mono text-2xl font-bold">
                  {freelancer.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1 pb-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                    {freelancer.name}
                  </h1>

                  {freelancer.isVerified && (
                    <span className="status-tag status-tag--positive text-[10px]">
                      <ShieldCheck className="size-3.5 text-primary selection:text-background selection:bg-primary" />
                      VERIFIED CREATIVE
                    </span>
                  )}

                  <span
                    className={cn(
                      'status-tag text-[10px]',
                      isAvailable
                        ? 'status-tag--positive'
                        : 'status-tag--neutral'
                    )}
                  >
                    {isAvailable ? 'AVAILABLE NOW' : 'BUSY'}
                  </span>
                </div>

                <p className="font-mono text-sm text-muted-foreground">
                  @{freelancer.username} • 📍 {freelancer.location}
                </p>

                <p className="font-editorial text-base sm:text-lg font-medium text-foreground max-w-2xl pt-1">
                  {freelancer.headline}
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground shrink-0 pb-1">
              <div className="flex items-center gap-1 border border-border px-3 py-1.5 bg-card">
                <Star className="size-4 fill-primary text-primary selection:text-background selection:bg-primary" />
                <strong className="text-foreground font-bold">
                  {freelancer.rating !== null ? freelancer.rating : 'New'}
                </strong>{' '}
                {freelancer.rating !== null && `(${freelancer.reviewCount})`}
              </div>

              <div className="border border-border px-3 py-1.5 bg-card">
                <strong className="text-foreground font-bold">
                  {freelancer.experienceYears}+ YRS
                </strong>{' '}
                EXP
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <section className="px-4 sm:px-6 md:px-10 lg:px-12 py-10 w-full">
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left Column: Bio & Portfolio */}
          <div className="col-span-12 lg:col-span-8 space-y-10">
            {/* Bio Section */}
            <div className="space-y-4">
              <div className="space-y-1 border-b border-border pb-3">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <Sparkles className="size-3.5 text-primary selection:text-background selection:bg-primary" />
                  <span>About</span>
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Bio & Specialization
                </h2>
              </div>
              <p className="font-editorial text-lg sm:text-xl text-foreground leading-relaxed">
                {freelancer.bio}
              </p>
            </div>

            {/* Skills Tags */}
            <div className="space-y-3 pt-6 border-t border-border">
              <div className="space-y-1 border-b border-border pb-3">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <Award className="size-3.5 text-primary selection:text-background selection:bg-primary" />
                  <span>Expertise</span>
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Core Skills
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {freelancer.skills.map((skill) => (
                  <span
                    key={skill}
                    className="font-mono text-xs uppercase border border-border bg-card px-3 py-1.5 text-foreground font-semibold transition-colors hover:border-foreground hover:bg-muted"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Portfolio Works */}
            <div className="space-y-4 pt-6 border-t border-border">
              <div className="space-y-1 border-b border-border pb-3">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <Briefcase className="size-3.5 text-primary selection:text-background selection:bg-primary" />
                  <span>Selected work</span>
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Portfolio Works
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {freelancer.portfolio.map((p) => (
                  <div
                    key={p.id}
                    className="group relative overflow-hidden border border-border bg-card h-64 transition-all hover:border-foreground"
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-[1.06]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-2 text-white">
                      <div className="space-y-1 min-w-0">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-white/70">
                          {p.category}
                        </span>
                        <h4 className="font-editorial text-lg font-bold leading-tight line-clamp-2">
                          {p.title}
                        </h4>
                      </div>
                      <span className="shrink-0 border border-white/70 font-mono text-[10px] uppercase px-2 py-1 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                        View →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Production Tools & Hardware */}
            <div className="space-y-4 pt-6 border-t border-border">
              <div className="space-y-1 border-b border-border pb-3">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <Wrench className="size-3.5 text-primary selection:text-background selection:bg-primary" />
                  <span>Capability</span>
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Hardware & Software Stack
                </h2>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {freelancer.tools.map((tool) => (
                  <span
                    key={tool}
                    className="font-mono text-xs uppercase border border-border bg-card px-3.5 py-2 text-foreground font-semibold flex items-center gap-2 transition-colors hover:border-foreground hover:bg-muted"
                  >
                    <CheckCircle2 className="size-4 text-primary selection:text-background selection:bg-primary" />
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Hire & Rate Card */}
          <div className="col-span-12 lg:col-span-4 sticky top-20 space-y-6">
            <div className="border border-border bg-card p-6 space-y-7">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase text-muted-foreground border-b border-border pb-3">
                <span>Rates & Booking</span>
                <span className="status-tag status-tag--positive text-[9px]">
                  Direct hire
                </span>
              </div>

              <div className="space-y-2">
                <span className="font-mono text-[10px] text-muted-foreground uppercase block">
                  {getRateLabel(freelancer.rateType)}
                </span>
                <div className="font-display text-5xl text-foreground leading-none">
                  {formatRate(freelancer.rateType, freelancer.rateAmount)}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-px bg-border border border-border">
                <div className="bg-card p-3 space-y-1.5 text-center">
                  <div className="font-mono text-sm font-bold text-foreground">
                    {freelancer.experienceYears}+
                  </div>
                  <div className="font-mono text-[9px] uppercase text-muted-foreground">
                    Years exp.
                  </div>
                </div>

                <div className="bg-card p-3 space-y-1.5 text-center">
                  <div className="font-mono text-sm font-bold text-foreground">
                    {freelancer.completedProjects}
                  </div>
                  <div className="font-mono text-[9px] uppercase text-muted-foreground">
                    Projects
                  </div>
                </div>

                <div className="bg-card p-3 space-y-1.5 text-center">
                  <div className="font-mono text-sm font-bold text-foreground">
                    {freelancer.rating !== null ? freelancer.rating : 'New'}
                  </div>
                  <div className="font-mono text-[9px] uppercase text-muted-foreground">
                    Rating
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <Button
                  variant="default"
                  size="lg"
                  className="w-full font-mono text-xs uppercase tracking-wider h-12"
                >
                  <MessageSquare className="size-4 mr-2" />
                  <span>Hire / Send Brief</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                >
                  <Share2 className="size-3.5 mr-2" />
                  <span>Share Profile</span>
                </Button>
              </div>
            </div>

            {/* Escrow Banner */}
            <div className="border border-border border-t-4 border-t-primary bg-card p-5 flex items-start gap-4">
              <Lock className="size-6 text-primary selection:text-background selection:bg-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-foreground">
                  Escrow Safeguard
                </h4>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">
                  Hire with confidence. All payments are locked in escrow and
                  released on final project approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
