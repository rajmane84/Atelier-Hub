import {
  LayoutDashboard,
  Briefcase,
  Users,
  Heart,
  MessageSquare,
  Settings,
  User,
  FileText,
  Calendar,
} from 'lucide-react';

export const ROLE_ROUTES: Record<string, string> = {
  CLIENT: '/dashboard/client',
  CREATIVE: '/dashboard/creative',
  ADMIN: '/dashboard/admin',
};

export const DASHBOARD_NAVIGATION = {
  CREATIVE: [
    {
      href: '/dashboard/creative',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/dashboard/creative/profile',
      label: 'Profile',
      icon: User,
    },
    {
      href: '/dashboard/creative/projects',
      label: 'Projects',
      icon: Briefcase,
    },
    {
      href: '/dashboard/creative/cult',
      label: 'Cult',
      icon: Users,
    },
    {
      href: '/dashboard/creative/proposals',
      label: 'Proposals',
      icon: FileText,
    },
    {
      href: '/dashboard/creative/calendar',
      label: 'Calendar',
      icon: Calendar,
    },
  ],

  CLIENT: [
    {
      href: '/dashboard/client',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/dashboard/client/profile',
      label: 'Profile',
      icon: User,
    },
    {
      href: '/dashboard/client/listings',
      label: 'Listings',
      icon: Briefcase,
    },
    {
      href: '/dashboard/client/applications',
      label: 'Applications',
      icon: Users,
    },
    {
      href: '/dashboard/client/saved',
      label: 'Saved Items',
      icon: Heart,
    },
    {
      href: '/dashboard/client/messages',
      label: 'Messages',
      icon: MessageSquare,
    },
    // {
    //   href: '/dashboard/client/invoices',
    //   label: 'Invoices',
    //   icon: Receipt,
    // },
  ],

  ADMIN: [
    {
      href: '/dashboard/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/dashboard/admin/profile',
      label: 'Profile',
      icon: User,
    },
    {
      href: '/dashboard/admin/users',
      label: 'Users',
      icon: Users,
    },
    {
      href: '/dashboard/admin/projects',
      label: 'Projects',
      icon: Briefcase,
    },
    {
      href: '/dashboard/admin/settings',
      label: 'Settings',
      icon: Settings,
    },
  ],
} as const;

export const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
export const MAX_COVER_IMAGE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ALLOWED_AVATAR_TYPES = ALLOWED_IMAGE_TYPES;

export const COVER_IMAGE_ASPECT_RATIO = 5;
