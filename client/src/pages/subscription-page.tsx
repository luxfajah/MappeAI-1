import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Shield, Star, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';

const subscriptionPlans = [
  {
    name: 'Gratuito',
    price: 'R$ 0',
    description: 'Para pequenos negócios começando a entender a concorrência',
    features: [
      '1 pesquisa de concorrência por mês',
      'Análise básica de competidores',
      'Acesso por 30 dias aos relatórios'
    ],
    buttonText: 'Plano Atual',
    isPopular: false,
    disabled: true
  },
  {
    name: 'Negócios',
    price: 'R$ 89/mês',
    description: 'Para empresas que precisam de análises detalhadas',
    features: [
      '5 pesquisas de concorrência por mês',
      'Análise avançada com dados do Google',
      'Acesso ilimitado a relatórios',
      'Comparativos de preços e features',
      'Análise de posicionamento de mercado'
    ],
    buttonText: 'Assinar Agora',
    isPopular: true,
    disabled: false
  },
  {
    name: 'Empresarial',
    price: 'R$ 249/mês',
    description: 'Para empresas que precisam de inteligência competitiva completa',
    features: [
      'Pesquisas ilimitadas de concorrência',
      'API para integração com outras ferramentas',
      'Relatórios personalizados',
      'Análise de tendências de mercado',
      'Suporte prioritário',
      'Treinamento exclusivo'
    ],
    buttonText: 'Contacte-nos',
    isPopular: false,
    disabled: false
  }
];

export default function SubscriptionPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleSubscribe = async (planName: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para assinar um plano",
        variant: "destructive"
      });
      setLocation('/auth');
      return;
    }
    
    if (planName === "Empresarial") {
      toast({
        title: "Contato Comercial",
        description: "Nossa equipe entrará em contato em breve!",
        variant: "default"
      });
      return;
    }
    
    try {
      setLoading(planName);
      // Aqui vamos redirecionar para a página de checkout do Stripe
      const response = await apiRequest('POST', '/api/create-subscription', { 
        plan: planName === "Negócios" ? "business" : "free" 
      });
      
      if (response.ok) {
        const data = await response.json();
        // Redirecionar para checkout
        setLocation(`/checkout?clientSecret=${data.clientSecret}`);
      } else {
        throw new Error('Falha ao iniciar o checkout');
      }
    } catch (error) {
      toast({
        title: "Erro na assinatura",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar a assinatura",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Escolha seu plano</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Mapeie sua concorrência com inteligência artificial e tenha insights valiosos para o crescimento do seu negócio
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.name} className={`border-2 ${plan.isPopular ? 'border-primary' : 'border-border'} overflow-hidden transition-all duration-300 hover:shadow-xl ${plan.isPopular ? 'scale-105' : ''}`}>
                {plan.isPopular && (
                  <div className="bg-primary text-white py-1 text-center text-sm font-medium">
                    MAIS POPULAR
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{plan.name}</span>
                    {plan.name === "Empresarial" && <Shield className="h-5 w-5 text-primary" />}
                    {plan.name === "Negócios" && <Zap className="h-5 w-5 text-primary" />}
                    {plan.name === "Gratuito" && <Star className="h-5 w-5 text-primary" />}
                  </CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={plan.isPopular ? "default" : "outline"}
                    disabled={plan.disabled || loading === plan.name}
                    onClick={() => handleSubscribe(plan.name)}
                  >
                    {loading === plan.name ? "Processando..." : plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4">Perguntas frequentes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              <div>
                <h4 className="font-semibold mb-2">Como funciona a assinatura?</h4>
                <p className="text-muted-foreground">
                  Você escolhe um plano, realiza o pagamento e já pode começar a usar. Você será cobrado mensalmente até que cancele a assinatura.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Posso cancelar a qualquer momento?</h4>
                <p className="text-muted-foreground">
                  Sim, você pode cancelar sua assinatura a qualquer momento na página de gerenciamento de assinatura. Você terá acesso ao plano até o final do período pago.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Como são feitas as análises de concorrência?</h4>
                <p className="text-muted-foreground">
                  Utilizamos inteligência artificial avançada para analisar dados públicos disponíveis sobre seus concorrentes e fornecer insights valiosos.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Preciso fornecer dados da minha empresa?</h4>
                <p className="text-muted-foreground">
                  Não é necessário, mas quanto mais informações você fornecer, mais precisos serão os resultados e recomendações.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}