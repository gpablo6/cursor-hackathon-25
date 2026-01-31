import { useState, useMemo, useEffect } from 'react';
import type { DoughType, Filling, Pupusa, PupusaSize } from '../../models/Pupusa';
import { Button } from '../../shared/components/Button';

interface PupusaFormProps {
  onAdd: (pupusa: Omit<Pupusa, 'id'>) => void;
  onCancel: () => void;
  /** Último precio usado (p. ej. última pupusa agregada) para recordar al reabrir */
  defaultPrice?: number;
  /** Si el modal está abierto; al abrirse se aplica defaultPrice */
  isOpen?: boolean;
}

const fillingEmojis: Record<Filling, string> = {
  frijol: '🫘',
  revueltas: '🥓',
  queso: '🧀',
  jalapeno: '🌶️',
  chicharron: '🐷',
  cochinito: '🍃',
  chorizo: '🌭',
  loroco: '🌸',
  papelillo: '🍃',
  mora: '🌿',
  mango: '🥭',
  camaron: '🦐',
  pescado: '🐟',
  ajo: '🧄',
  jamon: '🍖',
  pepperoni: '🍕',
  hongo: '🍄',
  loca: '🎲',
  pollo: '🐔',
  carne: '🥩',
  ayote: '🎃',
  pina: '🍍',
  jocote: '🍑',
  garrobo: '🦎',
  cusuco: '🦔',
  conejo: '🐰',
};

export function PupusaForm({ onAdd, onCancel, defaultPrice, isOpen }: PupusaFormProps) {
  const [dough, setDough] = useState<DoughType>('maiz');
  const [filling, setFilling] = useState<Filling>('frijol');
  const [withCheese, setWithCheese] = useState(true);
  const [size, setSize] = useState<PupusaSize>('normal');
  const [quantity, setQuantity] = useState(1);
  const [priceUSD, setPriceUSD] = useState(0.50);
  const [searchQuery, setSearchQuery] = useState('');

  // Price presets for quick selection
  const pricePresets = [0.50, 1.00, 1.50, 2.00];

  const allFillings: { value: Filling; label: string }[] = [
    { value: 'frijol', label: 'Frijol' },
    { value: 'revueltas', label: 'Revueltas' },
    { value: 'queso', label: 'Queso' },
    { value: 'jalapeno', label: 'Jalapeño' },
    { value: 'chicharron', label: 'Chicharrón' },
    { value: 'cochinito', label: 'Cochinito' },
    { value: 'chorizo', label: 'Chorizo' },
    { value: 'loroco', label: 'Loroco' },
    { value: 'papelillo', label: 'Papelillo' },
    { value: 'mora', label: 'Mora' },
    { value: 'mango', label: 'Mango' },
    { value: 'camaron', label: 'Camarón' },
    { value: 'pescado', label: 'Pescado' },
    { value: 'ajo', label: 'Ajo' },
    { value: 'jamon', label: 'Jamón' },
    { value: 'pepperoni', label: 'Pepperoni' },
    { value: 'hongo', label: 'Hongo / Champiñón' },
    { value: 'loca', label: 'Loca' },
    { value: 'pollo', label: 'Pollo' },
    { value: 'carne', label: 'Carne' },
    { value: 'ayote', label: 'Ayote' },
    { value: 'pina', label: 'Piña' },
    { value: 'jocote', label: 'Jocote' },
    { value: 'garrobo', label: 'Garrobo' },
    { value: 'cusuco', label: 'Cusuco' },
    { value: 'conejo', label: 'Conejo' },
  ];

  // Filter fillings based on search query
  const filteredFillings = useMemo(() => {
    if (!searchQuery.trim()) {
      return allFillings;
    }

    const query = searchQuery.toLowerCase().trim();
    return allFillings.filter(({ label }) =>
      label.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Recordar último precio al reabrir el modal
  useEffect(() => {
    if (isOpen && defaultPrice != null) {
      setPriceUSD(defaultPrice);
    }
  }, [isOpen, defaultPrice]);

  // Cheese option should be disabled for 'queso', 'revueltas', and 'loca' (all include cheese)
  const canAddCheese = filling !== 'queso' && filling !== 'revueltas' && filling !== 'loca';

  // Reset cheese when filling changes to one that doesn't allow it
  useMemo(() => {
    if (!canAddCheese) {
      setWithCheese(false);
    }
  }, [canAddCheese]);

  const handlePriceSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setPriceUSD(Math.round(value * 100) / 100);
  };

  const handleSubmit = () => {
    if (quantity < 1) return;
    
    onAdd({
      dough,
      filling,
      withCheese: canAddCheese ? withCheese : false,
      size,
      quantity,
      priceUSD,
    });
    
    // Reset form after adding
    setDough('maiz');
    setFilling('frijol');
    setWithCheese(false);
    setSize('normal');
    setQuantity(1);
    setPriceUSD(0.50);
    setSearchQuery('');
  };

  const isValid = quantity >= 1 && priceUSD >= 0;

  return (
    <div className="space-y-6">
      {/* 1. Base filling - first and most prominent */}
      <div>
        <div className="mb-3">
          <input
            id="search-filling"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar (Ej: Frijol)"
            className="input-brand"
          />
        </div>
        {filteredFillings.length === 0 ? (
          <div className="text-center py-6 text-secondary text-sm">
            No hay de ese tipo
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {filteredFillings.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilling(value)}
                className={`shrink-0 w-20 p-2 rounded-lg border-2 text-xs font-medium transition-all relative ${
                  filling === value
                    ? 'border-action-green bg-action-green/10 text-primary shadow-sm'
                    : 'border-neutral-border bg-surface text-secondary hover:bg-app'
                }`}
              >
                {filling === value && (
                  <span className="absolute top-0.5 right-0.5 text-action-green text-xs">✓</span>
                )}
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-lg leading-none">{fillingEmojis[value]}</span>
                  <span className="text-center leading-tight line-clamp-2">{label}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Cheese extra - only when applicable */}
      {canAddCheese && (
        <label className="flex items-center gap-2 cursor-pointer group w-fit">
          <input
            type="checkbox"
            checked={withCheese}
            onChange={(e) => setWithCheese(e.target.checked)}
            className="w-4 h-4 rounded border-neutral-border text-brand-orange focus:ring-2 focus:ring-brand-focus-ring focus:ring-offset-0"
          />
          <span className="text-xs font-medium text-secondary group-hover:text-primary transition-colors">Con queso 🧀</span>
        </label>
      )}

      {/* 3. Dough type */}
      <div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setDough('maiz')}
            className={`flex-1 py-2.5 px-3 rounded-lg border-2 text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              dough === 'maiz'
                ? 'border-brand-orange bg-brand-focus-ring/30 text-primary shadow-sm'
                : 'border-neutral-border bg-surface text-secondary hover:bg-app'
            }`}
          >
            <span className="text-lg">🌽</span>
            <span>Maíz</span>
          </button>
          <button
            type="button"
            onClick={() => setDough('arroz')}
            className={`flex-1 py-2.5 px-3 rounded-lg border-2 text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              dough === 'arroz'
                ? 'border-brand-orange bg-brand-focus-ring/30 text-primary shadow-sm'
                : 'border-neutral-border bg-surface text-secondary hover:bg-app'
            }`}
          >
            <span className="text-lg">🍚</span>
            <span>Arroz</span>
          </button>
        </div>
      </div>

      {/* 4. Tamaño (existing feature - kept in flow) */}
      <div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setSize('pequena')}
            className={`flex-1 py-2 px-2 rounded-lg border-2 text-xs font-medium transition-all ${
              size === 'pequena'
                ? 'border-brand-orange bg-brand-focus-ring/30 text-primary shadow-sm'
                : 'border-neutral-border bg-surface text-secondary hover:bg-app'
            }`}
          >
            Pequeña
          </button>
          <button
            type="button"
            onClick={() => setSize('normal')}
            className={`flex-1 py-2 px-2 rounded-lg border-2 text-xs font-medium transition-all ${
              size === 'normal'
                ? 'border-brand-orange bg-brand-focus-ring/30 text-primary shadow-sm'
                : 'border-neutral-border bg-surface text-secondary hover:bg-app'
            }`}
          >
            Normal
          </button>
          <button
            type="button"
            onClick={() => setSize('grande')}
            className={`flex-1 py-2 px-2 rounded-lg border-2 text-xs font-medium transition-all ${
              size === 'grande'
                ? 'border-brand-orange bg-brand-focus-ring/30 text-primary shadow-sm'
                : 'border-neutral-border bg-surface text-secondary hover:bg-app'
            }`}
          >
            Grande
          </button>
        </div>
      </div>

      {/* 5. Cantidad */}
      <div>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="w-10 h-10 rounded-xl border border-neutral-border bg-surface text-primary font-bold text-lg shadow-[0_4px_0_0_#D4CBC0] hover:bg-app active:translate-y-0.5 active:shadow-[0_2px_0_0_#D4CBC0] transition-all duration-200 flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0"
            aria-label="Disminuir cantidad"
          >
            −
          </button>
          <span className="text-2xl font-bold text-primary min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(q => q + 1)}
            className="w-10 h-10 rounded-xl border border-neutral-border bg-surface text-primary font-bold text-lg shadow-[0_4px_0_0_#D4CBC0] hover:bg-app active:translate-y-0.5 active:shadow-[0_2px_0_0_#D4CBC0] transition-all duration-200 flex items-center justify-center shrink-0"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      </div>

      {/* 6. Precio - slider entre $0.50 y $2.00, 4 checkpoints de referencia */}
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
            value={priceUSD}
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

      {/* 7. Primary action */}
      <div className="flex gap-2.5 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleSubmit}
          className="flex-1"
          disabled={!isValid}
        >
          Agregar
        </Button>
      </div>
    </div>
  );
}
