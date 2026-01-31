import { FileText, ChefHat, BarChart3, Users, Tablet, Clock } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Gestión de Pedidos',
    description: 'Toma pedidos rápidamente con interfaz táctil optimizada para el ritmo de tu pupusería.',
    color: 'text-[#F4C430]',
  },
  {
    icon: ChefHat,
    title: 'Cocina Kanban',
    description: 'Vista de cocina estilo Kanban para TV. Organiza pedidos pendientes, en preparación y listos.',
    color: 'text-[#4CAF50]',
  },
  {
    icon: BarChart3,
    title: 'Reportes y Analytics',
    description: 'Visualiza ventas, productos populares y tendencias para tomar mejores decisiones.',
    color: 'text-[#E53935]',
  },
  {
    icon: Users,
    title: 'Control de Mesas',
    description: 'Visualiza el estado de cada mesa en tiempo real. Ocupadas, libres y por pagar.',
    color: 'text-[#F4C430]',
  },
  {
    icon: Tablet,
    title: '100% Responsive',
    description: 'Funciona perfectamente en tablets, celulares y pantallas de TV para la cocina.',
    color: 'text-[#4CAF50]',
  },
  {
    icon: Clock,
    title: 'Tiempo Real',
    description: 'Sincronización instantánea entre meseros y cocina. Sin retrasos ni confusiones.',
    color: 'text-[#E53935]',
  },
];

export function Features() {
  return (
    <section id="caracteristicas" className="bg-[#FFF8EE] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#7A4A2E] mb-4">
            Todo lo que necesitas para tu negocio
          </h2>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Herramientas poderosas diseñadas para el ritmo de una pupusería moderna
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border border-neutral-border hover:shadow-lg transition-shadow"
              >
                <div className={`w-16 h-16 rounded-xl bg-white border-2 border-neutral-border flex items-center justify-center mb-6 ${feature.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#7A4A2E] mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
