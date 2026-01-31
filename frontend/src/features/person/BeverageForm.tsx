import { useState, useMemo, useEffect } from 'react';
import type { Beverage } from '../../models/Beverage';
import { BEVERAGE_NAMES } from '../../data/beverages';
import { Button } from '../../shared/components/Button';

interface BeverageFormProps {
  onAdd: (beverage: Omit<Beverage, 'id'>) => void;
  onCancel: () => void;
  defaultPrice?: number;
  isOpen?: boolean;
}

const pricePresets = [0.50, 1.00, 1.50, 2.00];

export function BeverageForm({ onAdd, onCancel, defaultPrice, isOpen }: BeverageFormProps) {
  const [name, setName] = useState(BEVERAGE_NAMES[0] ?? '');
  const [priceUSD, setPriceUSD] = useState(1.00);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBeverages = useMemo(() => {
    if (!searchQuery.trim()) return BEVERAGE_NAMES;
    const q = searchQuery.toLowerCase().trim();
    return BEVERAGE_NAMES.filter(n => n.toLowerCase().includes(q));
  }, [searchQuery]);

  useEffect(() => {
    if (isOpen && defaultPrice != null) {
      setPriceUSD(defaultPrice);
    }
  }, [isOpen, defaultPrice]);

  const handlePriceSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (!Number.isNaN(v)) setPriceUSD(v);
  };

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed || quantity < 1 || priceUSD < 0) return;
    onAdd({ name: trimmed, priceUSD, quantity });
    setQuantity(1);
    setPriceUSD(1.00);
    setSearchQuery('');
    setName(BEVERAGE_NAMES[0] ?? '');
  };

  const isValid = name.trim().length > 0 && quantity >= 1 && priceUSD >= 0;

  return (
    <div className="space-y-6">
      {/* 1. Beverage selection - search + flat list */}
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar bebida"
          className="input-brand mb-3"
          aria-label="Buscar bebida"
        />
        <div className="max-h-40 overflow-y-auto rounded-lg border border-neutral-border bg-surface/50 space-y-0.5 p-1.5">
          {filteredBeverages.length === 0 ? (
            <div className="text-center py-4 text-secondary text-sm">No hay resultados</div>
          ) : (
            filteredBeverages.map((beverageName) => (
              <button
                key={beverageName}
                type="button"
                onClick={() => setName(beverageName)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  name === beverageName
                    ? 'bg-brand-orange/15 text-brand-orange border border-brand-orange/40'
                    : 'text-primary hover:bg-neutral-disabled-bg border border-transparent'
                }`}
              >
                {beverageName}
              </button>
            ))
          )}
        </div>
      </div>

      {/* 2. Price (USD) - same UX as pupusas */}
      <div className="space-y-3">
        <div className="flex items-center justify-center">
          <span className="text-2xl font-bold text-action-green min-w-[4rem] text-center">
            ${priceUSD.toFixed(2)}
          </span>
        </div>
        <div className="px-1">
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.05}
            value={Math.min(2, Math.max(0.5, priceUSD))}
            onChange={handlePriceSliderChange}
            className="price-slider"
            aria-label="Precio en dólares"
          />
          <div className="flex justify-between mt-2 px-0.5">
            {pricePresets.map((price) => (
              <button
                key={price}
                type="button"
                onClick={() => setPriceUSD(price)}
                className={`text-xs font-semibold transition-colors ${
                  priceUSD === price ? 'text-action-green' : 'text-secondary'
                }`}
              >
                ${price.toFixed(2)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Quantity - stepper */}
      <div>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="w-10 h-10 rounded-xl border border-neutral-border bg-surface text-primary font-bold text-lg shadow-[0_4px_0_0_#D4CBC0] hover:bg-app active:translate-y-0.5 active:shadow-[0_2px_0_0_#D4CBC0] transition-all duration-200 flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0"
            aria-label="Disminuir cantidad"
          >
            −
          </button>
          <span className="text-2xl font-bold text-primary min-w-[3rem] text-center">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-10 h-10 rounded-xl border border-neutral-border bg-surface text-primary font-bold text-lg shadow-[0_4px_0_0_#D4CBC0] hover:bg-app active:translate-y-0.5 active:shadow-[0_2px_0_0_#D4CBC0] transition-all duration-200 flex items-center justify-center shrink-0"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      </div>

      {/* 4. Actions */}
      <div className="flex gap-2.5 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleSubmit}
          className="flex-1"
          disabled={!isValid}
        >
          Agregar bebida
        </Button>
      </div>
    </div>
  );
}
