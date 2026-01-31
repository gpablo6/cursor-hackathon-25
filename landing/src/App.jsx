function App() {
  return (
    <>
      <main className="min-h-dvh flex flex-col items-center justify-center px-8 py-16 max-w-2xl mx-auto text-center">
      <img
          src="/Logo_Pupas.png"
          alt="Pupas"
          className="w-40 sm:w-52 md:w-64 h-auto object-contain mb-6"
        />

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
          Pupas
        </h1>
        <p className="text-lg leading-relaxed text-zinc-600">
          Un SaaS para gestionar pedidos de pupusas en El Salvador.
        </p>
        
        <a href="" className="bg-[#f07a2a] text-white border border-zinc-300 px-4 py-2 mt-4 rounded-lg cursor-pointer">
          Ver demo
        </a>
      </main>

      <section className="py-16 px-8 max-w-5xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-center mb-10">
          Simplifica el caos en los restaurantes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       {
        cards.map(({title, description})=> {
          return(
            <article className="bg-[#f07a2a] text-white border border-zinc-300 rounded-xl p-6 text-left">
            <h3 className="text-xl font-semibold mb-3">
              {title}
            </h3>
            <p className="text-[15px] text-gray-100 leading-relaxed">
              {description}
            </p>
          </article>
          )
        })
       }
    
        </div>
      </section>

      <section className="py-16 px-8 max-w-5xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-center mb-10">
          Precios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {pricingPlans.map((plan) => (
            <article
              key={plan.id}
              className={`rounded-xl border-2 p-6 text-left ${
                plan.popular
                  ? 'border-[#f07a2a] bg-[#f07a2a] text-white'
                  : 'border-zinc-300 bg-white text-zinc-900'
              }`}
            >
              {plan.popular && (
                <span className="inline-block text-sm font-semibold bg-white text-[#f07a2a] px-3 py-1 rounded-full mb-4">
                  Mejor valor
                </span>
              )}
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className="mb-6">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm opacity-90">/{plan.period}</span>
              </p>
              <ul className="space-y-2 text-sm">
                {plan.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <span
                      className={`shrink-0 ${plan.popular ? 'text-white' : 'text-[#f07a2a]'}`}
                    >
                      ✓
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16 px-8 max-w-5xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-center mb-10">
          Integrantes del proyecto
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {team.map((nombre) => (
            <article
              key={nombre}
              className="bg-[#f07a2a] text-white border border-zinc-300 rounded-xl p-6 text-center"
            >
              <p className="text-lg font-semibold">{nombre}</p>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <p className="text-zinc-600 text-center mb-3">Cursor Hackathon San Salvador 2025</p>
      </footer>
    </>
  )
}

export default App


const team = ['Giancarlo Pablo', 'Noé Lara', 'Nelson Hernández']

const pricingPlans = [
  {
    id: 'monthly',
    name: 'Mensual',
    price: '$15 USD',
    period: 'mes',
    popular: false,
    benefits: [
      'Pedidos en tiempo real entre mesero y cocina',
      'Pantalla grande en cocina (pendiente, preparando, listo)',
      'Tomar pedidos desde el celular',
      'Diseñado para pupuserías, fácil de usar',
      'Funciona en horas pico, sin equipos caros',
      'Dashboard de ventas del día y del mes',
      'Menos errores y servicio más rápido',
      'Soporte incluido',
    ],
  },
  {
    id: 'annual',
    name: 'Anual',
    price: '$120 USD',
    period: 'año',
    popular: true,
    benefits: [
      'Todo lo del plan mensual',
      'Ahorra $60 al año (equivale a $10/mes)',
      'Pedidos en tiempo real entre mesero y cocina',
      'Pantalla grande en cocina (pendiente, preparando, listo)',
      'Tomar pedidos desde el celular',
      'Diseñado para pupuserías, fácil de usar',
      'Funciona en horas pico, sin equipos caros',
      'Dashboard de ventas del día y del mes',
      'Menos errores y servicio más rápido',
      'Soporte prioritario',
    ],
  },
]

const cards = [
  {
    title: 'Orden y tiempo real',
    description: 'Sin pedidos desordenados, gritos a cocina ni errores. El sistema agiliza todo entre mesero y cocina: los pedidos se ven en tiempo real en una pantalla grande en cocina, con estados claros (pendiente, preparando, listo). Menos errores y servicio más rápido para una mejor experiencia del cliente.',
  },
  {
    title: 'Fácil de usar, hecho para ti',
    description: 'Muy fácil de usar, incluso para personal no técnico. Funciona perfecto en horas pico y está diseñado especialmente para pupuserías salvadoreñas. El mesero toma pedidos desde el celular; la cocina lo ve en pantalla grande o TV. Botones grandes y claros, sin equipos caros. Reduce el miedo al cambio tecnológico.',
  },
  {
    title: 'Ventas y confianza',
    description: 'Dashboard de ventas: ve ventas del día y del mes y entiende si tu negocio está mejorando. Sistema simple y de confianza, pensado para el día a día real del restaurante. Parte del ecosistema PUPAS: identidad local, moderna y profesional. Vende más, sirve más rápido y convierte visitas en contactos. ¿Quieres probarlo o una demo?',
  } 
]