'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/loading-state';
import { ErrorState } from '@/components/error-state';
import { useListing, useUpdateListing } from '@/hooks/listing';
import {
  LocationType,
  RateType,
  EmploymentType,
  Currency,
  ListingStatus,
} from '@/types';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
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
  { id: 4, title: 'Skills', description: 'Requirements & stack' },
];

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || '';

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

  const { data: listingResponse, isLoading, error, refetch } = useListing(id);
  const listing = listingResponse?.data;

  // Prepopulate form when listing data is loaded
  useEffect(() => {
    if (listing) {
      setTitle(listing.title || '');
      setDescription(listing.description || '');
      setEmploymentType(listing.employmentType || '');
      setLocationType(listing.locationType || LocationType.REMOTE);
      setLocation(listing.location || '');
      setDuration(listing.duration || '');
      setStartDate(listing.startDate ? listing.startDate.split('T')[0] : '');
      setDeadline(listing.deadline ? listing.deadline.split('T')[0] : '');
      setRateType(listing.rateType || RateType.PROJECT);
      setCurrency(listing.currency || Currency.USD);
      setBudgetMin(
        listing.budgetMin !== null && listing.budgetMin !== undefined
          ? String(listing.budgetMin)
          : ''
      );
      setBudgetMax(
        listing.budgetMax !== null && listing.budgetMax !== undefined
          ? String(listing.budgetMax)
          : ''
      );
      setSkills(listing.skills || []);
      setStatus(listing.status || ListingStatus.ACTIVE);
    }
  }, [listing]);

  const { updateListingMutation } = useUpdateListing({
    onSuccess: () => {
      toast.success('Listing updated successfully!');
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
        return title.length >= 5 && description.length >= 20;
      case 1:
        return true;
      case 2:
        return true;
      case 3:
        return true;
      default:
        return true;
    }
  };

  const isFormValid = (): boolean => {
    const mandatoryFieldsValid = title.length >= 5 && description.length >= 20;

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
          toast.error('Application deadline must be today or a future date');
          return;
        }
      }

      if (startDate && deadline) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const dline = new Date(deadline);
        dline.setHours(0, 0, 0, 0);
        if (dline > start) {
          toast.error('Application deadline cannot be after the start date');
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

  const handlePrev = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (targetStep: number) => {
    if (targetStep === currentStep) return;

    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      return;
    }

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
      if (startDate && deadline) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const dline = new Date(deadline);
        dline.setHours(0, 0, 0, 0);
        if (dline > start) {
          toast.error('Application deadline cannot be after the start date');
          return;
        }
      }
    }

    setCurrentStep(targetStep);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error('Please fix all validation errors before submitting');
      return;
    }

    const min = budgetMin ? parseInt(budgetMin, 10) : undefined;
    const max = budgetMax ? parseInt(budgetMax, 10) : undefined;

    updateListingMutation.mutate({
      id,
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
      skills,
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
            showStatusSelect={false}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading listing details..." />;
  }

  if (error || !listing) {
    return (
      <div className="w-full bg-background min-h-screen py-12 px-4 sm:px-6">
        <div className="max-w-xl mx-auto space-y-6">
          <ErrorState
            title="Couldn't load listing"
            message={
              error?.message ||
              "The listing you are trying to edit could not be found or you don't have permission to edit it."
            }
            onRetry={refetch}
          />
          <div className="text-center">
            <Link href="/dashboard/client/listings">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="size-4" />
                Back to Listings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4 border-b border-border pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Edit{' '}
                <span className="text-primary selection:text-background selection:bg-primary">
                  Listing
                </span>
              </h1>
              <p className="font-body text-sm text-muted-foreground mt-1 truncate max-w-xl">
                Updating &ldquo;{listing.title}&rdquo;
              </p>
            </div>

            {currentStep < steps.length - 1 && (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid() || updateListingMutation.isPending}
                className="gap-2 shrink-0"
              >
                <Save className="size-4" />
                {updateListingMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </div>
        </div>

        {/* Multi-step Form */}
        <form onSubmit={handleSubmit}>
          <MultiStepListingForm
            currentStep={currentStep}
            steps={steps}
            onStepClick={handleStepClick}
          >
            {renderStep()}

            <ListingStepNavigation
              currentStep={currentStep}
              totalSteps={steps.length}
              onPrevious={handlePrev}
              onNext={handleNext}
              isSubmitting={updateListingMutation.isPending}
              isNextDisabled={!isStepValid(currentStep)}
              isSubmitDisabled={!isFormValid()}
              submitLabel="Save Changes"
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
