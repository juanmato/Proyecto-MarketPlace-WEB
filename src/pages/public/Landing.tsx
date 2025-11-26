import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServicComboLogo } from '../../components/ServicComboLogo';
import { Button } from '../../components/design-system/Button';
import { 
  Users, 
  Wrench, 
  Package, 
  CheckCircle,
  TrendingUp,
  Shield,
  Clock,
  Search,
  ChevronDown,
  Star,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const perfiles = [
    {
      title: 'Solicitante',
      icon: Users,
      description: 'Publica servicios, compara cotizaciones y elige la mejor combinación de servicio e insumos.',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      title: 'Proveedor de Servicios',
      icon: Wrench,
      description: 'Ofrece tu mano de obra, envía cotizaciones y gestiona tus servicios asignados.',
      color: 'bg-emerald-100 text-emerald-700'
    },
    {
      title: 'Proveedor de Insumos',
      icon: Package,
      description: 'Crea packs de materiales asociados a servicios y asegura entregas en tiempo y forma.',
      color: 'bg-orange-100 text-orange-700'
    }
  ];

  const pasos = [
    {
      numero: '01',
      title: 'Publica el servicio',
      description: 'El solicitante publica un servicio con fecha, ciudad y categoría.',
      icon: Search
    },
    {
      numero: '02',
      title: 'Recibe cotizaciones',
      description: 'Los proveedores de servicios envían cotizaciones con precio y plazo.',
      icon: TrendingUp
    },
    {
      numero: '03',
      title: 'Packs de insumos',
      description: 'Los proveedores de insumos crean packs con los materiales necesarios.',
      icon: Package
    },
    {
      numero: '04',
      title: 'Elige y confirma',
      description: 'El solicitante elige la combinación que mejor se adapta a su necesidad.',
      icon: CheckCircle
    }
  ];

  const beneficios = [
    {
      icon: Shield,
      title: 'Transparencia en precios',
      description: 'Compara precios y plazos de múltiples proveedores en un solo lugar.'
    },
    {
      icon: TrendingUp,
      title: 'Comparación simple',
      description: 'Visualiza y ordena cotizaciones por precio, plazo o rating fácilmente.'
    },
    {
      icon: Package,
      title: 'Gestión integrada',
      description: 'Coordina servicios e insumos desde una única plataforma.'
    },
    {
      icon: Clock,
      title: 'Seguimiento en tiempo real',
      description: 'Visibilidad del estado: publicado, en evaluación, asignado, completado.'
    }
  ];

  const testimonios = [
    {
      name: 'María González',
      role: 'Solicitante',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      text: 'ServiCombo me permitió encontrar el mejor proveedor para la limpieza de mi jardín. ¡Los insumos llegaron justo a tiempo!',
      rating: 5
    },
    {
      name: 'Carlos Ramírez',
      role: 'Proveedor de Servicios',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
      text: 'Como proveedor, puedo enviar cotizaciones rápidamente y gestionar todos mis trabajos desde un solo lugar.',
      rating: 5
    },
    {
      name: 'Ana Silva',
      role: 'Proveedor de Insumos',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
      text: 'Crear packs personalizados para cada servicio me ayudó a aumentar mis ventas un 40% en 3 meses.',
      rating: 5
    }
  ];

  const faqs = [
    {
      question: '¿Cuánto cuesta usar la plataforma?',
      answer: 'ServiCombo es gratis para solicitantes. Los proveedores pagan una pequeña comisión solo cuando cierran un servicio.'
    },
    {
      question: '¿Cómo publico un nuevo servicio?',
      answer: 'Una vez registrado, haz clic en "Publicar Servicio", completa los detalles (título, descripción, categoría, ubicación, fecha) y opcionalmente agrega los insumos que necesitas.'
    },
    {
      question: '¿Puedo ser proveedor de servicios y de insumos a la vez?',
      answer: 'Actualmente cada cuenta está asociada a un tipo de perfil. Sin embargo, puedes crear dos cuentas con diferentes emails si deseas participar en ambos roles.'
    },
    {
      question: '¿Cómo sé que los proveedores son confiables?',
      answer: 'Cada proveedor tiene un rating público basado en trabajos anteriores. Además, puedes ver sus cotizaciones detalladas y comparar múltiples opciones.'
    },
    {
      question: '¿Qué categorías de servicios están disponibles?',
      answer: 'Actualmente ofrecemos: Jardinería, Piscinas, Limpieza y Otros. Estamos constantemente agregando nuevas categorías según la demanda.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <ServicComboLogo size="small" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('como-funciona')}
                className="text-slate-600 hover:text-[#1D3557] transition-colors"
              >
                Cómo funciona
              </button>
              <button
                onClick={() => scrollToSection('beneficios')}
                className="text-slate-600 hover:text-[#1D3557] transition-colors"
              >
                Beneficios
              </button>
              <button
                onClick={() => scrollToSection('perfiles')}
                className="text-slate-600 hover:text-[#1D3557] transition-colors"
              >
                Perfiles
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-slate-600 hover:text-[#1D3557] transition-colors"
              >
                Preguntas frecuentes
              </button>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
              >
                Iniciar sesión
              </Button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-[#1D3557] text-white rounded-lg hover:bg-[#14273f] transition-colors"
              >
                Crear cuenta
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-600" />
              ) : (
                <Menu className="w-6 h-6 text-slate-600" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => scrollToSection('como-funciona')}
                  className="px-4 py-2 text-left text-slate-600 hover:bg-slate-50 rounded-lg"
                >
                  Cómo funciona
                </button>
                <button
                  onClick={() => scrollToSection('beneficios')}
                  className="px-4 py-2 text-left text-slate-600 hover:bg-slate-50 rounded-lg"
                >
                  Beneficios
                </button>
                <button
                  onClick={() => scrollToSection('perfiles')}
                  className="px-4 py-2 text-left text-slate-600 hover:bg-slate-50 rounded-lg"
                >
                  Perfiles
                </button>
                <button
                  onClick={() => scrollToSection('faq')}
                  className="px-4 py-2 text-left text-slate-600 hover:bg-slate-50 rounded-lg"
                >
                  Preguntas frecuentes
                </button>
                <div className="flex flex-col gap-2 mt-4 px-4">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/login')}
                  >
                    Iniciar sesión
                  </Button>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full px-4 py-2 bg-[#1D3557] text-white rounded-lg hover:bg-[#14273f] transition-colors"
                  >
                    Crear cuenta
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1D3557] via-[#1D3557] to-[#2A9D8F] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#F4A261] rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6 text-white">
                Servicios y materiales, coordinados en un solo lugar
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Publicá un servicio, recibí cotizaciones de proveedores y asegurá que los insumos 
                lleguen a tiempo para el trabajo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-[#F4A261] text-white rounded-lg hover:bg-[#e89451] transition-colors shadow-lg text-lg"
                >
                  Crear cuenta gratis
                </button>
                <button
                  onClick={() => scrollToSection('como-funciona')}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors border border-white/20 text-lg"
                >
                  Ver cómo funciona
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/20">
                <div>
                  <p className="text-3xl mb-1">500+</p>
                  <p className="text-sm text-blue-200">Servicios activos</p>
                </div>
                <div>
                  <p className="text-3xl mb-1">1,200+</p>
                  <p className="text-sm text-blue-200">Proveedores</p>
                </div>
                <div>
                  <p className="text-3xl mb-1">95%</p>
                  <p className="text-sm text-blue-200">Satisfacción</p>
                </div>
              </div>
            </div>

            {/* Right Content - Mock UI */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 text-slate-900">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                      Publicado
                    </span>
                  </div>
                  <h3 className="mb-2">Limpieza de jardín con poda</h3>
                  <p className="text-sm text-slate-600 mb-4">Santiago • 25 Nov 2025</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">María González</span>
                        <span className="text-sm text-blue-600">$85,000</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        2 días
                      </div>
                    </div>
                    
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Pack Insumos</span>
                        <span className="text-sm text-emerald-600">$38,500</span>
                      </div>
                      <div className="text-xs text-slate-500">10 items incluidos</div>
                    </div>
                  </div>

                  <button className="w-full py-2 bg-[#1D3557] text-white rounded-lg text-sm">
                    Ver todas las cotizaciones
                  </button>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-[#F4A261] text-white px-4 py-2 rounded-full shadow-lg text-sm">
                  3 cotizaciones
                </div>
                <div className="absolute -bottom-4 -left-4 bg-[#2A9D8F] text-white px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  4.8 rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perfiles Section */}
      <section id="perfiles" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl text-[#1D3557] mb-4">
              ¿Quién usa ServiCombo?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Nuestra plataforma conecta a tres tipos de usuarios en un ecosistema colaborativo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {perfiles.map((perfil, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-shadow"
              >
                <div className={`w-16 h-16 rounded-2xl ${perfil.color} flex items-center justify-center mb-6`}>
                  <perfil.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl mb-3 text-[#1D3557]">{perfil.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {perfil.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo Funciona Section */}
      <section id="como-funciona" className="py-20 bg-[#F5F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl text-[#1D3557] mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Cuatro pasos simples para coordinar servicios e insumos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pasos.map((paso, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 h-full border border-slate-200 hover:shadow-lg transition-shadow">
                  <div className="text-5xl text-[#F4A261] mb-4 opacity-20">
                    {paso.numero}
                  </div>
                  <div className="w-12 h-12 bg-[#2A9D8F] text-white rounded-xl flex items-center justify-center mb-4">
                    <paso.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg mb-3 text-[#1D3557]">{paso.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {paso.description}
                  </p>
                </div>
                {index < pasos.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-[#F4A261]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios Section */}
      <section id="beneficios" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl text-[#1D3557] mb-4">
              Beneficios clave
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Todo lo que necesitas para gestionar servicios e insumos de forma eficiente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficios.map((beneficio, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#2A9D8F] to-[#1D3557] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <beneficio.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg mb-3 text-[#1D3557]">{beneficio.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {beneficio.description}
                </p>
              </div>
            ))}
          </div>

          {/* Status badges demo */}
          <div className="mt-16 p-8 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-200">
            <h4 className="text-center text-lg text-[#1D3557] mb-6">
              Visibilidad del estado en tiempo real
            </h4>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm">
                Publicado
              </span>
              <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                En Evaluación
              </span>
              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm">
                Asignado
              </span>
              <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                Completado
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios Section */}
      <section className="py-20 bg-[#F5F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl text-[#1D3557] mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Miles de usuarios ya confían en ServiCombo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonios.map((testimonio, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonio.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#F4A261] fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed">
                  "{testimonio.text}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonio.avatar}
                    alt={testimonio.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-[#1D3557]">{testimonio.name}</p>
                    <p className="text-sm text-slate-500">{testimonio.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl text-[#1D3557] mb-4">
              Preguntas frecuentes
            </h2>
            <p className="text-xl text-slate-600">
              Todo lo que necesitas saber sobre ServiCombo
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-lg text-[#1D3557]">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      openFaq === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#1D3557] to-[#2A9D8F] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a miles de usuarios que ya están coordinando servicios e insumos de forma eficiente
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-[#F4A261] text-white rounded-lg hover:bg-[#e89451] transition-colors shadow-lg text-lg"
          >
            Crear cuenta gratis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1D3557] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo y descripción */}
            <div className="md:col-span-2">
              <div className="mb-4">
                <ServicComboLogo size="small" />
              </div>
              <p className="text-blue-200 text-sm">
                La plataforma que conecta servicios e insumos en un solo lugar.
              </p>
            </div>

            {/* Enlaces */}
            <div>
              <h4 className="mb-4">Navegación</h4>
              <div className="space-y-2 text-sm">
                <button
                  onClick={() => scrollToSection('como-funciona')}
                  className="block text-blue-200 hover:text-white transition-colors"
                >
                  Cómo funciona
                </button>
                <button
                  onClick={() => scrollToSection('beneficios')}
                  className="block text-blue-200 hover:text-white transition-colors"
                >
                  Beneficios
                </button>
                <button
                  onClick={() => scrollToSection('perfiles')}
                  className="block text-blue-200 hover:text-white transition-colors"
                >
                  Perfiles
                </button>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="mb-4">Legal</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-blue-200 hover:text-white transition-colors">
                  Términos y condiciones
                </a>
                <a href="#" className="block text-blue-200 hover:text-white transition-colors">
                  Política de privacidad
                </a>
                <a href="#" className="block text-blue-200 hover:text-white transition-colors">
                  Ayuda
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/20 text-center text-sm text-blue-200">
            <p>&copy; 2025 ServiCombo. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
