interface HeaderProps {
  title: string;
  subtitle?: string;
  totalAmount?: string;
  onBack?: () => void;
  onShare?: () => void;
}

function BackIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ShareIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51l6.83 3.98" />
      <path d="M15.41 6.51l-6.82 3.98" />
    </svg>
  );
}

export function Header({ title, subtitle, totalAmount, onBack, onShare }: HeaderProps) {
  return (
    <header className="bg-app border-b border-neutral-border px-5 py-4">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-neutral-disabled-bg transition-colors -ml-1"
              aria-label="Volver"
            >
              <BackIcon />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-primary tracking-tight truncate">{title}</h1>
            {subtitle && (
              <p className="text-sm text-secondary mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {(totalAmount != null || onShare) && (
          <div className="flex items-center gap-3 shrink-0">
            {totalAmount != null && (
              <div className="text-right">
                <p className="text-xs text-secondary">Total</p>
                <p className="text-base font-bold text-action-green">{totalAmount}</p>
              </div>
            )}
            {onShare && (
              <button
                type="button"
                onClick={onShare}
                className="p-2 rounded-lg text-brand-orange hover:bg-brand-focus-ring/30 transition-colors"
                aria-label="Compartir"
              >
                <ShareIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
