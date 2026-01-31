import { Search, Plus, Minus } from 'lucide-react';
import type { MenuItemType } from '../../../types/pupuseria';

interface MenuPupusasProps {
  menuItems: MenuItemType[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: 'pupusa' | 'bebida' | 'all';
  onCategoryChange: (category: 'pupusa' | 'bebida' | 'all') => void;
  onAddToOrder: (item: MenuItemType) => void;
  getItemQuantity: (itemId: string) => number;
  updateItemQuantity: (itemId: string, delta: number) => void;
}

export function MenuPupusas({
  menuItems,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onAddToOrder,
  getItemQuantity,
  updateItemQuantity,
}: MenuPupusasProps) {
  return (
    <div className="card-elevated">
      <h2 className="text-2xl font-bold text-pupuseria-chicharron mb-4">
        Menú de Pupusas
      </h2>

      {/* Search Input */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar pupusas o bebidas..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-pupuseria-maiz focus:border-pupuseria-maiz bg-white"
          />
        </div>
      </div>

      {/* Category Filter Menu - Horizontal Scroll (hidden when searching) */}
      {!searchQuery.trim() && (
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scroll-horizontal-touch">
            <button
              onClick={() => onCategoryChange('all')}
              className={`shrink-0 btn-category-3d ${
                selectedCategory === 'all'
                  ? 'btn-category-3d-active'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todo
            </button>
            <button
              onClick={() => onCategoryChange('pupusa')}
              className={`shrink-0 btn-category-3d ${
                selectedCategory === 'pupusa'
                  ? 'btn-category-3d-active'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pupusas
            </button>
            <button
              onClick={() => onCategoryChange('bebida')}
              className={`shrink-0 btn-category-3d ${
                selectedCategory === 'bebida'
                  ? 'btn-category-3d-active'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Bebidas
            </button>
          </div>
        </div>
      )}

      {/* Menu Items - Horizontal Scroll */}
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scroll-horizontal-touch">
        {menuItems.map(item => {
          const quantity = getItemQuantity(item.id);
          return (
            <div
              key={item.id}
              className="shrink-0 w-48 bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-pupuseria-maiz transition-all"
            >
              <div className="flex flex-col items-center text-center mb-3">
                <span className="text-5xl mb-2">{item.emoji}</span>
                <h3 className="font-bold text-base text-pupuseria-chicharron mb-1">
                  {item.nombre}
                </h3>
                <p className="text-pupuseria-maiz font-bold text-lg mb-2">
                  ${item.precio.toFixed(2)}
                </p>
                <span className="text-xs text-gray-500 font-medium uppercase">
                  {item.categoria === 'pupusa' ? 'PUPUSA' : 'BEBIDA'}
                </span>
              </div>
              
              {/* Quantity Controls */}
              {quantity > 0 ? (
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => updateItemQuantity(item.id, -1)}
                    className="w-10 h-10 rounded-xl border border-neutral-border bg-surface text-primary font-bold text-lg shadow-[0_4px_0_0_#D4CBC0] hover:bg-app active:translate-y-0.5 active:shadow-[0_2px_0_0_#D4CBC0] transition-all duration-200 flex items-center justify-center shrink-0"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="font-bold text-2xl text-pupuseria-chicharron w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateItemQuantity(item.id, 1)}
                    className="w-10 h-10 rounded-xl border border-neutral-border bg-surface text-primary font-bold text-lg shadow-[0_4px_0_0_#D4CBC0] hover:bg-app active:translate-y-0.5 active:shadow-[0_2px_0_0_#D4CBC0] transition-all duration-200 flex items-center justify-center shrink-0"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onAddToOrder(item)}
                  className="btn-3d-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Agregar
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
