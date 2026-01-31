import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <>
      {/* CTA Section */}
      <section className="bg-[#FFF8EE] py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border-2 border-[#F4C430] rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-[#F4C430]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🫓</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#7A4A2E] mb-4">
              ¿Listo para modernizar tu pupusería?
            </h2>
            <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">
              Únete a cientos de pupuserías que ya confían en PUPAS. Comienza gratis, sin tarjeta de crédito.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-[#F4C430] text-[#7A4A2E] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#E5B520] transition-colors flex items-center gap-2 shadow-[0_4px_0_0_#D4A520] active:translate-y-0.5 active:shadow-[0_2px_0_0_#D4A520]">
                Crear Cuenta Gratis
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                to="/pupas"
                className="bg-[#4CAF50] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#45A049] transition-colors inline-block text-center"
              >
                Probar Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#7A4A2E] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="mb-4">
                <span className="text-2xl font-bold">Pupas</span>
              </div>
              <p className="text-white/80 text-sm">
                El sistema de gestión #1 para pupuserías en El Salvador y Centroamérica.
              </p>
            </div>

            {/* Producto */}
            <div>
              <h3 className="font-bold mb-4">Producto</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>
                  <Link to="#caracteristicas" className="hover:text-white transition-colors">
                    Características
                  </Link>
                </li>
                <li>
                  <Link to="#precios" className="hover:text-white transition-colors">
                    Precios
                  </Link>
                </li>
                <li>
                  <Link to="/pupas" className="hover:text-white transition-colors">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h3 className="font-bold mb-4">Empresa</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sobre nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Términos de servicio
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacidad
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/80 text-sm">
              ©2024 PUPAS. Hecho con ❤️ en El Salvador.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
