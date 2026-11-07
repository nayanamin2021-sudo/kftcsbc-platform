"use client";

import React, { useId } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "url" | "password" | "search" | "date" | "select" | "textarea";
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  rows?: number;
  options?: FormFieldOption[];
  autoComplete?: string;
  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  onChange?: (value: string) => void;
  onBlurValidate?: (value: string) => string | undefined;
  className?: string;
  optionalLabel?: string;
  requiredStyle?: "dot" | "asterisk";
}

export function FormField({
  label,
  name,
  type = "text",
  value,
  defaultValue,
  placeholder,
  helperText,
  error: externalError,
  required = false,
  disabled = false,
  readOnly = false,
  rows = 4,
  options = [],
  autoComplete,
  inputMode,
  onChange,
  onBlurValidate,
  className = "",
  optionalLabel,
  requiredStyle = "dot",
}: FormFieldProps) {
  const generatedId = useId();
  const fieldId = `field-${name}-${generatedId}`;
  const helperId = `${fieldId}-helper`;
  const errorId = `${fieldId}-error`;

  const [internalError, setInternalError] = React.useState<string | undefined>(undefined);
  const activeError = externalError || internalError;

  const describedBy =
    [helperText ? helperId : null, activeError ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const handleInput = (val: string) => {
    if (internalError) {
      setInternalError(undefined);
    }
    onChange?.(val);
  };

  const handleBlur = (val: string) => {
    if (onBlurValidate) {
      const validationMsg = onBlurValidate(val);
      setInternalError(validationMsg);
    } else if (required && !val.trim()) {
      setInternalError(`${label} is required.`);
    }
  };

  const baseControlClasses = cn(
    "w-full min-h-[52px] px-[16px] py-[12px] text-[16px] leading-[26px] rounded-[8px] border transition-colors duration-150",
    disabled
      ? "bg-[#f1f5f9] text-[#526174] border-[#dce1e7] cursor-not-allowed"
      : activeError
      ? "bg-[#fef2f2] text-[#14243b] border-[#b91c1c] focus:border-[#b91c1c]"
      : "bg-white text-[#14243b] border-[#7b8795] placeholder:text-[#475569] hover:border-[#14243b] focus:border-[#14243b]"
  );

  const labelAlreadyHasSuffix =
    label.includes("· Required") || label.includes("· Optional") || label.endsWith("*");

  return (
    <div className={cn("flex flex-col gap-[8px]", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <label
          htmlFor={fieldId}
          className="text-[14px] leading-[22px] font-bold text-[#14243b]"
        >
          {label}
          {!labelAlreadyHasSuffix && required && (
            requiredStyle === "asterisk" ? (
              <span className="ml-1 text-[#14243b]" aria-hidden="true">*</span>
            ) : (
              <span className="font-bold text-[#14243b]"> · Required</span>
            )
          )}
          {!labelAlreadyHasSuffix && !required && optionalLabel && (
            <span className="font-bold text-[#14243b]"> · {optionalLabel}</span>
          )}
        </label>
      </div>

      {type === "select" ? (
        <div className="relative">
          <select
            id={fieldId}
            name={name}
            value={value}
            defaultValue={defaultValue}
            required={required}
            disabled={disabled}
            aria-invalid={Boolean(activeError) || undefined}
            aria-describedby={describedBy}
            onChange={(e) => handleInput(e.target.value)}
            onBlur={(e) => handleBlur(e.target.value)}
            className={cn(baseControlClasses, "appearance-none pr-10")}
          >
            {placeholder && (
              <option value="" disabled={required}>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#475569]"
            aria-hidden="true"
          />
        </div>
      ) : type === "textarea" ? (
        <textarea
          id={fieldId}
          name={name}
          rows={rows}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={Boolean(activeError) || undefined}
          aria-describedby={describedBy}
          onChange={(e) => handleInput(e.target.value)}
          onBlur={(e) => handleBlur(e.target.value)}
          className={cn(baseControlClasses, "resize-y min-h-[144px]")}
        />
      ) : (
        <input
          id={fieldId}
          name={name}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={Boolean(activeError) || undefined}
          aria-describedby={describedBy}
          onChange={(e) => handleInput(e.target.value)}
          onBlur={(e) => handleBlur(e.target.value)}
          className={baseControlClasses}
        />
      )}

      {activeError ? (
        <p
          id={errorId}
          role="alert"
          className="text-[14px] leading-[22px] font-semibold text-[#b91c1c] flex items-center gap-1.5"
        >
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{activeError}</span>
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-[14px] leading-[22px] text-[#475569]">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
