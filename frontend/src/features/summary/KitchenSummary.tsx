import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../state/OrderContext';
import type { Pupusa, DoughType, Filling, PupusaSize } from '../../models/Pupusa';
import { Page } from '../../shared/layout/Page';
import { PAYPAL_DONATE_URL } from '../../shared/layout/Footer';
import { Button } from '../../shared/components/Button';
import { SummaryTotals } from './SummaryTotals';
import { SummaryList } from './SummaryList';
import { Card } from '../../shared/components/Card';

interface AggregatedPupusa {
  dough: DoughType;
  filling: Filling;
  withCheese: boolean;
  size: PupusaSize;
  quantity: number;
}

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

export function KitchenSummary() {
  const { order } = useOrder();
  const navigate = useNavigate();

  if (!order) {
    navigate('/');
    return null;
  }

  // Aggregate pupusas by dough + filling + withCheese + size
  const aggregatedPupusas = useMemo(() => {
    const allPupusas: Pupusa[] = order.people.flatMap(person => person.pupusas);

    const aggregated = new Map<string, AggregatedPupusa>();

    allPupusas.forEach(pupusa => {
      const key = `${pupusa.dough}-${pupusa.filling}-${pupusa.withCheese}-${pupusa.size}`;
      const existing = aggregated.get(key);

      if (existing) {
        existing.quantity += pupusa.quantity;
      } else {
        aggregated.set(key, {
          dough: pupusa.dough,
          filling: pupusa.filling,
          withCheese: pupusa.withCheese,
          size: pupusa.size,
          quantity: pupusa.quantity,
        });
      }
    });

    return Array.from(aggregated.values()).sort((a, b) => {
      // Sort by dough type first (maiz before arroz), then by filling
      if (a.dough !== b.dough) {
        return a.dough === 'maiz' ? -1 : 1;
      }
      return a.filling.localeCompare(b.filling);
    });
  }, [order]);

  // Aggregate beverages by name (flat list, no categories)
  const aggregatedBeverages = useMemo(() => {
    const byName = new Map<string, number>();
    order.people.forEach(person => {
      person.beverages.forEach(b => {
        byName.set(b.name, (byName.get(b.name) ?? 0) + b.quantity);
      });
    });
    return Array.from(byName.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [order]);

  // Subtotal en USD (pupusas + bebidas)
  const subtotal = useMemo(() => {
    return order.people.reduce(
      (sum, person) =>
        sum +
        person.pupusas.reduce((s, p) => s + p.quantity * p.priceUSD, 0) +
        person.beverages.reduce((s, b) => s + b.quantity * b.priceUSD, 0),
      0
    );
  }, [order]);

  const [tipPercent, setTipPercent] = useState(0);
  const tipAmount = subtotal * (tipPercent / 100);
  const totalWithTip = subtotal + tipAmount;

  // Por persona: subtotal y total con propina (propina proporcional a su pedido)
  const personTotals = useMemo(() => {
    return order.people.map((person) => {
      const personSubtotal =
        person.pupusas.reduce((s, p) => s + p.quantity * p.priceUSD, 0) +
        person.beverages.reduce((s, b) => s + b.quantity * b.priceUSD, 0);
      const personTip = subtotal > 0 ? tipAmount * (personSubtotal / subtotal) : 0;
      const personTotal = personSubtotal + personTip;
      return { personSubtotal, personTip, personTotal };
    });
  }, [order, subtotal, tipAmount]);

  const handleBack = () => {
    navigate('/order');
  };

  const handleSendToWhatsApp = () => {
    // Build WhatsApp message with complete summary (Salvadoran format)
    let message = `*${order.groupName}*\n`;
    message += `👨‍🍳 *Resumen para Cocina*\n\n`;
    
    // Aggregated List (Kitchen-friendly) - Salvadoran format
    message += `*Detalle del Pedido:*\n`;
    if (aggregatedPupusas.length === 0 && aggregatedBeverages.length === 0) {
      message += `No hay ítems en el pedido\n`;
    } else {
      aggregatedPupusas.forEach((item) => {
        const emojiMap: Record<Filling, string> = {
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
        const emoji = emojiMap[item.filling] || '🫓';
        const doughName = getDoughDisplayName(item.dough);
        const fillingName = getFillingDisplayName(item.filling, item.withCheese);
        const sizeName = getSizeDisplayName(item.size);
        message += `${emoji} ${item.quantity} de ${fillingName} de ${doughName} (${sizeName})\n`;
      });
      aggregatedBeverages.forEach((item) => {
        message += `🥤 ${item.quantity} ${item.name}\n`;
      });
    }
    message += `\n`;

    // Totales y propina
    message += `━━━━━━━━━━━━━━━━\n`;
    message += `*Subtotal:* $${subtotal.toFixed(2)}\n`;
    if (tipPercent > 0) {
      message += `*Propina (${tipPercent}%):* $${tipAmount.toFixed(2)}\n`;
      message += `*Total:* $${totalWithTip.toFixed(2)}\n`;
    } else {
      message += `*Total:* $${subtotal.toFixed(2)}\n`;
    }
    message += `\n`;

    // Per-Person Breakdown con precios
    message += `*Resumen por Persona:*\n\n`;
    order.people.forEach((person, index) => {
      const { personSubtotal, personTip, personTotal } = personTotals[index];
      const personItemCount =
        person.pupusas.reduce((s, p) => s + p.quantity, 0) +
        person.beverages.reduce((s, b) => s + b.quantity, 0);
      if (personItemCount === 0) return;

      message += `*${person.name}:*\n`;
      person.pupusas.forEach((pupusa) => {
        const doughName = getDoughDisplayName(pupusa.dough).toLowerCase();
        const fillingName = getFillingDisplayName(pupusa.filling, pupusa.withCheese);
        const sizeName = getSizeDisplayName(pupusa.size);
        const lineTotal = pupusa.quantity * pupusa.priceUSD;
        message += `  • ${pupusa.quantity} de ${doughName} de ${fillingName} (${sizeName}) — $${lineTotal.toFixed(2)}\n`;
      });
      person.beverages.forEach((b) => {
        const lineTotal = b.quantity * b.priceUSD;
        message += `  • ${b.quantity} ${b.name} — $${lineTotal.toFixed(2)}\n`;
      });
      message += `  Subtotal: $${personSubtotal.toFixed(2)}\n`;
      if (tipPercent > 0) {
        message += `  Propina: $${personTip.toFixed(2)}\n`;
        message += `  *Total: $${personTotal.toFixed(2)}*\n`;
      } else {
        message += `  *Total: $${personSubtotal.toFixed(2)}*\n`;
      }
      message += `\n`;
    });

    // Prefer Web Share API on mobile: user stays in the app, no blank screen on return
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: order.groupName,
          text: message,
        })
        .catch(() => {
          // User cancelled or share failed: fallback to WhatsApp URL
          const encodedMessage = encodeURIComponent(message);
          window.open(`https://wa.me/?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
        });
      return;
    }

    // Fallback: open WhatsApp in new tab (desktop or old browsers)
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Page>
      <div className="min-h-screen bg-app">
        {/* Green Header */}
        <div className="bg-action-green px-5 py-4">
          <div className="max-w-xl mx-auto flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="text-white hover:bg-action-green-hover/80 transition-colors flex items-center gap-2 rounded-lg py-1 px-2 -ml-2"
            >
              <span>←</span>
              <span className="text-sm">Volver al pedido</span>
            </button>
          </div>
          <div className="max-w-xl mx-auto mt-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-action-green-hover flex items-center justify-center">
              <span className="text-2xl">👨‍🍳</span>
            </div>
            <div className="text-white">
              <h1 className="text-xl font-bold">Resumen para Cocina</h1>
              <p className="text-sm text-white/90">{order.groupName}</p>
            </div>
          </div>
        </div>

        <div className="px-5 py-6 space-y-5">
          <SummaryTotals
            subtotal={subtotal}
            tipPercent={tipPercent}
            onTipPercentChange={setTipPercent}
            tipAmount={tipAmount}
            totalWithTip={totalWithTip}
          />

          <SummaryList
            aggregatedPupusas={aggregatedPupusas}
            aggregatedBeverages={aggregatedBeverages}
          />

          {/* Summary by Person con precios */}
          <Card>
            <h2 className="text-lg font-bold text-primary mb-4">Resumen por Persona</h2>
            <div className="space-y-4">
              {order.people.map((person, index) => {
                const personItemCount =
                  person.pupusas.reduce((s, p) => s + p.quantity, 0) +
                  person.beverages.reduce((s, b) => s + b.quantity, 0);
                if (personItemCount === 0) return null;

                const { personSubtotal, personTip, personTotal } = personTotals[index];

                return (
                  <div key={person.id} className="border-b border-neutral-border last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-primary">{person.name}</span>
                      <span className="text-secondary font-medium text-sm">
                        Subtotal: ${personSubtotal.toFixed(2)}
                        {tipPercent > 0 && (
                          <> · Con propina: <span className="font-bold text-action-green">${personTotal.toFixed(2)}</span></>
                        )}
                      </span>
                    </div>
                    <div className="space-y-1 ml-2">
                      {person.pupusas.map((pupusa) => (
                        <div key={pupusa.id} className="text-sm text-secondary flex justify-between gap-2">
                          <span>• {pupusa.quantity}x {getDoughDisplayName(pupusa.dough)} - {getFillingDisplayName(pupusa.filling, pupusa.withCheese)} ({getSizeDisplayName(pupusa.size)})</span>
                          <span className="shrink-0">${(pupusa.quantity * pupusa.priceUSD).toFixed(2)}</span>
                        </div>
                      ))}
                      {person.beverages.map((beverage) => (
                        <div key={beverage.id} className="text-sm text-secondary flex justify-between gap-2">
                          <span>• {beverage.quantity}x {beverage.name}</span>
                          <span className="shrink-0">${(beverage.quantity * beverage.priceUSD).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    {tipPercent > 0 && (
                      <div className="ml-2 mt-1 text-xs text-secondary">
                        Propina ({tipPercent}%): ${personTip.toFixed(2)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Action Button */}
          <div className="pt-2">
            <Button
              type="button"
              variant="success"
              onClick={handleSendToWhatsApp}
              className="w-full px-4 py-3 flex items-center justify-center gap-2"
            >
              <span>📱</span>
              <span>Enviar a WhatsApp</span>
            </Button>
          </div>

          {/* Support section - después del resumen, opcional y discreto */}
          <div className="pt-8 pb-2 text-center">
            <p className="text-secondary text-sm mb-3">
              Si Pupas te ayudó a ordenar sin relajo, podés apoyar el proyecto aquí ☕
            </p>
            <a
              href={PAYPAL_DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] py-2.5 px-4 rounded-lg border border-neutral-border text-secondary hover:text-brand-orange hover:border-brand-orange/50 hover:bg-brand-focus-ring/10 text-sm font-medium transition-colors"
              aria-label="Apoyar el proyecto con PayPal"
            >
              <span className="text-base" aria-hidden>☕</span>
              <span>Apoyar con PayPal</span>
            </a>
          </div>
        </div>
      </div>
    </Page>
  );
}
