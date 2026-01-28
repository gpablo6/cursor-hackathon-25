import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Person } from '../../models/Person';
import type { Pupusa, DoughType, Filling } from '../../models/Pupusa';
import { useOrder } from '../../state/OrderContext';
import { Modal } from '../../shared/components/Modal';
import { PupusaForm } from './PupusaForm';

function PersonIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function PencilIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

interface PersonCardProps {
  person: Person;
}

export function PersonCard({ person }: PersonCardProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(person.name);
  const [showPupusaForm, setShowPupusaForm] = useState(false);
  const [avatarGifUrl, setAvatarGifUrl] = useState<string | null>(null);
  const { dispatch } = useOrder();

  useEffect(() => {
    const key = import.meta.env.VITE_GIPHY_API_KEY;
    const tag = 'cute cats';
    const url = `https://api.giphy.com/v1/gifs/random?api_key=${key}&tag=${encodeURIComponent(tag)}`;
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        const img = json?.data?.images?.fixed_height_small?.url ?? json?.data?.images?.downsized_small?.url;
        if (img) setAvatarGifUrl(img);
      })
      .catch(() => { });
  }, [person.id]);

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

  const handleCloseModal = () => {
    setShowPupusaForm(false);
  };

  const handleRemovePupusa = (pupusaId: string) => {
    dispatch({
      type: 'REMOVE_PUPUSA',
      payload: { personId: person.id, pupusaId },
    });
  };

  const getFillingDisplayName = (filling: Filling): string => {
    const names: Record<Filling, string> = {
      queso: 'Queso',
      frijoles_con_queso: 'Frijoles con Queso',
      revueltas: 'Revueltas',
      chicharron: 'Chicharrón',
      chicharron_con_queso: 'Chicharrón con Queso',
      loroco_con_queso: 'Loroco con Queso',
      ayote: 'Ayote',
      jalapeno: 'Jalapeño',
      camaron: 'Camarón',
      pollo: 'Pollo',
      loca: 'Loca',
    };
    return names[filling] || filling;
  };

  const getFillingEmoji = (filling: Filling): string => {
    const emojis: Record<Filling, string> = {
      queso: '🧀',
      frijoles_con_queso: '🫘',
      revueltas: '🥓',
      chicharron: '🐷',
      chicharron_con_queso: '🐷',
      loroco_con_queso: '🌸',
      ayote: '🎃',
      jalapeno: '🌶️',
      camaron: '🦐',
      pollo: '🍗',
      loca: '🌮',
    };
    return emojis[filling] || '🫓';
  };

  const getDoughDisplayName = (dough: DoughType): string => {
    return dough === 'maiz' ? 'Maíz' : 'Arroz';
  };

  return (
    <>
      <div
        className="group rounded-xl border border-brand-orange/50 bg-[#FBF8F4] p-6 shadow-[0_2px_12px_rgb(0_0_0_/_0.06)] transition-colors"
      >
        {/* Header: avatar + name + edit */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#E8E0D8]">
          <span
            className={`shrink-0 flex w-10 h-10 items-center justify-center rounded-full overflow-hidden transition-all ${isEditingName
              ? 'bg-brand-focus-ring ring-2 ring-brand-orange text-brand-orange'
              : 'bg-[#F0E5D5] text-brand-orange ring-2 ring-transparent group-hover:ring-brand-orange'
              }`}
            aria-hidden
          >
            {avatarGifUrl ? (
              <img src={avatarGifUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <PersonIcon className="w-5 h-5" />
            )}
          </span>
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
          {person.pupusas.length === 0 ? (
            <p className="text-center py-4 text-secondary text-sm">
              Sin ítems agregados
            </p>
          ) : (
            <div className="space-y-2">
              {person.pupusas.map((pupusa) => (
                <div
                  key={pupusa.id}
                  className="flex items-center justify-between bg-white/60 px-4 py-3 rounded-lg border border-neutral-border"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getFillingEmoji(pupusa.filling)}</span>
                    <span className="text-primary font-medium text-sm">
                      {getFillingDisplayName(pupusa.filling)}
                    </span>
                    <span className="text-secondary text-sm">
                      {getDoughDisplayName(pupusa.dough)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-medium text-sm">x{pupusa.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePupusa(pupusa.id)}
                      className="text-secondary hover:text-primary w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-disabled-bg transition-colors"
                      aria-label="Quitar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Agregar ítem: dashed, flat, accent text */}
          <button
            type="button"
            onClick={() => setShowPupusaForm(true)}
            className="w-full rounded-xl py-4 px-4 flex items-center justify-center gap-2 border-2 border-dashed border-[#DCD1C4] text-brand-orange font-medium text-sm hover:bg-brand-focus-ring/20 hover:border-brand-orange/50 transition-all duration-200"
          >
            <span className="text-lg leading-none">+</span>
            <span>Agregar ítem</span>
          </button>
        </div>
      </div>

      <Modal
        isOpen={showPupusaForm}
        onClose={handleCloseModal}
        title="Agregar Pupusa"
      >
        <PupusaForm
          onAdd={handleAddPupusa}
          onCancel={handleCloseModal}
        />
      </Modal>
    </>
  );
}
