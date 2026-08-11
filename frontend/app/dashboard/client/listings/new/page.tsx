'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCreateListing } from '@/hooks/listing';
import { authClient } from '@/lib/auth-client';
import {
  LocationType,
  RateType,
  EmploymentType,
  Currency,
  ListingStatus,
} from '@/types';
import { toast } from 'sonner';
import {
  MultiStepListingForm,
  ListingStepNavigation,
  BasicDetailsStep,
  LocationScheduleStep,
  BudgetStep,
  SkillsStatusStep,
} from '@/components/listing';

const steps = [
  { id: 1, title: 'Details', description: 'Basic info' },
  { id: 2, title: 'Location', description: 'Where & when' },
  { id: 3, title: 'Budget', description: 'Compensation' },
  { id: 4, title: 'Skills', description: 'Requirements' },
];

export default function NewListingPage() {
  const router = useRouter();
  const { data: sessionData } = authClient.useSession();
  const isEmailVerified = Boolean(sessionData?.user?.emailVerified);
  const [currentStep, setCurrentStep] = useState(0);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [employmentType, setEmploymentType] = useState<EmploymentType | ''>('');
  const [locationType, setLocationType] = useState<LocationType>(
    LocationType.REMOTE
  );
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [rateType, setRateType] = useState<RateType>(RateType.PROJECT);
  const [currency, setCurrency] = useState<Currency>(Currency.USD);
  const [budgetMin, setBudgetMin] = useState<string>('');
  const [budgetMax, setBudgetMax] = useState<string>('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [status, setStatus] = useState<ListingStatus>(ListingStatus.ACTIVE);

  const { createListingMutation } = useCreateListing({
    onSuccess: () => {
      toast.success('Listing created successfully!');
      router.push('/dashboard/client/listings');
    },
  });

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed) && skills.length < 20) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        // Basic Details: title (min 5 chars) and description (min 20 chars) are mandatory
        return title.length >= 5 && description.length >= 20;
      case 1:
        // Location & Schedule: no mandatory fields
        return true;
      case 2:
        // Budget: no mandatory fields
        return true;
      case 3:
        // Skills & Status: no mandatory fields
        return true;
      default:
        return true;
    }
  };

  const isFormValid = (): boolean => {
    // Check all mandatory fields for the entire form
    const mandatoryFieldsValid = title.length >= 5 && description.length >= 20;

    // Validate dates if provided
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let datesValid = true;
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (start < today) datesValid = false;
    }

    if (deadline) {
      const dline = new Date(deadline);
      dline.setHours(0, 0, 0, 0);
      if (dline < today) datesValid = false;
    }

    if (startDate && deadline) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const dline = new Date(deadline);
      dline.setHours(0, 0, 0, 0);
      if (dline > start) datesValid = false;
    }

    // Validate budget if provided
    let budgetValid = true;
    const min = budgetMin ? parseInt(budgetMin, 10) : undefined;
    const max = budgetMax ? parseInt(budgetMax, 10) : undefined;
    if (min !== undefined && max !== undefined && max < min) {
      budgetValid = false;
    }

    return mandatoryFieldsValid && datesValid && budgetValid;
  };

  const handleNext = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validation for each step
    if (currentStep === 0) {
      if (title.length < 5) {
        toast.error('Title must be at least 5 characters long');
        return;
      }
      if (description.length < 20) {
        toast.error('Description must be at least 20 characters long');
        return;
      }
    }

    if (currentStep === 1) {
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (start < today) {
          toast.error('Start date must be today or a future date');
          return;
        }
      }

      if (deadline) {
        const dline = new Date(deadline);
        dline.setHours(0, 0, 0, 0);
        if (dline < today) {
          toast.error('Deadline must be today or a future date');
          return;
        }
      }

      if (startDate && deadline) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const dline = new Date(deadline);
        dline.setHours(0, 0, 0, 0);
        if (dline > start) {
          toast.error('Deadline cannot be before start date');
          return;
        }
      }
    }

    if (currentStep === 2) {
      const min = budgetMin ? parseInt(budgetMin, 10) : undefined;
      const max = budgetMax ? parseInt(budgetMax, 10) : undefined;
      if (min !== undefined && max !== undefined && max < min) {
        toast.error('Maximum budget must be greater than minimum budget');
        return;
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEmailVerified) {
      toast.error(
        'Email verification required. Please verify your email address before proceeding.'
      );
      return;
    }

    if (!isFormValid()) {
      toast.error('Please fix all validation errors before submitting');
      return;
    }

    const min = budgetMin ? parseInt(budgetMin, 10) : undefined;
    const max = budgetMax ? parseInt(budgetMax, 10) : undefined;

    createListingMutation.mutate({
      title,
      description,
      status,
      locationType,
      location: location || undefined,
      employmentType: employmentType
        ? (employmentType as EmploymentType)
        : undefined,
      rateType,
      currency,
      budgetMin: min,
      budgetMax: max,
      duration: duration || undefined,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      skills: skills.length > 0 ? skills : undefined,
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicDetailsStep
            title={title}
            onTitleChange={setTitle}
            description={description}
            onDescriptionChange={setDescription}
            employmentType={employmentType}
            onEmploymentTypeChange={setEmploymentType}
          />
        );
      case 1:
        return (
          <LocationScheduleStep
            locationType={locationType}
            onLocationTypeChange={setLocationType}
            location={location}
            onLocationChange={setLocation}
            duration={duration}
            onDurationChange={setDuration}
            startDate={startDate}
            onStartDateChange={setStartDate}
            deadline={deadline}
            onDeadlineChange={setDeadline}
          />
        );
      case 2:
        return (
          <BudgetStep
            rateType={rateType}
            onRateTypeChange={setRateType}
            currency={currency}
            onCurrencyChange={setCurrency}
            budgetMin={budgetMin}
            onBudgetMinChange={setBudgetMin}
            budgetMax={budgetMax}
            onBudgetMaxChange={setBudgetMax}
          />
        );
      case 3:
        return (
          <SkillsStatusStep
            skillInput={skillInput}
            onSkillInputChange={setSkillInput}
            skills={skills}
            onAddSkill={handleAddSkill}
            onRemoveSkill={handleRemoveSkill}
            status={status}
            onStatusChange={setStatus}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4 border-b border-border pb-6">
          <div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Create New{' '}
              <span className="text-primary selection:text-background selection:bg-primary">
                Listing
              </span>
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-1">
              Post an opportunity for top creatives to apply
            </p>
          </div>
        </div>

        {!isEmailVerified && (
          <div className="flex items-start gap-2.5 border border-primary/30 bg-primary/10 p-4 text-primary">
            <TriangleAlert className="size-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-body text-sm font-medium">
                Email verification required
              </p>
              <p className="font-body text-xs text-primary/80">
                Please verify your email address before creating a listing.
              </p>
            </div>
          </div>
        )}

        {/* Multi-step Form */}
        <form onSubmit={handleSubmit}>
          <MultiStepListingForm currentStep={currentStep} steps={steps}>
            {renderStep()}

            <ListingStepNavigation
              currentStep={currentStep}
              totalSteps={steps.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              isSubmitting={createListingMutation.isPending}
              isNextDisabled={!isStepValid(currentStep)}
              isSubmitDisabled={!isFormValid() || !isEmailVerified}
            />
          </MultiStepListingForm>
        </form>

        {/* Cancel Button */}
        <div className="pt-4">
          <Link href="/dashboard/client/listings" className="block w-full">
            <Button type="button" variant="destructive" className="w-full">
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
