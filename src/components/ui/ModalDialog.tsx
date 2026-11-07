"use client";

import React, { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  isDirty?: boolean;
}

const maxWidthMap = {
  sm: "max-w-[440px]",
  md: "max-w-[560px]",
  lg: "max-w-[720px]",
  xl: "max-w-[920px]",
};

export function ModalDialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "md",
  isDirty = false,
}: ModalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      if (isDirty) {
        const confirmDiscard = window.confirm(
          "You have unsaved changes. Are you sure you want to close this dialog?"
        );
        if (!confirmDiscard) {
          e.preventDefault();
          return;
        }
      }
      onClose();
    };

    const handleClose = () => {
      if (open) {
        onClose();
      }
    };

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("close", handleClose);
    };
  }, [open, onClose, isDirty]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (e.target === dialog) {
      if (isDirty) {
        const confirmDiscard = window.confirm(
          "You have unsaved changes. Are you sure you want to close this dialog?"
        );
        if (!confirmDiscard) return;
      }
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClick={handleBackdropClick}
      className={cn(
        "m-auto w-[calc(100%-2rem)] rounded-[12px] border border-[#dce1e7] bg-white p-0 text-[#14243b] shadow-2xl backdrop:bg-[#14243b]/60 backdrop:backdrop-blur-xs",
        maxWidthMap[maxWidth]
      )}
    >
      <div className="flex flex-col max-h-[88dvh]">
        <div className="flex items-start justify-between gap-4 border-b border-[#dce1e7] bg-[#f8f7f3]/60 px-6 py-5">
          <div>
            <h2 id={titleId} className="text-[20px] leading-[28px] font-bold text-[#14243b]">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-1 text-[14px] leading-[22px] text-[#526174]">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              if (isDirty) {
                const confirmDiscard = window.confirm(
                  "You have unsaved changes. Are you sure you want to close this dialog?"
                );
                if (!confirmDiscard) return;
              }
              onClose();
            }}
            aria-label="Close dialog"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] border border-[#dce1e7] bg-white text-[#526174] transition-colors hover:bg-[#e9eff7] hover:text-[#14243b] cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#dce1e7] bg-[#f8f7f3] px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </dialog>
  );
}
