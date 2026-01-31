interface SummaryTotalsProps {
  subtotal: number;
  tipPercent: number;
  onTipPercentChange: (percent: number) => void;
  tipAmount: number;
  totalWithTip: number;
}

const TIP_OPTIONS = [5, 10, 15];

export function SummaryTotals({
  subtotal,
  tipPercent,
  onTipPercentChange,
  tipAmount,
  totalWithTip,
}: SummaryTotalsProps) {
  return (
    <div className="bg-brand-focus-ring/20 rounded-xl border-2 border-brand-orange/40 p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-secondary font-medium">Subtotal</span>
        <span className="text-xl font-bold text-primary">${subtotal.toFixed(2)}</span>
      </div>

      <div>
        <span className="text-secondary font-medium text-sm block mb-2">Propina</span>
        <div className="flex gap-2">
          {TIP_OPTIONS.map((percent) => (
            <button
              key={percent}
              type="button"
              onClick={() => onTipPercentChange(percent)}
              className={`flex-1 py-2.5 px-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                tipPercent === percent
                  ? 'border-brand-orange bg-brand-orange/15 text-brand-orange'
                  : 'border-neutral-border bg-surface text-secondary hover:border-brand-orange/50'
              }`}
            >
              {percent}%
            </button>
          ))}
        </div>
      </div>

      {tipPercent > 0 && (
        <div className="flex justify-between items-center text-secondary">
          <span className="text-sm">Propina ({tipPercent}%)</span>
          <span className="font-medium">${tipAmount.toFixed(2)}</span>
        </div>
      )}

      <div className="flex justify-between items-center pt-2 border-t border-neutral-border">
        <span className="font-bold text-primary">Total</span>
        <span className="text-2xl font-bold text-action-green">${totalWithTip.toFixed(2)}</span>
      </div>
    </div>
  );
}
