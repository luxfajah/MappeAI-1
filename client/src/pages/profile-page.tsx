import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CreditCard, LogOut, Mail, User as UserIcon, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { useAuth } from '@/hooks/use-auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Mock user subscription data
const mockSubscription = {
  plan: "Negócios",
  status: "Ativa",
  nextBillingDate: "25/05/2023",
  amount: "R$ 89,00",
  cardLast4: "4242"
};

const updateProfileSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().optional(),
  email: z.string().email("Email inválido"),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  newPassword: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmNewPassword: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "As senhas não coincidem",
  path: ["confirmNewPassword"],
});

type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, logoutMutation } = useAuth();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isCancellingSubscription, setIsCancellingSubscription] = useState(false);

  const profileForm = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
  });

  const passwordForm = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onProfileSubmit = async (data: UpdateProfileValues) => {
    try {
      setIsUpdatingProfile(true);
      const response = await apiRequest('PATCH', '/api/user', data);

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['/api/user'] });
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram atualizadas com sucesso",
          variant: "default",
        });
      } else {
        throw new Error('Falha ao atualizar perfil');
      }
    } catch (error) {
      toast({
        title: "Erro na atualização",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar o perfil",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onPasswordSubmit = async (data: UpdatePasswordValues) => {
    try {
      setIsUpdatingPassword(true);
      const response = await apiRequest('PATCH', '/api/user/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (response.ok) {
        toast({
          title: "Senha atualizada",
          description: "Sua senha foi atualizada com sucesso",
          variant: "default",
        });
        passwordForm.reset();
      } else {
        throw new Error('Falha ao atualizar senha');
      }
    } catch (error) {
      toast({
        title: "Erro na atualização da senha",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar a senha",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Tem certeza que deseja cancelar sua assinatura? Você perderá o acesso aos recursos premium ao final do período de faturamento.")) {
      return;
    }

    try {
      setIsCancellingSubscription(true);
      const response = await apiRequest('POST', '/api/cancel-subscription');

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['/api/user'] });
        toast({
          title: "Assinatura cancelada",
          description: "Sua assinatura foi cancelada com sucesso. Você terá acesso aos recursos até o final do período pago.",
          variant: "default",
        });
      } else {
        throw new Error('Falha ao cancelar assinatura');
      }
    } catch (error) {
      toast({
        title: "Erro no cancelamento",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao cancelar a assinatura",
        variant: "destructive"
      });
    } finally {
      setIsCancellingSubscription(false);
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setLocation('/auth');
      }
    });
  };

  const handleChangePaymentMethod = () => {
    setLocation('/update-payment');
  };

  // Redirecionar para a página de autenticação se não houver usuário logado
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Navbar />

        <main className="flex-1 py-16">
          <div className="container mx-auto px-4 text-center">
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Acesso negado</AlertTitle>
              <AlertDescription>
                Você precisa estar logado para acessar esta página.
                <div className="mt-2">
                  <Button variant="outline" onClick={() => setLocation('/auth')}>
                    Fazer login
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Perfil & Assinatura</h1>

          <Tabs defaultValue="profile" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="subscription">Assinatura</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card de informações do usuário */}
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <UserIcon className="h-5 w-5 mr-2 text-primary" />
                      Informações
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-4">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <UserIcon className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="font-medium text-lg">{user.firstName} {user.lastName || ''}</h3>
                    <p className="text-muted-foreground text-sm flex items-center justify-center mt-1">
                      <Mail className="h-4 w-4 mr-1" />
                      {user.email || 'Email não disponível'}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button variant="outline" onClick={handleLogout} className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair da conta
                    </Button>
                  </CardFooter>
                </Card>

                {/* Cards de edição */}
                <div className="col-span-1 md:col-span-2 space-y-8">
                  {/* Editar perfil */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Editar informações</CardTitle>
                      <CardDescription>Atualize suas informações pessoais</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                          <FormField
                            control={profileForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={profileForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sobrenome</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input {...field} type="email" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button type="submit" disabled={isUpdatingProfile}>
                            {isUpdatingProfile ? "Salvando..." : "Salvar alterações"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>

                  {/* Alterar senha */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Alterar senha</CardTitle>
                      <CardDescription>Atualizar sua senha de acesso</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Senha atual</FormLabel>
                                <FormControl>
                                  <Input {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nova senha</FormLabel>
                                <FormControl>
                                  <Input {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={passwordForm.control}
                            name="confirmNewPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirmar nova senha</FormLabel>
                                <FormControl>
                                  <Input {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button type="submit" disabled={isUpdatingPassword}>
                            {isUpdatingPassword ? "Atualizando..." : "Atualizar senha"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="subscription">
              <div className="grid grid-cols-1 gap-8">
                {/* Status da assinatura atual */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-primary" />
                      Assinatura Atual
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="rounded-xl border p-6">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-primary/10 p-3">
                              <CreditCard className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">Plano {mockSubscription.plan}</h3>
                              <p className="text-sm text-muted-foreground">
                                {mockSubscription.status === "Ativa" ? (
                                  <span className="flex items-center text-success">
                                    <Check className="h-4 w-4 mr-1" /> Ativa
                                  </span>
                                ) : (
                                  <span className="text-destructive">Inativa</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">PRÓXIMA COBRANÇA</Label>
                            <p className="font-medium">{mockSubscription.nextBillingDate}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">VALOR</Label>
                            <p className="font-medium">{mockSubscription.amount}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">FORMA DE PAGAMENTO</Label>
                            <p className="font-medium">Cartão terminado em {mockSubscription.cardLast4}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" onClick={handleChangePaymentMethod} className="w-full sm:w-auto">
                      Alterar forma de pagamento
                    </Button>
                    <Button variant="destructive" onClick={handleCancelSubscription} disabled={isCancellingSubscription} className="w-full sm:w-auto">
                      {isCancellingSubscription ? "Processando..." : "Cancelar assinatura"}
                    </Button>
                  </CardFooter>
                </Card>

                {/* Histórico de faturas */}
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de faturas</CardTitle>
                    <CardDescription>Todas as suas faturas anteriores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-4 p-4 font-medium border-b">
                        <div>Data</div>
                        <div>Valor</div>
                        <div>Status</div>
                        <div className="text-right">Ações</div>
                      </div>
                      <div className="divide-y">
                        {[
                          { date: "25/04/2023", amount: "R$ 89,00", status: "Pago" },
                          { date: "25/03/2023", amount: "R$ 89,00", status: "Pago" },
                          { date: "25/02/2023", amount: "R$ 89,00", status: "Pago" }
                        ].map((invoice, index) => (
                          <div key={index} className="grid grid-cols-4 p-4 items-center">
                            <div>{invoice.date}</div>
                            <div>{invoice.amount}</div>
                            <div>
                              <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
                                {invoice.status}
                              </span>
                            </div>
                            <div className="text-right">
                              <Button variant="ghost" size="sm">
                                Ver fatura
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}