import { Link } from 'react-router-dom';
import logoImg from '../../../assets/Logo_Pupas.png';

export function Header() {
  return (
    <header className="bg-white border-b border-neutral-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/pupas" className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="PUPAS"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="#caracteristicas" className="text-secondary hover:text-brand-orange transition-colors">
              Características
            </Link>
            <Link to="#precios" className="text-secondary hover:text-brand-orange transition-colors">
              Precios
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button className="text-secondary hover:text-brand-orange transition-colors hidden md:block">
              Iniciar Sesión
            </button>
            <button className="bg-[#F4C430] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#E5B520] transition-colors shadow-[0_4px_0_0_#D4A520] active:translate-y-0.5 active:shadow-[0_2px_0_0_#D4A520]">
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
