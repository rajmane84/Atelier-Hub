export enum Degree {
  HIGH_SCHOOL = 'HIGH_SCHOOL',
  DIPLOMA = 'DIPLOMA',
  BSC = 'BSC',
  BCA = 'BCA',
  BCOM = 'BCOM',
  BA = 'BA',
  BTECH = 'BTECH',
  BE = 'BE',
  BPHARM = 'BPHARM',
  LLB = 'LLB',
  MBBS = 'MBBS',
  MSC = 'MSC',
  MCA = 'MCA',
  MCOM = 'MCOM',
  MA = 'MA',
  MTECH = 'MTECH',
  ME = 'ME',
  MBA = 'MBA',
  MPHARM = 'MPHARM',
  LLM = 'LLM',
  MD = 'MD',
  PHD = 'PHD',
  OTHER = 'OTHER',
}

export enum SkillExpertiseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  EXPERT = 'EXPERT',
}

// Alias for backward compatibility
export const SkillLevel = SkillExpertiseLevel;

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  FREELANCE = 'FREELANCE',
  SELF_EMPLOYED = 'SELF_EMPLOYED',
}

export enum UserRole {
  CREATIVE = 'CREATIVE',
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
}

export enum JoinAs {
  FREELANCER = 'FREELANCER',
  COLLECTIVE = 'COLLECTIVE',
  CLIENT = 'CLIENT',
}

export enum AvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
}

// Mirrors backend RateType enum.
export enum RateType {
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  PROJECT = 'PROJECT',
  NEGOTIABLE = 'NEGOTIABLE',
}

export enum ListingStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  FILLED = 'FILLED',
  ARCHIVED = 'ARCHIVED',
}

export enum LocationType {
  REMOTE = 'REMOTE',
  ON_SITE = 'ON_SITE',
  HYBRID = 'HYBRID',
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  INR = 'INR',
  CAD = 'CAD',
  AUD = 'AUD',
  JPY = 'JPY',
  CNY = 'CNY',
  CHF = 'CHF',
  SEK = 'SEK',
  NOK = 'NOK',
  DKK = 'DKK',
  SGD = 'SGD',
  HKD = 'HKD',
  NZD = 'NZD',
  MXN = 'MXN',
  BRL = 'BRL',
  KRW = 'KRW',
  TRY = 'TRY',
  ZAR = 'ZAR',
}

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  [ListingStatus.DRAFT]: 'Draft',
  [ListingStatus.ACTIVE]: 'Active',
  [ListingStatus.CLOSED]: 'Closed',
  [ListingStatus.FILLED]: 'Filled',
  [ListingStatus.ARCHIVED]: 'Archived',
};

export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  [LocationType.REMOTE]: 'Remote',
  [LocationType.ON_SITE]: 'On-site',
  [LocationType.HYBRID]: 'Hybrid',
};

export const RATE_TYPE_LABELS: Record<RateType, string> = {
  [RateType.HOURLY]: 'Hourly',
  [RateType.DAILY]: 'Daily',
  [RateType.PROJECT]: 'Project',
  [RateType.NEGOTIABLE]: 'Negotiable',
};

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  [EmploymentType.FULL_TIME]: 'Full-time',
  [EmploymentType.PART_TIME]: 'Part-time',
  [EmploymentType.FREELANCE]: 'Freelance',
  [EmploymentType.SELF_EMPLOYED]: 'Self-employed',
};

export const CURRENCY_LABELS: Record<Currency, string> = {
  [Currency.USD]: 'US Dollar',
  [Currency.EUR]: 'Euro',
  [Currency.GBP]: 'British Pound',
  [Currency.INR]: 'Indian Rupee',
  [Currency.CAD]: 'Canadian Dollar',
  [Currency.AUD]: 'Australian Dollar',
  [Currency.JPY]: 'Japanese Yen',
  [Currency.CNY]: 'Chinese Yuan',
  [Currency.CHF]: 'Swiss Franc',
  [Currency.SEK]: 'Swedish Krona',
  [Currency.NOK]: 'Norwegian Krone',
  [Currency.DKK]: 'Danish Krone',
  [Currency.SGD]: 'Singapore Dollar',
  [Currency.HKD]: 'Hong Kong Dollar',
  [Currency.NZD]: 'New Zealand Dollar',
  [Currency.MXN]: 'Mexican Peso',
  [Currency.BRL]: 'Brazilian Real',
  [Currency.KRW]: 'South Korean Won',
  [Currency.TRY]: 'Turkish Lira',
  [Currency.ZAR]: 'South African Rand',
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
  [Currency.GBP]: '£',
  [Currency.INR]: '₹',
  [Currency.CAD]: 'C$',
  [Currency.AUD]: 'A$',
  [Currency.JPY]: '¥',
  [Currency.CNY]: '¥',
  [Currency.CHF]: 'Fr',
  [Currency.SEK]: 'kr',
  [Currency.NOK]: 'kr',
  [Currency.DKK]: 'kr',
  [Currency.SGD]: 'S$',
  [Currency.HKD]: 'HK$',
  [Currency.NZD]: 'NZ$',
  [Currency.MXN]: '$',
  [Currency.BRL]: 'R$',
  [Currency.KRW]: '₩',
  [Currency.TRY]: '₺',
  [Currency.ZAR]: 'R',
};

export enum ClientType {
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY = 'COMPANY',
}

export enum CompanySize {
  SOLO = 'SOLO',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  ENTERPRISE = 'ENTERPRISE',
}

export enum Industry {
  ADVERTISING_MARKETING = 'ADVERTISING_MARKETING',
  FASHION_APPAREL = 'FASHION_APPAREL',
  FILM_TV_ENTERTAINMENT = 'FILM_TV_ENTERTAINMENT',
  MUSIC_AUDIO = 'MUSIC_AUDIO',
  GAMING = 'GAMING',
  PUBLISHING_MEDIA = 'PUBLISHING_MEDIA',
  PHOTOGRAPHY_STUDIO = 'PHOTOGRAPHY_STUDIO',
  TECHNOLOGY_SOFTWARE = 'TECHNOLOGY_SOFTWARE',
  ECOMMERCE_RETAIL = 'ECOMMERCE_RETAIL',
  REAL_ESTATE = 'REAL_ESTATE',
  HOSPITALITY_TRAVEL = 'HOSPITALITY_TRAVEL',
  FOOD_BEVERAGE = 'FOOD_BEVERAGE',
  BEAUTY_COSMETICS = 'BEAUTY_COSMETICS',
  HEALTH_WELLNESS = 'HEALTH_WELLNESS',
  SPORTS_FITNESS = 'SPORTS_FITNESS',
  EDUCATION = 'EDUCATION',
  FINANCE_BANKING = 'FINANCE_BANKING',
  NONPROFIT_NGO = 'NONPROFIT_NGO',
  ARCHITECTURE_INTERIOR_DESIGN = 'ARCHITECTURE_INTERIOR_DESIGN',
  AUTOMOTIVE = 'AUTOMOTIVE',
  EVENTS_WEDDINGS = 'EVENTS_WEDDINGS',
  OTHER = 'OTHER',
}

export const INDUSTRY_LABELS: Record<Industry, string> = {
  [Industry.ADVERTISING_MARKETING]: 'Advertising & Marketing',
  [Industry.FASHION_APPAREL]: 'Fashion & Apparel',
  [Industry.FILM_TV_ENTERTAINMENT]: 'Film, TV & Entertainment',
  [Industry.MUSIC_AUDIO]: 'Music & Audio',
  [Industry.GAMING]: 'Gaming',
  [Industry.PUBLISHING_MEDIA]: 'Publishing & Media',
  [Industry.PHOTOGRAPHY_STUDIO]: 'Photography & Studio',
  [Industry.TECHNOLOGY_SOFTWARE]: 'Technology & Software',
  [Industry.ECOMMERCE_RETAIL]: 'E-commerce & Retail',
  [Industry.REAL_ESTATE]: 'Real Estate',
  [Industry.HOSPITALITY_TRAVEL]: 'Hospitality & Travel',
  [Industry.FOOD_BEVERAGE]: 'Food & Beverage',
  [Industry.BEAUTY_COSMETICS]: 'Beauty & Cosmetics',
  [Industry.HEALTH_WELLNESS]: 'Health & Wellness',
  [Industry.SPORTS_FITNESS]: 'Sports & Fitness',
  [Industry.EDUCATION]: 'Education',
  [Industry.FINANCE_BANKING]: 'Finance & Banking',
  [Industry.NONPROFIT_NGO]: 'Nonprofit & NGO',
  [Industry.ARCHITECTURE_INTERIOR_DESIGN]: 'Architecture & Interior Design',
  [Industry.AUTOMOTIVE]: 'Automotive',
  [Industry.EVENTS_WEDDINGS]: 'Events & Weddings',
  [Industry.OTHER]: 'Other',
};

export const COMPANY_SIZE_LABELS: Record<CompanySize, string> = {
  [CompanySize.SOLO]: 'Just me',
  [CompanySize.SMALL]: '2–10 employees',
  [CompanySize.MEDIUM]: '11–50 employees',
  [CompanySize.LARGE]: '51–200 employees',
  [CompanySize.ENTERPRISE]: '201+ employees',
};

export interface User {
  id: string;
  email: string;
  emailVerified?: boolean;
  name: string;
  role?: string;
  username?: string;
  image?: string;
  creativeProfile?: {
    onboardingCompleted?: boolean;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
