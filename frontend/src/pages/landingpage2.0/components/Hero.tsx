import { ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative bg-[#FFF8EE] py-20 px-6 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 opacity-10">
        <div className="text-8xl">🫓</div>
      </div>
      <div className="absolute top-20 right-20 w-24 h-24 opacity-10">
        <div className="text-6xl">🌶️</div>
      </div>
      <div className="absolute bottom-20 left-20 w-28 h-28 opacity-10">
        <div className="text-7xl">🥬</div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Banner */}
        <div className="inline-flex items-center gap-2 bg-[#F4C430] text-[#7A4A2E] px-4 py-2 rounded-full mb-8 font-medium text-sm">
          <Zap className="w-4 h-4" />
          <span>Sistema #1 para Pupuserías en El Salvador</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6">
          <span className="text-[#7A4A2E]">Gestiona tu pupusería</span>
          <br />
          <span className="text-[#F4C430]">como un profesional</span>
        </h1>

        {/* Description */}
        <p className="text-xl text-secondary mb-10 max-w-2xl mx-auto">
          Pedidos, cocina, mesas y reportes en un solo lugar. Diseñado especialmente para la auténtica gastronomía salvadoreña.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button className="bg-[#F4C430] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#E5B520] transition-colors shadow-[0_4px_0_0_#D4A520] active:translate-y-0.5 active:shadow-[0_2px_0_0_#D4A520] flex items-center gap-2">
            Comenzar Gratis
            <ArrowRight className="w-5 h-5" />
          </button>
          <Link
            to="/pupas"
            className="bg-[#E5B520] text-[#7A4A2E] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#D4A520] transition-colors border-2 border-[#F4C430] inline-block text-center"
          >
            Ver Demo en Vivo
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-5xl font-extrabold text-[#7A4A2E] mb-2">0</div>
            <div className="text-secondary">Pupuserías activas</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-extrabold text-[#7A4A2E] mb-2">0</div>
            <div className="text-secondary">Pedidos procesados</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-extrabold text-[#7A4A2E] mb-2">0</div>
            <div className="text-secondary">Uptime garantizado</div>
          </div>
        </div>
      </div>
    </section>
  );
}
