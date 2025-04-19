import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Research } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { PieChart } from "@/components/charts/pie-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  Building2,
  FileText,
  Plus,
  Calendar,
  Tag,
  Clock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  // Fetch user's researches
  const {
    data: researches,
    isLoading: isLoadingResearches,
    error: researchesError,
  } = useQuery<Research[]>({
    queryKey: ["/api/researches"],
    refetchInterval: false,
  });
  
  // Fetch user stats
  const {
    data: stats,
    isLoading: isLoadingStats,
  } = useQuery<{
    totalResearches: number;
    totalCompetitors: number;
    totalReports: number;
  }>({
    queryKey: ["/api/user/stats"],
    refetchInterval: false,
  });
  
  // Generate sector distribution data for the chart
  const sectorData = researches
    ? Array.from(
        researches.reduce((acc, research) => {
          acc.set(research.sector, (acc.get(research.sector) || 0) + 1);
          return acc;
        }, new Map<string, number>())
      ).map(([name, value]) => ({ name, value }))
    : [];
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate font-poppins">
                Bem-vindo(a), {user.firstName}
              </h2>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link href="/research/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Pesquisa
                </Button>
              </Link>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 - Pesquisas */}
            <Card>
              <CardContent className="pt-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pesquisas realizadas
                      </dt>
                      <dd>
                        {isLoadingStats ? (
                          <Skeleton className="h-6 w-12" />
                        ) : (
                          <div className="text-lg font-medium text-gray-900">
                            {stats?.totalResearches || 0}
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
              <div className="bg-gray-50 px-5 py-3 rounded-b-lg">
                <div className="text-sm">
                  <Link href="/research/new">
                    <span className="font-medium text-primary hover:text-primary/80">
                      Nova pesquisa
                    </span>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Card 2 - Concorrentes */}
            <Card>
              <CardContent className="pt-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <Building2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Concorrentes analisados
                      </dt>
                      <dd>
                        {isLoadingStats ? (
                          <Skeleton className="h-6 w-12" />
                        ) : (
                          <div className="text-lg font-medium text-gray-900">
                            {stats?.totalCompetitors || 0}
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
              <div className="bg-gray-50 px-5 py-3 rounded-b-lg">
                <div className="text-sm">
                  <span className="font-medium text-primary hover:text-primary/80">
                    Ver detalhes
                  </span>
                </div>
              </div>
            </Card>

            {/* Card 3 - Relatórios */}
            <Card>
              <CardContent className="pt-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-orange-100 rounded-md p-3">
                    <FileText className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Relatórios gerados
                      </dt>
                      <dd>
                        {isLoadingStats ? (
                          <Skeleton className="h-6 w-12" />
                        ) : (
                          <div className="text-lg font-medium text-gray-900">
                            {stats?.totalReports || 0}
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
              <div className="bg-gray-50 px-5 py-3 rounded-b-lg">
                <div className="text-sm">
                  <span className="font-medium text-primary hover:text-primary/80">
                    Ver relatórios
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Research */}
          <h3 className="mt-8 text-lg leading-6 font-medium text-gray-900 font-poppins">
            Pesquisas recentes
          </h3>
          <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-md">
            {isLoadingResearches ? (
              <div className="p-4 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : researches && researches.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {researches.map((research) => (
                  <li key={research.id}>
                    <Link href={`/report/${research.id}`}>
                      <a className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-primary truncate">
                              {research.title}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                research.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : research.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {research.status === 'completed' 
                                  ? 'Completo' 
                                  : research.status === 'pending' 
                                  ? 'Em andamento'
                                  : 'Falhou'}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <Building2 className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                {research.competitors 
                                  ? `${research.competitors.split(',').length} concorrentes`
                                  : 'Buscando concorrentes...'}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                <Tag className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                {research.sector}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              <p>
                                Criado em {format(new Date(research.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-12 px-4 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma pesquisa encontrada</h3>
                <p className="mt-1 text-sm text-gray-500">Comece criando sua primeira pesquisa de concorrência.</p>
                <div className="mt-6">
                  <Link href="/research/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Pesquisa
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por setor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 relative">
                  {isLoadingResearches ? (
                    <div className="flex items-center justify-center h-full">
                      <Skeleton className="h-48 w-48 rounded-full" />
                    </div>
                  ) : sectorData.length > 0 ? (
                    <PieChart data={sectorData} />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-50 rounded">
                      <div className="text-center text-gray-500">
                        Sem dados para exibir
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade recente</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingResearches ? (
                  <div className="space-y-6">
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                  </div>
                ) : researches && researches.length > 0 ? (
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {researches.slice(0, 3).map((research, idx) => (
                        <li key={research.id}>
                          <div className="relative pb-8">
                            {idx < 2 && (
                              <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                              ></span>
                            )}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                  idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-green-500' : 'bg-orange-500'
                                }`}>
                                  {idx === 0 ? (
                                    <Search className="h-4 w-4 text-white" />
                                  ) : idx === 1 ? (
                                    <FileText className="h-4 w-4 text-white" />
                                  ) : (
                                    <Building2 className="h-4 w-4 text-white" />
                                  )}
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    {idx === 0 ? (
                                      <>Nova pesquisa criada: <span className="font-medium text-gray-900">{research.title}</span></>
                                    ) : idx === 1 ? (
                                      <>Relatório gerado: <span className="font-medium text-gray-900">{research.title}</span></>
                                    ) : (
                                      <>Novos concorrentes adicionados à pesquisa: <span className="font-medium text-gray-900">{research.title}</span></>
                                    )}
                                  </p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  {format(new Date(research.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64">
                    <Clock className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma atividade recente</h3>
                    <p className="mt-1 text-sm text-gray-500">As atividades aparecerão aqui quando você começar a usar o sistema.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
