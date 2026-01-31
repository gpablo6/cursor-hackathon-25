import { useState, Suspense } from 'react';
import { Toaster } from 'sonner';
import { ClipboardList, ChefHat, BarChart3 } from 'lucide-react';
import { WaiterView } from '../features/pupuseria/WaiterView';
import { KitchenView } from '../features/pupuseria/KitchenView';
import { DashboardView } from '../features/pupuseria/DashboardView';
import logoImg from '../assets/Logo_Pupas.png';

type TabType = 'mesero' | 'cocina' | 'dashboard';

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-4xl mb-4">🫓</div>
        <p className="text-pupuseria-chicharron font-medium">Cargando...</p>
      </div>
    </div>
  );
}

export function Pupuseria() {
  const [activeTab, setActiveTab] = useState<TabType>('mesero');

  return (
    <div className="min-h-screen bg-pupuseria-crema font-dm-sans">
      <Toaster position="bottom-right" richColors />
      
      {/* Header with Logo and Tabs */}
      <header className="bg-white border-b-2 border-neutral-border text-primary shadow-sm sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src={logoImg}
                alt="PUPAS"
                className="h-10 w-auto object-contain"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('mesero')}
                className={`btn-tab-3d ${
                  activeTab === 'mesero'
                    ? 'btn-tab-3d-active'
                    : 'border border-neutral-border bg-surface text-primary shadow-[0_4px_0_0_#D4CBC0] hover:bg-app hover:border-neutral-disabled-text active:shadow-[0_2px_0_0_#D4CBC0]'
                }`}
              >
                <ClipboardList className="w-5 h-5" />
                Mesero
              </button>
              <button
                onClick={() => setActiveTab('cocina')}
                className={`btn-tab-3d ${
                  activeTab === 'cocina'
                    ? 'btn-tab-3d-active'
                    : 'border border-neutral-border bg-surface text-primary shadow-[0_4px_0_0_#D4CBC0] hover:bg-app hover:border-neutral-disabled-text active:shadow-[0_2px_0_0_#D4CBC0]'
                }`}
              >
                <ChefHat className="w-5 h-5" />
                Cocina
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`btn-tab-3d ${
                  activeTab === 'dashboard'
                    ? 'btn-tab-3d-active'
                    : 'border border-neutral-border bg-surface text-primary shadow-[0_4px_0_0_#D4CBC0] hover:bg-app hover:border-neutral-disabled-text active:shadow-[0_2px_0_0_#D4CBC0]'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1920px] mx-auto">
        <Suspense fallback={<LoadingFallback />}>
          {activeTab === 'mesero' && <WaiterView />}
          {activeTab === 'cocina' && <KitchenView />}
          {activeTab === 'dashboard' && <DashboardView />}
        </Suspense>
      </main>
    </div>
  );
}
