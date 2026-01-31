import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Básico',
    subtitle: 'Para empezar',
    price: '$15',
    period: '/mes',
    features: [
      'Hasta 5 mesas',
      '1 usuario',
      'Reportes básicos',
      'Soporte por email',
    ],
    cta: 'Elegir Plan',
    popular: false,
  },
  {
    name: 'Profesional',
    subtitle: 'Para crecer',
    price: '$35',
    period: '/mes',
    features: [
      'Mesas ilimitadas',
      '5 usuarios',
      'Vista de cocina TV',
      'Reportes avanzados',
      'Soporte prioritario',
    ],
    cta: 'Elegir Plan',
    popular: true,
  },
  {
    name: 'Empresa',
    subtitle: 'Para cadenas',
    price: '$99',
    period: '/mes',
    features: [
      'Múltiples sucursales',
      'Usuarios ilimitados',
      'API personalizada',
      'Gerente de cuenta',
    ],
    cta: 'Contactar Ventas',
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="precios" className="bg-[#FFF8EE] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#7A4A2E] mb-4">
            Planes simples y transparentes
          </h2>
          <p className="text-xl text-secondary">
            Sin costos ocultos. Cancela cuando quieras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 border-2 ${
                plan.popular
                  ? 'border-[#F4C430] shadow-xl relative'
                  : 'border-neutral-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#F4C430] text-[#7A4A2E] px-4 py-1 rounded-full text-sm font-bold">
                  Más Popular
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-[#7A4A2E] mb-2">
                  {plan.name}
                </h3>
                <p className="text-secondary mb-4">{plan.subtitle}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-extrabold text-[#7A4A2E]">
                    {plan.price}
                  </span>
                  <span className="text-secondary">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#4CAF50] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  plan.popular
                    ? 'bg-[#F4C430] text-white hover:bg-[#E5B520] shadow-[0_4px_0_0_#D4A520] active:translate-y-0.5 active:shadow-[0_2px_0_0_#D4A520]'
                    : 'bg-gradient-to-r from-[#F4C430] to-[#E5B520] text-[#7A4A2E] hover:from-[#E5B520] hover:to-[#D4A520]'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
