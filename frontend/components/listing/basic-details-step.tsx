'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/cn';
import { EmploymentType } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BasicDetailsStepProps {
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  employmentType: EmploymentType | '';
  onEmploymentTypeChange: (value: EmploymentType | '') => void;
}

export default function BasicDetailsStep({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  employmentType,
  onEmploymentTypeChange,
}: BasicDetailsStepProps) {
  return (
    <div className="space-y-8">
      <div className="mb-10 space-y-2">
        <h3 className="font-display text-4xl text-foreground leading-none tracking-normal">
          Basic Details
        </h3>
        <p className="font-editorial text-lg text-foreground opacity-70">
          Start with the essential information about your project
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="title"
            className="font-mono text-[11px] uppercase tracking-widest text-foreground block mb-2"
          >
            Job Title <span className="text-destructive">*</span>
          </Label>
          <span
            className={cn(
              'font-mono text-[10px]',
              title.length >= 90 ? 'text-amber-600' : 'text-muted-foreground',
              title.length >= 100 ? 'text-red-600' : ''
            )}
          >
            {title.length}/100
          </span>
        </div>
        <Input
          id="title"
          type="text"
          placeholder="e.g. Senior Brand Designer for Tech Rebrand"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          maxLength={100}
          className="rounded-none border-border focus-visible:ring-0 focus-visible:border-primary transition-colors"
        />
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Min 5 characters, max 100 characters
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="description"
            className="font-mono text-[11px] uppercase tracking-widest text-foreground block mb-2"
          >
            Job Description <span className="text-destructive">*</span>
          </Label>
          <span
            className={cn(
              'font-mono text-[10px]',
              description.length >= 1900
                ? 'text-amber-600'
                : 'text-muted-foreground',
              description.length >= 2000 ? 'text-red-600' : ''
            )}
          >
            {description.length}/2000
          </span>
        </div>
        <Textarea
          id="description"
          placeholder="Describe the scope of work, deliverables, and role requirements in detail..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={6}
          maxLength={2000}
          className="rounded-none border-border focus-visible:ring-0 focus-visible:border-primary resize-none transition-colors"
        />
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Min 20 characters, max 2000 characters
        </p>
      </div>

      <div className="space-y-4">
        <Label
          htmlFor="employmentType"
          className="font-mono text-[11px] uppercase tracking-widest text-foreground block mb-2"
        >
          Employment Type
        </Label>
        <Select<EmploymentType | ''>
          value={employmentType}
          onValueChange={(value) =>
            onEmploymentTypeChange((value as EmploymentType) || '')
          }
        >
          <SelectTrigger id="employmentType" className="w-full">
            <SelectValue placeholder="Select type..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={EmploymentType.FREELANCE}>Freelance</SelectItem>
            <SelectItem value={EmploymentType.FULL_TIME}>Full Time</SelectItem>
            <SelectItem value={EmploymentType.PART_TIME}>Part Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
