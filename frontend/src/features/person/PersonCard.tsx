import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Beverage } from '../../models/Beverage';
import type { Person } from '../../models/Person';
import type { Pupusa, DoughType, Filling, PupusaSize } from '../../models/Pupusa';
import { useOrder } from '../../state/OrderContext';
import { Avatar } from '../../shared/components/Avatar';
import { Modal } from '../../shared/components/Modal';
import { BeverageForm } from './BeverageForm';
import { PupusaForm } from './PupusaForm';

function PencilIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

function TrashIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

interface PersonCardProps {
  person: Person;
  avatarIndex?: number;
}

export function PersonCard({ person }: PersonCardProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(person.name);
  const [showPupusaForm, setShowPupusaForm] = useState(false);
  const [showBeverageForm, setShowBeverageForm] = useState(false);
  const { dispatch } = useOrder();

  const saveOrRevertName = () => {
    const trimmed = editName.trim();
    if (trimmed) {
      dispatch({
        type: 'RENAME_PERSON',
        payload: { personId: person.id, newName: trimmed },
      });
    } else {
      setEditName(person.name);
    }
    setIsEditingName(false);
  };

  const handleNameSubmit = (e: FormEvent) => {
    e.preventDefault();
    saveOrRevertName();
  };

  useEffect(() => {
    if (!isEditingName) setEditName(person.name);
  }, [person.name, isEditingName]);

  const handleAddPupusa = (pupusaData: Omit<Pupusa, 'id'>) => {
    dispatch({
      type: 'ADD_PUPUSA',
      payload: { personId: person.id, pupusa: pupusaData },
    });
    setShowPupusaForm(false);
  };

  const handleClosePupusaModal = () => setShowPupusaForm(false);
  const handleCloseBeverageModal = () => setShowBeverageForm(false);

  const handleAddBeverage = (beverageData: Omit<Beverage, 'id'>) => {
    dispatch({
      type: 'ADD_BEVERAGE',
      payload: { personId: person.id, beverage: beverageData },
    });
    setShowBeverageForm(false);
  };

  const handleRemoveBeverage = (beverageId: string) => {
    dispatch({
      type: 'REMOVE_BEVERAGE',
      payload: { personId: person.id, beverageId },
    });
  };

  const handleRemovePupusa = (pupusaId: string) => {
    dispatch({
      type: 'REMOVE_PUPUSA',
      payload: { personId: person.id, pupusaId },
    });
  };

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

    // Add "con queso" if cheese is added (except for queso, revueltas, and loca - they already include cheese)
    if (withCheese && filling !== 'queso' && filling !== 'revueltas' && filling !== 'loca') {
      return `${baseName} con queso`;
    }

    return baseName;
  };

  const getFillingEmoji = (filling: Filling): string => {
    const emojis: Record<Filling, string> = {
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
    return emojis[filling] || '🫓';
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

  return (
    <>
      <div
        className="group rounded-xl border border-brand-orange/50 bg-[#FBF8F4] p-6 shadow-[0_2px_12px_rgb(0_0_0_/_0.06)] transition-colors"
      >
        {/* Header: avatar + name + edit */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#E8E0D8]">
          <Avatar name={person.name} size="md" />
          {isEditingName ? (
            <form onSubmit={handleNameSubmit} className="flex-1 min-w-0">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={saveOrRevertName}
                className="w-full rounded-xl px-4 py-2.5 text-base font-medium text-primary bg-white border-2 border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-focus-ring focus:ring-offset-0 placeholder:text-placeholder"
                placeholder="Nombre"
                autoFocus
                aria-label="Editar nombre"
              />
            </form>
          ) : (
            <>
              <h3 className="font-semibold text-primary text-base flex-1 min-w-0 truncate">
                {person.name}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingName(true)}
                className="shrink-0 p-2 rounded-full text-primary group-hover:text-brand-orange transition-colors hover:bg-brand-focus-ring/20"
                aria-label="Editar nombre"
              >
                <PencilIcon />
              </button>
            </>
          )}
        </div>

        {/* Body: empty state or items list */}
        <div className="pt-4 space-y-4">
          {person.pupusas.length === 0 && person.beverages.length === 0 ? (
            <p className="text-center py-4 text-secondary text-sm">
              Sin ítems agregados
            </p>
          ) : (
            <>
              {/* Pupusas list */}
              {person.pupusas.length > 0 && (
                <div className="space-y-2">
                  {person.pupusas.map((pupusa) => (
                    <div
                      key={pupusa.id}
                      className="flex items-start justify-between bg-white/60 px-4 py-3 rounded-lg border border-neutral-border"
                    >
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <span className="text-lg shrink-0">{getFillingEmoji(pupusa.filling)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-primary font-medium text-sm">
                            {getFillingDisplayName(pupusa.filling, pupusa.withCheese)}
                          </div>
                          <div className="text-secondary text-xs mt-0.5 flex flex-wrap gap-x-2">
                            <span>{getDoughDisplayName(pupusa.dough)}</span>
                            <span>•</span>
                            <span>{getSizeDisplayName(pupusa.size)}</span>
                            <span>•</span>
                            <span className="font-semibold text-action-green">${pupusa.priceUSD.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-primary font-medium text-sm">x{pupusa.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleRemovePupusa(pupusa.id)}
                          className="text-brand-orange hover:text-brand-orange-hover w-7 h-7 flex items-center justify-center rounded-md hover:bg-brand-focus-ring/20 transition-colors"
                          aria-label="Quitar"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Beverages list */}
              {person.beverages.length > 0 && (
                <div className="space-y-2">
                  {person.beverages.map((beverage) => (
                    <div
                      key={beverage.id}
                      className="flex items-start justify-between bg-white/60 px-4 py-3 rounded-lg border border-neutral-border"
                    >
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <span className="text-lg shrink-0">🥤</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-primary font-medium text-sm">{beverage.name}</div>
                          <div className="text-secondary text-xs mt-0.5">
                            <span className="font-semibold text-action-green">${beverage.priceUSD.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-primary font-medium text-sm">x{beverage.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBeverage(beverage.id)}
                          className="text-brand-orange hover:text-brand-orange-hover w-7 h-7 flex items-center justify-center rounded-md hover:bg-brand-focus-ring/20 transition-colors"
                          aria-label="Quitar bebida"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Two compact action buttons - always in one row to save space */}
          <div className="flex flex-row gap-1.5">
            <button
              type="button"
              onClick={() => setShowPupusaForm(true)}
              className="flex-1 min-w-0 rounded-lg py-2.5 px-3 flex items-center justify-center gap-1.5 border-2 border-dashed border-[#DCD1C4] text-brand-orange font-medium text-sm hover:bg-brand-focus-ring/20 hover:border-brand-orange/50 transition-all duration-200"
              aria-label="Agregar pupusa"
            >
              <span className="text-base leading-none">+</span>
              <span className="text-lg leading-none" aria-hidden>🫓</span>
            </button>
            <button
              type="button"
              onClick={() => setShowBeverageForm(true)}
              className="flex-1 min-w-0 rounded-lg py-2.5 px-3 flex items-center justify-center gap-1.5 border-2 border-dashed border-[#DCD1C4] text-brand-orange font-medium text-sm hover:bg-brand-focus-ring/20 hover:border-brand-orange/50 transition-all duration-200"
              aria-label="Agregar bebida"
            >
              <span className="text-base leading-none">+</span>
              <span className="text-lg leading-none" aria-hidden>🥤</span>
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showPupusaForm}
        onClose={handleClosePupusaModal}
        title="Agregar Pupusa"
      >
        <PupusaForm
          onAdd={handleAddPupusa}
          onCancel={handleClosePupusaModal}
          defaultPrice={person.pupusas.length > 0 ? person.pupusas[person.pupusas.length - 1].priceUSD : 0.50}
          isOpen={showPupusaForm}
        />
      </Modal>
      <Modal
        isOpen={showBeverageForm}
        onClose={handleCloseBeverageModal}
        title="Agregar bebida"
      >
        <BeverageForm
          onAdd={handleAddBeverage}
          onCancel={handleCloseBeverageModal}
          defaultPrice={person.beverages.length > 0 ? person.beverages[person.beverages.length - 1].priceUSD : 1.00}
          isOpen={showBeverageForm}
        />
      </Modal>
    </>
  );
}
