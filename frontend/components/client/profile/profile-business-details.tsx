'use client';

import { useState } from 'react';
import {
  Edit2,
  Loader2,
  Building2,
  Globe,
  Phone,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { PhoneVerificationModal } from './phone-verification-modal';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ClientType,
  Industry,
  CompanySize,
  INDUSTRY_LABELS,
  COMPANY_SIZE_LABELS,
} from '@/types';
import { useUpdateClientProfile } from '@/hooks/client/profile';
import { handleApiError } from '@/lib/handle-error';
import { businessDetailsSchema } from '@/validations/client/profile';

interface ProfileBusinessDetailsProps {
  clientType: ClientType;
  companyName?: string | null;
  industry?: Industry | null;
  companySize?: CompanySize | null;
  foundedYear?: string | null;
  website?: string | null;
  phoneNumber?: string | null;
  phoneVerified?: boolean;
}

export default function ProfileBusinessDetails({
  clientType,
  companyName,
  industry,
  companySize,
  foundedYear,
  website,
  phoneNumber,
  phoneVerified,
}: ProfileBusinessDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [localClientType, setLocalClientType] = useState(clientType);
  const [localCompanyName, setLocalCompanyName] = useState(companyName || '');
  const [localIndustry, setLocalIndustry] = useState<Industry | undefined>(
    industry ?? undefined
  );
  const [localCompanySize, setLocalCompanySize] = useState<
    CompanySize | undefined
  >(companySize ?? undefined);
  const [localFoundedYear, setLocalFoundedYear] = useState(foundedYear || '');
  const [localWebsite, setLocalWebsite] = useState(website || '');
  const [localPhoneNumber, setLocalPhoneNumber] = useState(phoneNumber || '');
  const { updateProfileMutation } = useUpdateClientProfile();

  const isCompany = localClientType === ClientType.COMPANY;

  const handleEdit = () => {
    setLocalClientType(clientType);
    setLocalCompanyName(companyName || '');
    setLocalIndustry(industry ?? undefined);
    setLocalCompanySize(companySize ?? undefined);
    setLocalFoundedYear(foundedYear || '');
    setLocalWebsite(website || '');
    setLocalPhoneNumber(phoneNumber || '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    const validationResult = businessDetailsSchema.safeParse({
      clientType: localClientType,
      companyName: localCompanyName || undefined,
      industry: localIndustry,
      companySize: localCompanySize,
      foundedYear: localFoundedYear || undefined,
      website: localWebsite || undefined,
      phoneNumber: phoneVerified
        ? phoneNumber || undefined
        : localPhoneNumber || undefined,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      const firstError = Object.values(errors).find((e) => e && e.length > 0);
      if (firstError) {
        toast.error(firstError[0]);
      }
      return;
    }

    updateProfileMutation.mutate(
      {
        clientType: localClientType,
        companyName: isCompany ? localCompanyName || undefined : undefined,
        industry: isCompany ? localIndustry : undefined,
        companySize: isCompany ? localCompanySize : undefined,
        foundedYear: isCompany ? localFoundedYear || undefined : undefined,
        website: localWebsite || undefined,
        phoneNumber: phoneVerified ? undefined : localPhoneNumber || undefined,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success('Business details updated successfully');
        },
        onError: (error) => {
          handleApiError(error, 'Failed to update business details');
        },
      }
    );
  };

  const details = [
    {
      icon: Building2,
      label: 'Type',
      value: isCompany ? 'Company' : 'Individual',
    },
    isCompany && companyName
      ? { icon: Building2, label: 'Company', value: companyName }
      : null,
    isCompany && industry
      ? { icon: Building2, label: 'Industry', value: INDUSTRY_LABELS[industry] }
      : null,
    isCompany && companySize
      ? {
          icon: Building2,
          label: 'Company size',
          value: COMPANY_SIZE_LABELS[companySize],
        }
      : null,
    isCompany && foundedYear
      ? { icon: Calendar, label: 'Founded', value: foundedYear }
      : null,
    website ? { icon: Globe, label: 'Website', value: website } : null,
    phoneNumber ? { icon: Phone, label: 'Phone', value: phoneNumber } : null,
  ].filter(Boolean) as {
    icon: typeof Building2;
    label: string;
    value: string;
  }[];

  return (
    <div className="border-t border-border pt-12 md:pt-16">
      <div className="grid grid-cols-12 gap-8 md:gap-12">
        <div className="col-span-12 md:col-span-4">
          <div className="flex items-center justify-between gap-4 sticky top-8">
            <div className="font-mono text-xs uppercase tracking-widest opacity-60">
              / Business Details
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={isEditing ? handleCancel : handleEdit}
              className="h-7 gap-1.5 -mr-2 transition-all duration-200 ease-out hover:bg-muted/80 motion-reduce:transition-none"
            >
              {isEditing ? (
                <>Done</>
              ) : (
                <>
                  <Edit2 className="size-3" />
                  Edit
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="col-span-12 md:col-span-8">
          {isEditing ? (
            <div
              className={cn(
                'space-y-6 p-6 rounded-none border border-border bg-background',
                'animate-in fade-in slide-in-from-top-4 duration-300 ease-out',
                'transition-all duration-300 ease-out',
                'motion-reduce:animate-none motion-reduce:transition-none'
              )}
            >
              <div className="space-y-2">
                <Label className="font-mono text-[11px] uppercase tracking-widest text-foreground block">
                  Account Type
                </Label>
                <Select
                  value={localClientType}
                  onValueChange={(value) =>
                    setLocalClientType(value as ClientType)
                  }
                >
                  <SelectTrigger className="w-full rounded-none">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClientType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === ClientType.COMPANY ? 'Company' : 'Individual'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isCompany && (
                <div className="space-y-2">
                  <Label
                    htmlFor="companyName"
                    className="font-mono text-[11px] uppercase tracking-widest text-foreground block"
                  >
                    Company Name
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="e.g., Acme Studios"
                    value={localCompanyName}
                    onChange={(e) => setLocalCompanyName(e.target.value)}
                    className="rounded-none border-border focus-visible:ring-0 focus-visible:border-primary transition-colors duration-200 ease-out"
                  />
                </div>
              )}

              {isCompany && (
                <div className="space-y-2">
                  <Label className="font-mono text-[11px] uppercase tracking-widest text-foreground block">
                    Industry
                  </Label>
                  <Select
                    value={localIndustry}
                    onValueChange={(value) =>
                      setLocalIndustry(value as Industry)
                    }
                  >
                    <SelectTrigger className="w-full rounded-none">
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Industry).map((value) => (
                        <SelectItem key={value} value={value}>
                          {INDUSTRY_LABELS[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {isCompany && (
                <div className="space-y-2">
                  <Label className="font-mono text-[11px] uppercase tracking-widest text-foreground block">
                    Company Size
                  </Label>
                  <Select
                    value={localCompanySize}
                    onValueChange={(value) =>
                      setLocalCompanySize(value as CompanySize)
                    }
                  >
                    <SelectTrigger className="w-full rounded-none">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(CompanySize).map((value) => (
                        <SelectItem key={value} value={value}>
                          {COMPANY_SIZE_LABELS[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {isCompany && (
                <div className="space-y-2">
                  <Label
                    htmlFor="foundedYear"
                    className="font-mono text-[11px] uppercase tracking-widest text-foreground block"
                  >
                    Founded Year
                  </Label>
                  <Input
                    id="foundedYear"
                    placeholder="e.g., 2018"
                    value={localFoundedYear}
                    onChange={(e) => setLocalFoundedYear(e.target.value)}
                    maxLength={4}
                    className="rounded-none border-border focus-visible:ring-0 focus-visible:border-primary transition-colors duration-200 ease-out"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="website"
                  className="font-mono text-[11px] uppercase tracking-widest text-foreground block"
                >
                  Website
                </Label>
                <Input
                  id="website"
                  placeholder="e.g., https://acmestudios.com"
                  value={localWebsite}
                  onChange={(e) => setLocalWebsite(e.target.value)}
                  className="rounded-none border-border focus-visible:ring-0 focus-visible:border-primary transition-colors duration-200 ease-out"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="phoneNumber"
                    className="font-mono text-[11px] uppercase tracking-widest text-foreground block"
                  >
                    Phone Number
                  </Label>
                  {phoneVerified && (
                    <span className="font-mono text-[10px] uppercase text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 font-medium">
                      Verified (Cannot be changed)
                    </span>
                  )}
                </div>
                <PhoneInput
                  id="phoneNumber"
                  value={localPhoneNumber}
                  onChange={(val) => setLocalPhoneNumber(val)}
                  disabled={phoneVerified}
                />
                {phoneVerified && (
                  <p className="text-[11px] font-mono text-muted-foreground">
                    Verified phone number cannot be changed.
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={updateProfileMutation.isPending}
                  className="flex-1 h-10 transition-all duration-200 ease-out hover:bg-muted/80 motion-reduce:transition-none"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={updateProfileMutation.isPending}
                  className="flex-1 h-10 gap-1.5 transition-all duration-200 ease-out hover:bg-primary/90 motion-reduce:transition-none"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>Save Changes</>
                  )}
                </Button>
              </div>
            </div>
          ) : details.length > 0 ? (
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {details.map((detail, index) => (
                <div
                  key={`${detail.label}-${index}`}
                  className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out motion-reduce:animate-none"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <detail.icon className="size-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {detail.label}
                    </dt>
                    <dd className="text-sm font-body text-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                      <span>{detail.value}</span>
                      {detail.label === 'Phone' &&
                        (phoneVerified ? (
                          <span className="font-mono text-[10px] uppercase text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 font-medium">
                            Verified
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsPhoneModalOpen(true)}
                            className="font-mono text-[10px] uppercase text-primary bg-primary/10 border border-primary/30 px-1.5 py-0.5 hover:bg-primary/20 transition-colors selection:text-background selection:bg-primary"
                          >
                            Verify
                          </button>
                        ))}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          ) : (
            <div className="text-center py-12 px-4 rounded-none border border-dashed border-border font-editorial text-lg text-foreground opacity-50 animate-in fade-in duration-500 ease-out motion-reduce:animate-none">
              <Building2 className="size-6 mx-auto mb-3 opacity-40" />
              Add your business details to help creatives learn about you
            </div>
          )}
        </div>
      </div>

      <PhoneVerificationModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        initialPhoneNumber={phoneNumber}
        isPhoneVerified={phoneVerified}
      />
    </div>
  );
}
