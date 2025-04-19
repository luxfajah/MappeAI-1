import { Link } from "wouter";
import LandingNavbar from "@/components/landing-navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function LandingPage() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col dark:bg-black bg-white">
      <LandingNavbar />
      
      {/* Hero Section */}
      <div className="relative dark:bg-black bg-white overflow-hidden pt-16">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 dark:bg-black bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg 
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 dark:text-black text-white transform translate-x-1/2" 
              fill="currentColor" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none" 
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <div className="pt-12"></div>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold dark:text-white text-gray-900 sm:text-5xl md:text-6xl font-poppins">
                  <span className="block xl:inline">Mapeie sua concorrência com</span>{' '}
                  <span className="block text-primary xl:inline">inteligência artificial</span>
                </h1>
                <p className="mt-3 text-base dark:text-gray-300 text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Obtenha insights valiosos sobre seus concorrentes, identifique oportunidades de mercado e tome decisões estratégicas baseadas em dados precisos.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-xl shadow-lg">
                    <Link href={user ? "/dashboard" : "/auth"}>
                      <div 
                        className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-xl text-white bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10 cursor-pointer transition-all"
                      >
                        Começar Agora
                      </div>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link href="#pricing">
                      <div 
                        className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-xl text-primary border border-primary dark:hover:bg-primary/10 hover:bg-gray-50 md:py-4 md:text-lg md:px-10 cursor-pointer transition-all"
                      >
                        Ver Planos
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-br from-primary/30 to-secondary/30 dark:from-primary/20 dark:to-primary/5 sm:h-72 md:h-96 lg:w-full lg:h-full"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 dark:bg-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase font-poppins">Recursos</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight dark:text-white text-gray-900 sm:text-4xl font-poppins">
              Análise de concorrência inteligente
            </p>
            <p className="mt-4 max-w-2xl text-xl dark:text-gray-300 text-gray-500 lg:mx-auto">
              Descubra como nossos recursos podem transformar sua estratégia de mercado com análises precisas e insights acionáveis.
            </p>
          </div>

          <div className="mt-12">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative p-6 dark:bg-gray-900/20 dark:backdrop-blur-md dark:border dark:border-gray-800 dark:rounded-xl transition-all hover:dark:bg-gray-900/30 group">
                <dt>
                  <div className="absolute flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="ml-20 text-lg leading-6 font-medium dark:text-white text-gray-900">Pesquisa automática</p>
                </dt>
                <dd className="mt-2 ml-20 text-base dark:text-gray-300 text-gray-500">
                  Colete dados de seus concorrentes automaticamente, economizando tempo e esforço na pesquisa manual.
                </dd>
              </div>

              <div className="relative p-6 dark:bg-gray-900/20 dark:backdrop-blur-md dark:border dark:border-gray-800 dark:rounded-xl transition-all hover:dark:bg-gray-900/30 group">
                <dt>
                  <div className="absolute flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="ml-20 text-lg leading-6 font-medium dark:text-white text-gray-900">Análise de dados</p>
                </dt>
                <dd className="mt-2 ml-20 text-base dark:text-gray-300 text-gray-500">
                  Processe grandes volumes de dados e extraia insights valiosos com nossos algoritmos avançados de IA.
                </dd>
              </div>

              <div className="relative p-6 dark:bg-gray-900/20 dark:backdrop-blur-md dark:border dark:border-gray-800 dark:rounded-xl transition-all hover:dark:bg-gray-900/30 group">
                <dt>
                  <div className="absolute flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="ml-20 text-lg leading-6 font-medium dark:text-white text-gray-900">Relatórios detalhados</p>
                </dt>
                <dd className="mt-2 ml-20 text-base dark:text-gray-300 text-gray-500">
                  Gere relatórios completos e personalizados para compartilhar com sua equipe ou stakeholders.
                </dd>
              </div>

              <div className="relative p-6 dark:bg-gray-900/20 dark:backdrop-blur-md dark:border dark:border-gray-800 dark:rounded-xl transition-all hover:dark:bg-gray-900/30 group">
                <dt>
                  <div className="absolute flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="ml-20 text-lg leading-6 font-medium dark:text-white text-gray-900">Insights estratégicos</p>
                </dt>
                <dd className="mt-2 ml-20 text-base dark:text-gray-300 text-gray-500">
                  Receba recomendações personalizadas baseadas nos dados analisados para melhorar sua estratégia de negócios.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="dark:bg-gray-900 bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase font-poppins">Preços</h2>
            <p className="mt-2 text-3xl font-extrabold dark:text-white text-gray-900 sm:text-4xl lg:text-5xl font-poppins">
              Planos para todos os tamanhos de negócios
            </p>
            <p className="mt-4 max-w-2xl text-xl dark:text-gray-300 text-gray-500 lg:mx-auto">
              Escolha o plano ideal para suas necessidades e comece a mapear sua concorrência com inteligência.
            </p>
          </div>

          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
            {/* Plano Gratuito */}
            <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
              <div className="p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 font-poppins">Gratuito</h3>
                <p className="mt-4 text-sm text-gray-500">
                  Perfeito para começar a explorar as funcionalidades básicas.
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">R$0</span>
                  <span className="text-base font-medium text-gray-500">/mês</span>
                </p>
                <Link href="/auth">
                  <div 
                    className="mt-8 block w-full bg-gray-100 border border-gray-800 rounded-md py-2 text-sm font-semibold text-gray-900 text-center hover:bg-gray-200 cursor-pointer"
                  >
                    Começar Grátis
                  </div>
                </Link>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide">O que está incluído:</h4>
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">5 pesquisas por mês</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">Análise básica de concorrentes</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">Relatórios simples</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">Suporte por email</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Plano Intermediário */}
            <div className="border border-primary-600 rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
              <div className="p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 font-poppins">Intermediário</h3>
                <p className="mt-4 text-sm text-gray-500">
                  Para empresas que buscam análises mais completas.
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">R$99</span>
                  <span className="text-base font-medium text-gray-500">/mês</span>
                </p>
                <Link href="/auth">
                  <div 
                    className="mt-8 block w-full rounded-md py-2 text-sm font-semibold text-white text-center bg-primary hover:bg-primary/90 cursor-pointer"
                  >
                    Experimente por 14 dias
                  </div>
                </Link>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide">O que está incluído:</h4>
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">30 pesquisas por mês</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">Análise avançada de concorrentes</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">Relatórios detalhados</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">Exportação em PDF</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">Suporte prioritário</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Plano Avançado */}
            <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
              <div className="p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 font-poppins">Avançado</h3>
                <p className="mt-4 text-sm text-gray-500">
                  Solução completa para empresas de médio e grande porte.
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">R$299</span>
                  <span className="text-base font-medium text-gray-500">/mês</span>
                </p>
                <Link href="/auth">
                  <div 
                    className="mt-8 block w-full bg-gray-100 border border-gray-800 rounded-md py-2 text-sm font-semibold text-gray-900 text-center hover:bg-gray-200 cursor-pointer"
                  >
                    Experimente por 14 dias
                  </div>
                </Link>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide">O que está incluído:</h4>
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">Pesquisas ilimitadas</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">Análise premium com IA avançada</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">Relatórios personalizados</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">Integração com outras ferramentas</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">Gerenciamento de equipe</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">Suporte 24/7</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
