import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Research } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "O título deve ter pelo menos 5 caracteres",
  }),
  product: z.string().min(3, {
    message: "O produto/serviço deve ter pelo menos 3 caracteres",
  }),
  sector: z.string().min(1, {
    message: "Selecione um setor",
  }),
  location: z.string().min(1, {
    message: "Selecione uma localização",
  }),
  autoFindCompetitors: z.boolean().default(false),
  competitors: z.string().optional(),
  aspectsToAnalyze: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Selecione pelo menos um aspecto para analisar",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewResearchPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      product: "",
      sector: "",
      location: "",
      autoFindCompetitors: false,
      competitors: "",
      aspectsToAnalyze: ["preco", "produtos", "marketing", "online"],
    },
  });
  
  const aspectOptions = [
    { value: "preco", label: "Preços e modelos de negócio" },
    { value: "produtos", label: "Produtos ou serviços" },
    { value: "marketing", label: "Estratégias de marketing" },
    { value: "online", label: "Presença online e redes sociais" },
    { value: "clientes", label: "Perfil de clientes" },
    { value: "diferenciais", label: "Diferenciais competitivos" },
    { value: "swot", label: "Análise SWOT" },
  ];
  
  const createResearchMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("POST", "/api/researches", {
        ...data,
        userId: user?.id,
      });
      return response.json();
    },
    onSuccess: (research: Research) => {
      queryClient.invalidateQueries({ queryKey: ["/api/researches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      
      toast({
        title: "Pesquisa criada com sucesso",
        description: "Sua análise de concorrência foi iniciada",
      });
      
      // Redirect to the report page or dashboard
      setLocation(`/report/${research.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar pesquisa",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(values: FormValues) {
    createResearchMutation.mutate(values);
  }
  
  // Update competitors field disabled state based on autoFindCompetitors
  const autoFindCompetitors = form.watch("autoFindCompetitors");
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 font-poppins">Nova Pesquisa</h1>
            <p className="mt-1 text-sm text-gray-500">
              Preencha as informações abaixo para iniciar uma nova análise de concorrência.
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-8 divide-y divide-gray-200">
                <div className="space-y-8 divide-y divide-gray-200">
                  {/* Informações Básicas */}
                  <div>
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900 font-poppins">
                        Informações Básicas
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Essas informações são necessárias para personalizar sua pesquisa.
                      </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-6">
                            <FormLabel>Nome da pesquisa</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Ex: Análise de concorrentes no setor de e-commerce" 
                                {...field}
                                disabled={createResearchMutation.isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="product"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-6">
                            <FormLabel>Produto ou Serviço</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Ex: Software de gestão financeira" 
                                {...field}
                                disabled={createResearchMutation.isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sector"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-3">
                            <FormLabel>Setor de atuação</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              disabled={createResearchMutation.isPending}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um setor" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="tecnologia">Tecnologia</SelectItem>
                                <SelectItem value="saude">Saúde</SelectItem>
                                <SelectItem value="educacao">Educação</SelectItem>
                                <SelectItem value="varejo">Varejo</SelectItem>
                                <SelectItem value="servicos">Serviços</SelectItem>
                                <SelectItem value="ecommerce">E-commerce</SelectItem>
                                <SelectItem value="financas">Finanças</SelectItem>
                                <SelectItem value="alimentacao">Alimentação</SelectItem>
                                <SelectItem value="outro">Outro</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-3">
                            <FormLabel>Localização geográfica</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              disabled={createResearchMutation.isPending}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma opção" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="local">Local (cidade)</SelectItem>
                                <SelectItem value="regional">Regional (estado)</SelectItem>
                                <SelectItem value="nacional">Nacional (país)</SelectItem>
                                <SelectItem value="internacional">Internacional</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Concorrentes */}
                  <div className="pt-8">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900 font-poppins">
                        Concorrentes
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Informe seus principais concorrentes ou deixe que nossa IA os encontre.
                      </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <FormField
                        control={form.control}
                        name="autoFindCompetitors"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-6 flex items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={createResearchMutation.isPending}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Encontrar concorrentes automaticamente</FormLabel>
                              <FormDescription>
                                Nossa IA irá pesquisar e identificar seus principais concorrentes com base nas informações fornecidas.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="competitors"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-6">
                            <FormLabel>Concorrentes conhecidos {!autoFindCompetitors && "(obrigatório)"}</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Lista de concorrentes separados por vírgula. Ex: Empresa A, Empresa B, Empresa C"
                                rows={3}
                                {...field}
                                disabled={autoFindCompetitors || createResearchMutation.isPending}
                              />
                            </FormControl>
                            <FormDescription>
                              Liste os concorrentes que você já conhece, separados por vírgula.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Preferências de Análise */}
                  <div className="pt-8">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900 font-poppins">
                        Preferências de Análise
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Selecione quais aspectos você deseja analisar sobre seus concorrentes.
                      </p>
                    </div>

                    <div className="mt-6">
                      <FormField
                        control={form.control}
                        name="aspectsToAnalyze"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormMessage />
                            </div>
                            <div className="space-y-4">
                              {aspectOptions.map((option) => (
                                <FormField
                                  key={option.value}
                                  control={form.control}
                                  name="aspectsToAnalyze"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={option.value}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(option.value)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, option.value])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== option.value
                                                    )
                                                  );
                                            }}
                                            disabled={createResearchMutation.isPending}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          {option.label}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-5">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="mr-3"
                      onClick={() => setLocation("/dashboard")}
                      disabled={createResearchMutation.isPending}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createResearchMutation.isPending}
                    >
                      {createResearchMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Iniciando Análise...
                        </>
                      ) : (
                        "Iniciar Análise"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
