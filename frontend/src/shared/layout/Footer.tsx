export const PAYPAL_DONATE_URL = 'https://www.paypal.com/paypalme/NoeLara07';

export function Footer() {
  return (
    <footer className="px-5 py-4 mt-auto border-t border-neutral-border/60">
      <p className="text-secondary text-xs text-center mb-2">
        ¿Te fue útil Pupas? Apoyá el proyecto ☕
      </p>
      <a
        href={PAYPAL_DONATE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-1.5 w-full min-h-[44px] py-2.5 px-3 rounded-lg text-secondary hover:text-brand-orange hover:bg-brand-focus-ring/10 text-sm font-medium transition-colors"
        aria-label="Apoyar el proyecto con PayPal"
      >
        <PayPalIcon className="w-4 h-4 shrink-0" />
        <span>Apoyar con PayPal</span>
      </a>
    </footer>
  );
}

function PayPalIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.646h5.782c1.947 0 3.578.513 4.858 1.52 1.277 1.004 2.02 2.467 2.238 4.375.218 1.908-.086 3.6-.914 5.063-.828 1.465-2.04 2.5-3.633 3.098-1.593.6-3.305.9-5.133.9H8.72a.77.77 0 0 0-.76.646l-.884 5.032z" />
    </svg>
  );
}
