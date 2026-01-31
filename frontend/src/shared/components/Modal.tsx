import type { ReactNode } from 'react';
import logoImg from '../../assets/Logo_Pupas.png';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative bg-surface rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: logo (fixed, no scroll) */}
        <div className="shrink-0 border-b border-neutral-border rounded-t-2xl bg-surface">
          <div className="flex justify-center pt-3 pb-2">
            <img
              src={logoImg}
              alt="Pupas"
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>

        {/* Content (scrollable) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
