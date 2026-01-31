import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../state/OrderContext';
import { Page } from '../../shared/layout/Page';
import { Button } from '../../shared/components/Button';
import logoImg from '../../assets/Logo_Pupas.png';

function PeopleIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function GroupForm() {
  const [groupName, setGroupName] = useState('');
  const [peopleCount, setPeopleCount] = useState(2);
  const { dispatch } = useOrder();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = groupName.trim();
    if (!trimmed || trimmed.length <= 3) return;

    dispatch({
      type: 'CREATE_GROUP',
      payload: { groupName: trimmed, peopleCount },
    });

    navigate('/order');
  };

  useEffect(() => {
    const { documentElement, body } = document;
    const prevHtml = documentElement.style.overflow;
    const prevBody = body.style.overflow;
    documentElement.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      documentElement.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, []);

  return (
    <Page noScroll>
      <div className="px-5 py-12">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logoImg} alt="Pupas" className="h-20 w-auto object-contain" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <p className="text-secondary text-base">
            Ordena pupusas fácil y rápido
          </p>
          <span className="text-lg">🇸🇻</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7 mt-10">
          <div>
            <label
              htmlFor="groupName"
              className="block text-sm font-medium text-primary mb-2.5"
            >
              Nombre del Crew
            </label>
            <input
              id="groupName"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ej: Mesa 3 - Familia López - Los Arturos"
              className="input-brand"
              required
              minLength={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-3">
              Número de personas
            </label>
            <div className="flex items-center justify-center gap-5 py-2">
              <Button
                type="button"
                variant="minimal"
                onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                disabled={peopleCount <= 1}
                className="w-14 h-14 flex items-center justify-center p-0 rounded-full !min-w-0 text-xl"
              >
                -
              </Button>
              <div className="flex items-center gap-3">
                <span className="shrink-0 text-brand-orange inline-flex" aria-hidden>
                  <PeopleIcon className="w-8 h-8" />
                </span>
                <span className="w-12 text-center font-semibold text-primary text-2xl">{peopleCount}</span>
              </div>
              <Button
                type="button"
                variant="minimal"
                onClick={() => setPeopleCount(Math.min(20, peopleCount + 1))}
                disabled={peopleCount >= 20}
                className="w-14 h-14 flex items-center justify-center p-0 rounded-full !min-w-0 text-xl"
              >
                +
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-8"
            disabled={groupName.trim().length <= 3}
          >
            ¡Pidamos!
          </Button>
        </form>
      </div>
    </Page>
  );
}
