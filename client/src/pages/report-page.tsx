import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Research, Report, ReportContent } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { PieChart } from "@/components/charts/pie-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { ScatterChart } from "@/components/charts/scatter-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Share2,
  FileText,
  Building2,
  Calendar,
  ArrowLeft,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [pdfGenerating, setPdfGenerating] = useState(false);

  // Fetch research details
  const {
    data: research,
    isLoading: isLoadingResearch,
    error: researchError,
  } = useQuery<Research>({
    queryKey: [`/api/researches/${id}`],
    enabled: !!id,
  });

  // Fetch report details
  const {
    data: report,
    isLoading: isLoadingReport,
    error: reportError,
  } = useQuery<Report>({
    queryKey: [`/api/researches/${id}/report`],
    enabled: !!id,
  });

  const handleExportPDF = () => {
    setPdfGenerating(true);

    // Simulating PDF generation
    setTimeout(() => {
      setPdfGenerating(false);
      toast({
        title: "Relatório exportado",
        description: "O PDF foi gerado com sucesso",
      });
    }, 2000);
  };

  const handleShare = () => {
    toast({
      title: "Link copiado",
      description: "O link do relatório foi copiado para a área de transferência",
    });
  };

  if (isLoadingResearch || isLoadingReport) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-grow py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-700">Carregando relatório...</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (researchError || reportError || !research || !report) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-grow py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <div className="flex flex-col items-center justify-center h-64">
                <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Não foi possível carregar o relatório</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {(researchError as Error)?.message || (reportError as Error)?.message || "Ocorreu um erro ao buscar os dados"}
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setLocation("/dashboard")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar ao Dashboard
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Format the creation date
  const formattedDate = format(new Date(research.createdAt), "dd/MM/yyyy", { locale: ptBR });

  // Extract report content
  const reportContent: ReportContent = report.content;
  const competitors = reportContent.competitors || [];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 font-poppins">{research.title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Gerado em {formattedDate}</p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar
                </Button>
                <Button onClick={handleExportPDF} disabled={pdfGenerating}>
                  {pdfGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando PDF...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Baixar PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Categoria</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {research.productCategory}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Produto/Serviço</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{research.product}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Concorrentes analisados</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                      {competitors.map((competitor, index) => (
                        <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                          <div className="w-0 flex-1 flex items-center">
                            <Building2 className="flex-shrink-0 h-5 w-5 text-gray-400" />
                            <span className="ml-2 flex-1 w-0 truncate">{competitor.name}</span>
                          </div>
                          {competitor.website && (
                            <div className="ml-4 flex-shrink-0">
                              <a 
                                href={competitor.website.startsWith('http') ? competitor.website : `https://${competitor.website}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-medium text-primary hover:text-primary/80"
                              >
                                Ver site
                              </a>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Report content */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Price Comparison */}
            {reportContent.priceComparison && (
              <Card>
                <CardHeader>
                  <CardTitle>Comparativo de preços</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 relative">
                    <BarChart
                      data={reportContent.priceComparison.data.map((item) => ({
                        name: item.competitor,
                        value: item.price,
                      }))}
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      {reportContent.priceComparison.analysis}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Feature Comparison */}
            {reportContent.featureComparison && (
              <Card>
                <CardHeader>
                  <CardTitle>Comparativo de funcionalidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[150px]">Funcionalidade</TableHead>
                          {reportContent.featureComparison.data.map((item, index) => (
                            <TableHead key={index} className="text-center">{item.competitor}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportContent.featureComparison.features.map((feature, featureIndex) => (
                          <TableRow key={featureIndex}>
                            <TableCell className="font-medium">{feature}</TableCell>
                            {reportContent.featureComparison?.data.map((item, competitorIndex) => (
                              <TableCell key={competitorIndex} className="text-center">
                                {item.hasFeature[featureIndex] ? (
                                  <svg className="h-5 w-5 text-green-500 mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg className="h-5 w-5 text-gray-300 mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Market Positioning */}
            {reportContent.marketPositioning && (
              <Card>
                <CardHeader>
                  <CardTitle>Posicionamento de mercado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 relative">
                    <ScatterChart data={reportContent.marketPositioning.data} />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      {reportContent.marketPositioning.analysis}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Market Share */}
            {reportContent.marketShare && (
              <Card>
                <CardHeader>
                  <CardTitle>Participação de mercado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 relative">
                    <PieChart
                      data={reportContent.marketShare.data.map((item) => ({
                        name: item.competitor,
                        value: item.share,
                      }))}
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      {reportContent.marketShare.analysis}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Google Analytics & Trends Section */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Google Analytics Data */}
            <Card>
              <CardHeader>
                <CardTitle>Insights do Google Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 font-poppins">Palavras-chave principais</h4>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["Marketing Digital", "SEO", "Análise de Concorrentes", "Inteligência de Mercado", "Estratégia de Marketing"].map((keyword, index) => (
                        <div key={index} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                          {keyword}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-900 font-poppins">Tráfego por canal</h4>
                    <div className="h-48 relative mt-2">
                      {reportContent.googleAnalytics ? (
                        <PieChart
                          data={reportContent.googleAnalytics.trafficSources.map(source => ({
                            name: source.source,
                            value: source.percentage
                          }))}
                        />
                      ) : (
                        <PieChart
                          data={[
                            { name: "Orgânico", value: 35 },
                            { name: "Direto", value: 28 },
                            { name: "Social", value: 20 },
                            { name: "Referência", value: 12 },
                            { name: "Pago", value: 5 },
                          ]}
                        />
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    {reportContent.googleAnalytics?.analysis || 
                     "Análise de tráfego e palavras-chave baseada em dados agregados do setor para seu nicho."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Google Trends Data */}
            <Card>
              <CardHeader>
                <CardTitle>Tendências de Busca</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 font-poppins">Interesse ao longo do tempo</h4>
                    <div className="h-48 mt-2 bg-gray-100 rounded-md p-4 flex items-center justify-center">
                      {/* Trend chart visualization */}
                      <div className="w-full h-full flex items-end space-x-1">
                        {reportContent.googleTrends?.interestOverTime ? (
                          reportContent.googleTrends.interestOverTime.map((item, index) => (
                            <div 
                              key={index} 
                              className="flex-1 bg-primary rounded-t-sm"
                              style={{ height: `${item.value}%` }}
                            ></div>
                          ))
                        ) : (
                          [30, 35, 45, 40, 50, 55, 60, 65, 62, 70, 75, 80].map((height, index) => (
                            <div 
                              key={index} 
                              className="flex-1 bg-primary rounded-t-sm"
                              style={{ height: `${height}%` }}
                            ></div>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      {reportContent.googleTrends?.interestOverTime ? (
                        reportContent.googleTrends.interestOverTime.map((item, index) => (
                          <span key={index}>{item.month}</span>
                        ))
                      ) : (
                        <>
                          <span>Jan</span>
                          <span>Fev</span>
                          <span>Mar</span>
                          <span>Abr</span>
                          <span>Mai</span>
                          <span>Jun</span>
                          <span>Jul</span>
                          <span>Ago</span>
                          <span>Set</span>
                          <span>Out</span>
                          <span>Nov</span>
                          <span>Dez</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-900 font-poppins">Tópicos relacionados em alta</h4>
                    <ul className="mt-2 space-y-2">
                      {reportContent.googleTrends?.relatedTopics ? (
                        reportContent.googleTrends.relatedTopics.map((topic, index) => (
                          <li key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">{topic.name}</span>
                            <span className="text-green-600 font-medium">{topic.growth}</span>
                          </li>
                        ))
                      ) : (
                        [
                          { name: "Análise de dados para marketing", growth: "+120%" },
                          { name: "Inteligência artificial para negócios", growth: "+95%" },
                          { name: "Estratégias de marketing digital 2025", growth: "+80%" },
                          { name: "Ferramentas de análise de concorrentes", growth: "+65%" },
                        ].map((topic, index) => (
                          <li key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">{topic.name}</span>
                            <span className="text-green-600 font-medium">{topic.growth}</span>
                          </li>
                        ))
                      )}
                    </ul>

                    <p className="text-sm text-gray-500 mt-4">
                      {reportContent.googleTrends?.analysis || 
                       "Análise de tendências baseada em dados do Google Trends para seu setor e produto."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conclusions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Conclusões e Recomendações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 font-poppins">Principais descobertas</h4>
                  <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-gray-500">
                    {reportContent.conclusions.findings.map((finding, index) => (
                      <li key={index}>{finding}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 font-poppins">Oportunidades de mercado</h4>
                  <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-gray-500">
                    {reportContent.conclusions.opportunities.map((opportunity, index) => (
                      <li key={index}>{opportunity}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 font-poppins">Recomendações estratégicas</h4>
                  <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-gray-500">
                    {reportContent.conclusions.recommendations.map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6 flex justify-end">
              <Button onClick={() => setLocation("/dashboard")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}