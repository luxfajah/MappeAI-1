// Dados de localização para Brasil
export const countries = [
  { id: "BR", name: "Brasil" },
  // No futuro, podemos adicionar mais países aqui
];

// Estados do Brasil
export const states = {
  BR: [
    { id: "AC", name: "Acre" },
    { id: "AL", name: "Alagoas" },
    { id: "AP", name: "Amapá" },
    { id: "AM", name: "Amazonas" },
    { id: "BA", name: "Bahia" },
    { id: "CE", name: "Ceará" },
    { id: "DF", name: "Distrito Federal" },
    { id: "ES", name: "Espírito Santo" },
    { id: "GO", name: "Goiás" },
    { id: "MA", name: "Maranhão" },
    { id: "MT", name: "Mato Grosso" },
    { id: "MS", name: "Mato Grosso do Sul" },
    { id: "MG", name: "Minas Gerais" },
    { id: "PA", name: "Pará" },
    { id: "PB", name: "Paraíba" },
    { id: "PR", name: "Paraná" },
    { id: "PE", name: "Pernambuco" },
    { id: "PI", name: "Piauí" },
    { id: "RJ", name: "Rio de Janeiro" },
    { id: "RN", name: "Rio Grande do Norte" },
    { id: "RS", name: "Rio Grande do Sul" },
    { id: "RO", name: "Rondônia" },
    { id: "RR", name: "Roraima" },
    { id: "SC", name: "Santa Catarina" },
    { id: "SP", name: "São Paulo" },
    { id: "SE", name: "Sergipe" },
    { id: "TO", name: "Tocantins" }
  ]
};

// Principais cidades por estado do Brasil
export const cities = {
  AC: [
    "Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá", "Feijó"
  ],
  AL: [
    "Maceió", "Arapiraca", "Palmeira dos Índios", "Rio Largo", "Penedo"
  ],
  AP: [
    "Macapá", "Santana", "Laranjal do Jari", "Oiapoque", "Porto Grande"
  ],
  AM: [
    "Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari"
  ],
  BA: [
    "Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro"
  ],
  CE: [
    "Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral"
  ],
  DF: [
    "Brasília", "Ceilândia", "Taguatinga", "Plano Piloto", "Samambaia"
  ],
  ES: [
    "Vitória", "Vila Velha", "Serra", "Cariacica", "Linhares"
  ],
  GO: [
    "Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia"
  ],
  MA: [
    "São Luís", "Imperatriz", "Timon", "Caxias", "Codó"
  ],
  MT: [
    "Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra"
  ],
  MS: [
    "Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã"
  ],
  MG: [
    "Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"
  ],
  PA: [
    "Belém", "Ananindeua", "Santarém", "Marabá", "Castanhal"
  ],
  PB: [
    "João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux"
  ],
  PR: [
    "Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel"
  ],
  PE: [
    "Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina"
  ],
  PI: [
    "Teresina", "Parnaíba", "Picos", "Piripiri", "Floriano"
  ],
  RJ: [
    "Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói"
  ],
  RN: [
    "Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Macaíba"
  ],
  RS: [
    "Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria"
  ],
  RO: [
    "Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal"
  ],
  RR: [
    "Boa Vista", "Rorainópolis", "Caracaraí", "Alto Alegre", "Mucajaí"
  ],
  SC: [
    "Florianópolis", "Joinville", "Blumenau", "São José", "Chapecó"
  ],
  SP: [
    "São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André", 
    "Ribeirão Preto", "Osasco", "Sorocaba", "São José dos Campos", "Santos"
  ],
  SE: [
    "Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "São Cristóvão"
  ],
  TO: [
    "Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins"
  ]
};

// Categorias de produtos/serviços
export const productCategories = [
  { id: "restaurant", name: "Restaurante/Alimentação" },
  { id: "retail", name: "Varejo/Loja Física" },
  { id: "ecommerce", name: "E-commerce/Loja Virtual" },
  { id: "beauty", name: "Beleza e Estética" },
  { id: "health", name: "Saúde/Clínica" },
  { id: "education", name: "Educação/Cursos" },
  { id: "technology", name: "Tecnologia/Software" },
  { id: "realEstate", name: "Imobiliária" },
  { id: "automotive", name: "Automotivo" },
  { id: "clothing", name: "Vestuário/Moda" },
  { id: "petShop", name: "Pet Shop" },
  { id: "fitness", name: "Academia/Esportes" },
  { id: "tourism", name: "Turismo/Hotelaria" },
  { id: "entertainment", name: "Entretenimento" },
  { id: "homeServices", name: "Serviços Domésticos" },
  { id: "construction", name: "Construção/Reforma" },
  { id: "finance", name: "Financeiro/Contabilidade" },
  { id: "lawyer", name: "Advocacia" },
  { id: "marketing", name: "Marketing/Publicidade" },
  { id: "logistics", name: "Logística/Transporte" },
  { id: "furniture", name: "Móveis/Decoração" },
  { id: "agriculture", name: "Agronegócio" },
  { id: "other", name: "Outro" }
];

// Canais de venda disponíveis
export const salesChannels = [
  { id: "physical", name: "Loja Física" },
  { id: "website", name: "Site Próprio" },
  { id: "marketplace", name: "Marketplace" },
  { id: "socialMedia", name: "Redes Sociais" },
  { id: "whatsapp", name: "WhatsApp/Telegram" },
  { id: "email", name: "E-mail Marketing" },
  { id: "outdoorAds", name: "Anúncios Offline" },
  { id: "resellers", name: "Revendedores" },
  { id: "affiliates", name: "Programa de Afiliados" },
  { id: "delivery", name: "Delivery Próprio" },
  { id: "deliveryApps", name: "Apps de Delivery (iFood, Rappi, etc)" },
  { id: "phoneOrders", name: "Pedidos por Telefone" }
];