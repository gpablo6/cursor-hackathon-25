import type { DoughType, Filling, PupusaSize } from '../../models/Pupusa';
import { Card } from '../../shared/components/Card';

interface AggregatedPupusa {
  dough: DoughType;
  filling: Filling;
  withCheese: boolean;
  size: PupusaSize;
  quantity: number;
}

interface AggregatedBeverage {
  name: string;
  quantity: number;
}

interface SummaryListProps {
  aggregatedPupusas: AggregatedPupusa[];
  aggregatedBeverages: AggregatedBeverage[];
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

export function SummaryList({ aggregatedPupusas, aggregatedBeverages }: SummaryListProps) {
  const getFillingDisplayName = (filling: Filling, withCheese: boolean): string => {
    const baseNames: Record<Filling, string> = {
      frijol: 'Frijol',
      revueltas: 'Revueltas',
      queso: 'Queso',
      jalapeno: 'Jalapeño',
      chicharron: 'Chicharrón',
      cochinito: 'Cochinito',
      chorizo: 'Chorizo',
      loroco: 'Loroco',
      papelillo: 'Papelillo',
      mora: 'Mora',
      mango: 'Mango',
      camaron: 'Camarón',
      pescado: 'Pescado',
      ajo: 'Ajo',
      jamon: 'Jamón',
      pepperoni: 'Pepperoni',
      hongo: 'Hongo / Champiñón',
      loca: 'Loca',
      pollo: 'Pollo',
      carne: 'Carne',
      ayote: 'Ayote',
      pina: 'Piña',
      jocote: 'Jocote',
      garrobo: 'Garrobo',
      cusuco: 'Cusuco',
      conejo: 'Conejo',
    };
    
    const baseName = baseNames[filling] || filling;
    
    if (withCheese && filling !== 'queso' && filling !== 'revueltas' && filling !== 'loca') {
      return `${baseName} con queso`;
    }
    
    return baseName;
  };

  const getDoughDisplayName = (dough: DoughType): string => {
    return dough === 'maiz' ? 'Maíz' : 'Arroz';
  };

  const getSizeDisplayName = (size: PupusaSize): string => {
    const sizeNames: Record<PupusaSize, string> = {
      pequena: 'Pequeña',
      normal: 'Normal',
      grande: 'Grande',
    };
    return sizeNames[size];
  };

  const hasPupusas = aggregatedPupusas.length > 0;
  const hasBeverages = aggregatedBeverages.length > 0;

  if (!hasPupusas && !hasBeverages) {
    return (
      <Card>
        <div className="text-center py-10 text-secondary text-sm">
          No hay ítems en el pedido
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-bold text-primary mb-5">Detalle del Pedido</h2>

      <div className="space-y-3">
        {aggregatedPupusas.map((item, index) => (
          <div
            key={`${item.dough}-${item.filling}-${item.withCheese}-${item.size}-${index}`}
            className="flex items-start justify-between py-3 border-b border-neutral-border last:border-0"
          >
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <span className="text-xl shrink-0">{fillingEmojis[item.filling]}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-primary text-sm">
                  {getDoughDisplayName(item.dough)} – {getFillingDisplayName(item.filling, item.withCheese)}
                </div>
                <div className="text-xs text-secondary mt-0.5">
                  {getSizeDisplayName(item.size)}
                </div>
              </div>
            </div>
            <span className="font-bold text-brand-orange text-base shrink-0 ml-2">
              {item.quantity}
            </span>
          </div>
        ))}
        {aggregatedBeverages.map((item) => (
          <div
            key={item.name}
            className="flex items-start justify-between py-3 border-b border-neutral-border last:border-0"
          >
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <span className="text-xl shrink-0">🥤</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-primary text-sm">{item.name}</div>
              </div>
            </div>
            <span className="font-bold text-brand-orange text-base shrink-0 ml-2">
              {item.quantity}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
