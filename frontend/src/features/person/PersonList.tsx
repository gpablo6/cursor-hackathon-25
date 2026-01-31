import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../state/OrderContext';
import { Page } from '../../shared/layout/Page';
import { Header } from '../../shared/layout/Header';
import { PersonCard } from './PersonCard';
import { Button } from '../../shared/components/Button';
import { Modal } from '../../shared/components/Modal';

function PersonAddIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6" />
      <path d="M22 11h-6" />
    </svg>
  );
}

function ListIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  );
}

export function PersonList() {
  const { order, dispatch } = useOrder();
  const navigate = useNavigate();

  if (!order) {
    navigate('/');
    return null;
  }

  const totalItems = order.people.reduce(
    (sum, person) =>
      sum +
      person.pupusas.reduce((pSum, p) => pSum + p.quantity, 0) +
      person.beverages.reduce((bSum, b) => bSum + b.quantity, 0),
    0
  );

  const totalAmount = order.people.reduce(
    (sum, person) =>
      sum +
      person.pupusas.reduce((pSum, p) => pSum + p.quantity * p.priceUSD, 0) +
      person.beverages.reduce((bSum, b) => bSum + b.quantity * b.priceUSD, 0),
    0
  );

  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleBack = () => {
    if (totalItems > 0) {
      setShowConfirmReset(true);
    } else {
      dispatch({ type: 'RESET_ORDER' });
      navigate('/');
    }
  };

  const handleConfirmReset = () => {
    dispatch({ type: 'RESET_ORDER' });
    setShowConfirmReset(false);
    navigate('/');
  };

  const handleAddPerson = () => {
    dispatch({ type: 'ADD_PERSON' });
  };

  const handleGoToSummary = () => {
    navigate('/summary');
  };

  const personCount = order.people.length;
  const subtitle = `${personCount} persona${personCount !== 1 ? 's' : ''}`;

  return (
    <Page>
      <Header
        title={order.groupName}
        subtitle={subtitle}
        totalAmount={`$${totalAmount.toFixed(2)}`}
        onBack={handleBack}
      />

      <div className="px-5 py-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleAddPerson}
              disabled={order.people.length >= 20}
              className="inline-flex items-center gap-2 text-brand-orange hover:text-brand-orange-hover text-sm font-medium transition-colors disabled:text-neutral-disabled-text disabled:cursor-not-allowed"
            >
              <PersonAddIcon />
              <span>Agregar persona</span>
            </button>
          </div>
          {order.people.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>

        <div className="pt-6">
          <Button
            type="button"
            variant="primary"
            onClick={handleGoToSummary}
            className="w-full flex items-center justify-center gap-2"
          >
            <span className="shrink-0"><ListIcon /></span>
            <span>Ver resumen ({totalItems} ítems)</span>
          </Button>
        </div>
      </div>

      <Modal
        isOpen={showConfirmReset}
        onClose={() => setShowConfirmReset(false)}
        title="¿Estás seguro?"
      >
        <div className="space-y-4">
          <p className="text-secondary text-sm">
            Si volvés atrás se borrará toda la información del pedido y tendrás que crear el grupo de nuevo.
          </p>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowConfirmReset(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleConfirmReset}
              className="flex-1"
            >
              Sí, empezar de nuevo
            </Button>
          </div>
        </div>
      </Modal>
    </Page>
  );
}
