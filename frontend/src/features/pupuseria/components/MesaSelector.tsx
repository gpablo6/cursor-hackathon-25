import { MESAS } from '../../../types/pupuseria';
import { Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MesaSelectorProps {
  selectedMesa: number | null;
  onSelectMesa: (mesa: number | null) => void;
  onPayMesa?: (mesa: number) => void;
}

export function MesaSelector({ selectedMesa, onSelectMesa, onPayMesa }: MesaSelectorProps) {
  const [, setRefreshKey] = useState(0);

  // Get occupied tables from localStorage
  const getOccupiedMesas = (): number[] => {
    const orders = JSON.parse(localStorage.getItem('pupuseria-orders') || '[]') as Array<{ status: string; mesa: number }>;
    const activeOrders = orders.filter((o) => 
      o.status === 'pendiente' || o.status === 'preparando'
    );
    return [...new Set(activeOrders.map((o) => o.mesa))];
  };

  // Listen for storage changes to update occupied mesas
  useEffect(() => {
    const handleStorageChange = () => {
      setRefreshKey(prev => prev + 1);
    };

    // Listen for storage events (from other tabs/windows)
    window.addEventListener('storage', handleStorageChange);
    
    // Poll for changes every second (for same-tab updates)
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const occupiedMesas = getOccupiedMesas();

  return (
    <div className="card-elevated p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-pupuseria-chicharron">
          Selecciona Mesa
        </h2>
        
        {/* Legend - Top Right */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-pupuseria-curtido"></div>
            <span className="text-pupuseria-chicharron font-medium">Libre</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-pupuseria-salsa"></div>
            <span className="text-pupuseria-chicharron font-medium">Ocupada</span>
          </div>
        </div>
      </div>

      {/* Table Grid - 2 rows x 5 columns */}
      <div className="grid grid-cols-5 gap-2">
        {MESAS.map(mesa => {
          const isOccupied = occupiedMesas.includes(mesa);
          const isSelected = selectedMesa === mesa;
          
          return (
            <div key={mesa} className="relative">
              <button
                onClick={() => {
                  if (!isOccupied) {
                    onSelectMesa(isSelected ? null : mesa);
                  }
                }}
                disabled={isOccupied}
                className={`
                  relative h-16 w-full flex flex-col items-center justify-center
                  ${isSelected
                    ? 'mesa-card'
                    : isOccupied
                    ? 'mesa-card-ocupada'
                    : 'mesa-card-libre'
                  }
                  ${isOccupied ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {/* Checkmark in top right when selected */}
                {isSelected && (
                  <div className="absolute top-1 right-1">
                    <Check className="w-4 h-4 text-pupuseria-chicharron" strokeWidth={3} />
                  </div>
                )}
                
                {/* Table icon - Minimalist Mesa */}
                <div className="mb-1">
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    className={`${
                      isSelected ? 'text-pupuseria-chicharron' : 
                      isOccupied ? 'text-pupuseria-salsa' : 
                      'text-gray-400'
                    }`}
                    stroke="currentColor" 
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {/* Mesa top - superficie */}
                    <rect x="3" y="6" width="18" height="12" rx="1"/>
                    {/* Pata izquierda */}
                    <line x1="6" y1="18" x2="6" y2="22"/>
                    {/* Pata derecha */}
                    <line x1="18" y1="18" x2="18" y2="22"/>
                    {/* Pata frontal izquierda */}
                    <line x1="3" y1="10" x2="3" y2="14"/>
                    {/* Pata frontal derecha */}
                    <line x1="21" y1="10" x2="21" y2="14"/>
                  </svg>
                </div>
                
                {/* Table number */}
                <span className={`text-xl font-extrabold ${
                  isSelected ? 'text-pupuseria-chicharron' : 
                  isOccupied ? 'text-pupuseria-salsa' : 
                  'text-pupuseria-chicharron'
                }`}>
                  {mesa}
                </span>
                
                {/* Occupied label with icon */}
                {isOccupied && !isSelected && (
                  <div className="absolute bottom-0.5 flex items-center gap-0.5">
                    <span className="text-[10px]">👥</span>
                    <span className="text-[10px] bg-pupuseria-salsa text-white px-1.5 py-0.5 rounded font-bold">
                      OCUPADA
                    </span>
                  </div>
                )}
              </button>
              
              {/* Pay Button - appears when mesa is occupied */}
              {isOccupied && onPayMesa && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPayMesa(mesa);
                  }}
                  className="w-full mt-2 px-3 py-2 rounded-xl bg-brand-orange text-white font-medium text-xs shadow-[0_4px_0_0_#D9641F] hover:bg-brand-orange-hover active:translate-y-0.5 active:shadow-[0_2px_0_0_#D9641F] transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  <span className="text-sm">💵</span>
                  PAGAR
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
