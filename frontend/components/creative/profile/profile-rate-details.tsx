'use client';

import { useState } from 'react';
import { Wrench, Edit2, Plus, X, Loader2, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RateType } from '@/types';
import { useUpdateProfile } from '@/hooks/creative/profile';
import { handleApiError } from '@/lib/handle-error';

interface ProfileRateDetailsProps {
  rateType?: RateType | null;
  rateAmount?: number | null;
  experienceYears?: number | null;
  tools: string[];
}

const RATE_TYPE_LABELS: Record<RateType, string> = {
  [RateType.HOURLY]: 'Hourly',
  [RateType.DAILY]: 'Daily',
  [RateType.PROJECT]: 'Per Project',
  [RateType.NEGOTIABLE]: 'Negotiable',
};

export default function ProfileRateDetails({
  rateType,
  rateAmount,
  experienceYears,
  tools,
}: ProfileRateDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localRateType, setLocalRateType] = useState<RateType | null>(
    rateType ?? null
  );
  const [localRateAmount, setLocalRateAmount] = useState(
    rateAmount != null ? String(rateAmount) : ''
  );
  const [localExperienceYears, setLocalExperienceYears] = useState(
    experienceYears != null ? String(experienceYears) : ''
  );
  const [localTools, setLocalTools] = useState<string[]>(tools);
  const [toolInput, setToolInput] = useState('');
  const { updateProfileMutation } = useUpdateProfile();

  const handleEdit = () => {
    setLocalRateType(rateType ?? null);
    setLocalRateAmount(rateAmount != null ? String(rateAmount) : '');
    setLocalExperienceYears(
      experienceYears != null ? String(experienceYears) : ''
    );
    setLocalTools(tools);
    setToolInput('');
    setIsEditing(true);
  };

  const handleAddTool = () => {
    const trimmed = toolInput.trim();
    if (trimmed.length < 2 || localTools.includes(trimmed)) return;
    setLocalTools((prev) => [...prev, trimmed]);
    setToolInput('');
  };

  const handleRemoveTool = (tool: string) => {
    setLocalTools((prev) => prev.filter((t) => t !== tool));
  };

  const handleSave = () => {
    const parsedRateAmount =
      localRateType === RateType.NEGOTIABLE || localRateAmount.trim() === ''
        ? null
        : Number(localRateAmount);

    if (
      parsedRateAmount !== null &&
      (isNaN(parsedRateAmount) || parsedRateAmount <= 0)
    ) {
      handleApiError(
        new Error('Rate amount must be a positive number'),
        'Rate amount must be a positive number'
      );
      return;
    }

    const parsedExperienceYears =
      localExperienceYears.trim() === '' ? null : Number(localExperienceYears);

    if (
      parsedExperienceYears !== null &&
      (isNaN(parsedExperienceYears) ||
        parsedExperienceYears < 0 ||
        parsedExperienceYears > 60)
    ) {
      handleApiError(
        new Error('Experience years must be between 0 and 60'),
        'Experience years must be between 0 and 60'
      );
      return;
    }

    updateProfileMutation.mutate(
      {
        rateType: localRateType,
        rateAmount: parsedRateAmount,
        experienceYears: parsedExperienceYears,
        tools: localTools,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleCancel = () => setIsEditing(false);

  return (
    <div className="border-t border-border pt-12 md:pt-16">
      <div className="grid grid-cols-12 gap-8 md:gap-12">
        <div className="col-span-12 md:col-span-4">
          <div className="flex items-center justify-between gap-4 sticky top-8">
            <div className="font-mono text-xs uppercase tracking-widest opacity-60">
              / Rate & Tools
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={isEditing ? handleCancel : handleEdit}
              className="h-7 gap-1.5 -mr-2 transition-all duration-200 ease-out hover:bg-muted/80 motion-reduce:transition-none"
            >
              {isEditing ? (
                <>Cancel</>
              ) : (
                <>
                  <Edit2 className="size-3" />
                  Edit
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="col-span-12 md:col-span-8 space-y-8">
          {isEditing ? (
            <div className="space-y-6">
              {/* Rate */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="font-mono text-[11px] uppercase tracking-widest text-foreground block">
                    Rate Type
                  </Label>
                  <Select
                    value={localRateType ?? undefined}
                    onValueChange={(value) =>
                      setLocalRateType(value as RateType)
                    }
                  >
                    <SelectTrigger className="rounded-none w-full">
                      <SelectValue placeholder="Select rate type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(RateType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {RATE_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="rateAmount"
                    className="font-mono text-[11px] uppercase tracking-widest text-foreground block"
                  >
                    Rate Amount
                  </Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      id="rateAmount"
                      type="number"
                      min={1}
                      placeholder="0"
                      value={localRateAmount}
                      onChange={(e) => setLocalRateAmount(e.target.value)}
                      disabled={localRateType === RateType.NEGOTIABLE}
                      className="rounded-none border-border focus-visible:ring-0 focus-visible:border-primary pl-8"
                    />
                  </div>
                </div>
              </div>

              {/* Experience Years */}
              <div className="space-y-3">
                <Label
                  htmlFor="experienceYears"
                  className="font-mono text-[11px] uppercase tracking-widest text-foreground block"
                >
                  Years of Experience
                </Label>
                <Input
                  id="experienceYears"
                  type="number"
                  min={0}
                  max={60}
                  placeholder="e.g., 5"
                  value={localExperienceYears}
                  onChange={(e) => setLocalExperienceYears(e.target.value)}
                  className="rounded-none border-border focus-visible:ring-0 focus-visible:border-primary max-w-[160px]"
                />
              </div>

              {/* Tools */}
              <div className="space-y-3">
                <Label className="font-mono text-[11px] uppercase tracking-widest text-foreground block">
                  Hardware & Software Tools
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="e.g., ARRI Alexa, DaVinci Resolve"
                    value={toolInput}
                    onChange={(e) => setToolInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTool();
                      }
                    }}
                    className="rounded-none border-border focus-visible:ring-0 focus-visible:border-primary"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTool}
                    disabled={toolInput.trim().length < 2}
                    className="shrink-0"
                  >
                    <Plus className="size-3.5" />
                  </Button>
                </div>
                {localTools.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {localTools.map((tool) => (
                      <div
                        key={tool}
                        className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-none font-mono text-[10px] uppercase tracking-widest border border-border bg-background"
                      >
                        <Wrench className="size-3 opacity-60" />
                        {tool}
                        <button
                          type="button"
                          onClick={() => handleRemoveTool(tool)}
                          className="opacity-50 hover:opacity-100 transition-opacity"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={updateProfileMutation.isPending}
                  className="flex-1 h-10"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={updateProfileMutation.isPending}
                  className="flex-1 h-10 gap-1.5"
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
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs text-muted-foreground">
                <span>
                  Rate:{' '}
                  <strong className="text-foreground">
                    {rateType
                      ? rateType === RateType.NEGOTIABLE
                        ? 'Negotiable'
                        : `₹${rateAmount?.toLocaleString('en-IN')} (${RATE_TYPE_LABELS[rateType]})`
                      : 'Not set'}
                  </strong>
                </span>
                <span>
                  Experience:{' '}
                  <strong className="text-foreground">
                    {experienceYears != null
                      ? `${experienceYears} yrs`
                      : 'Not set'}
                  </strong>
                </span>
              </div>

              {tools.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tools.map((tool) => (
                    <span
                      key={tool}
                      className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest border border-border bg-background px-3 py-1.5 text-foreground"
                    >
                      <Wrench className="size-3 opacity-60" />
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
