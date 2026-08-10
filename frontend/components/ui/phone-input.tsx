'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  COUNTRY_CODES,
  CountryCode,
  parsePhoneNumber,
  formatPhoneNumber,
} from '@/constants/country-codes';

export interface PhoneInputProps {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function PhoneInput({
  id,
  value,
  onChange,
  disabled,
  className,
  placeholder = 'e.g., 98765 43210',
}: PhoneInputProps) {
  const initialParsed = useMemo(() => parsePhoneNumber(value), []);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    initialParsed.country
  );
  const [subscriberNumber, setSubscriberNumber] = useState<string>(
    initialParsed.subscriberNumber
  );
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Keep local state in sync if prop value changes externally
  useEffect(() => {
    const currentFormatted = formatPhoneNumber(
      selectedCountry.dialCode,
      subscriberNumber
    );
    if (value !== undefined && value !== currentFormatted) {
      const updated = parsePhoneNumber(value);
      setSelectedCountry(updated.country);
      setSubscriberNumber(updated.subscriberNumber);
    }
  }, [value]);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return COUNTRY_CODES;
    const q = searchQuery.toLowerCase().trim();
    return COUNTRY_CODES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery('');
    const formatted = formatPhoneNumber(country.dialCode, subscriberNumber);
    onChange?.(formatted);
  };

  const handleNumberChange = (num: string) => {
    // Auto-detect country code if pasted directly with '+'
    if (num.trim().startsWith('+')) {
      const parsedPasted = parsePhoneNumber(num);
      setSelectedCountry(parsedPasted.country);
      setSubscriberNumber(parsedPasted.subscriberNumber);
      const formatted = formatPhoneNumber(
        parsedPasted.country.dialCode,
        parsedPasted.subscriberNumber
      );
      onChange?.(formatted);
      return;
    }

    setSubscriberNumber(num);
    const formatted = formatPhoneNumber(selectedCountry.dialCode, num);
    onChange?.(formatted);
  };

  const handleScrollContainerWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const container = e.currentTarget;
    let delta = e.deltaY;
    if (e.deltaMode === 1) delta *= 18;
    else if (e.deltaMode === 2) delta *= container.clientHeight;
    container.scrollTop += delta;
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Popover open={isOpen} onOpenChange={disabled ? undefined : setIsOpen}>
        <PopoverTrigger
          render={
            <button
              type="button"
              disabled={disabled}
              className={cn(
                'flex items-center justify-between gap-2 h-10 w-auto shrink-0 border border-border bg-background px-3 text-xs transition-colors duration-200 ease-out hover:border-foreground focus-visible:outline-none focus-visible:border-primary disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            />
          }
        >
          <span className="flex items-center gap-1.5 truncate">
            <span className="text-base leading-none">
              {selectedCountry.flag}
            </span>
            <span className="font-mono text-xs font-medium text-foreground">
              {selectedCountry.dialCode}
            </span>
          </span>
          <ChevronDown className="size-3.5 text-muted-foreground shrink-0 opacity-70" />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={4}
          onWheel={(e) => e.stopPropagation()}
          className="w-72 rounded-none border border-border bg-background p-2 shadow-lg ring-0"
        >
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search country or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs rounded-none border-border focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>
          <div
            className="max-h-56 overflow-y-auto overscroll-contain touch-pan-y space-y-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            onWheel={handleScrollContainerWheel}
          >
            {filteredCountries.map((c) => {
              const isSelected =
                selectedCountry.code === c.code &&
                selectedCountry.dialCode === c.dialCode;
              return (
                <button
                  key={`${c.code}-${c.dialCode}`}
                  type="button"
                  onClick={() => handleCountrySelect(c)}
                  className={cn(
                    'w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-left transition-colors hover:bg-muted/80 rounded-none',
                    isSelected && 'bg-muted font-medium'
                  )}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="text-base leading-none shrink-0">
                      {c.flag}
                    </span>
                    <span className="font-mono text-xs font-medium text-foreground shrink-0">
                      {c.dialCode}
                    </span>
                    <span className="text-muted-foreground text-xs truncate">
                      {c.name}
                    </span>
                  </span>
                  {isSelected && (
                    <Check className="size-3.5 text-primary shrink-0 ml-1 selection:text-background selection:bg-primary" />
                  )}
                </button>
              );
            })}
            {filteredCountries.length === 0 && (
              <div className="p-3 text-center text-xs text-muted-foreground font-mono">
                No country found
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <Input
        id={id}
        type="tel"
        disabled={disabled}
        placeholder={placeholder}
        value={subscriberNumber}
        onChange={(e) => handleNumberChange(e.target.value)}
        className="flex-1 h-10 rounded-none border-border focus-visible:ring-0 focus-visible:border-primary transition-colors duration-200 ease-out"
      />
    </div>
  );
}
