# desafio_banestes
O projeto é uma aplicação web de página única construída com React e TypeScript. Sua principal função é buscar dados de clientes, contas e agências de planilhas do Google Sheets, exibi-los em uma interface de usuário e fornecer funcionalidades de busca, filtragem, ordenação e visualização detalhada. O sistema também inclui uma seção de relatórios com gráficos.

Estrutura do Projeto

src/
├── components/             # Componentes reutilizáveis da UI
│   ├── ListaClientes/      # Componentes relacionados à listagem de clientes
│   │   ├── ClientLista.tsx
│   │   ├── ClientCard.tsx
│   │   ├── ClientFiltro.tsx
│   │   ├── ClientesDetalhes.tsx
│   │   └── Paginacao.tsx
│   ├── Conta/              # Componentes de exibição de contas
│   │   └── ContaCard.tsx
│   ├── Agencia/            # Componentes de exibição de agências
│   │   └── AgenciaInfo.tsx
│   └── pages/              # Páginas principais da aplicação
│       ├── Home.tsx
│       └── PaginaCliente.tsx
├── hooks/                  # Hooks customizados para lógica de estado e dados
│   └── useDatas.ts
├── services/               # Serviços de integração com APIs externas
│   ├── api.ts
├── types/                  # Definições de tipos TypeScript
│   └── index.ts
├── App.tsx                 # Componente raiz da aplicação
├── main.tsx                # Ponto de entrada do React
└── index.css               # Configuração global de estilos (Tailwind CSS)


Funcionalidades Implementadas 

1. Carregamento de Dados Externos

•
Fonte de Dados: O arquivo src/utils/dataFetcher.js confirma que o sistema busca dados de três URLs distintas do Google Sheets, correspondentes a clientes, contas e agências.

•
Parsing de CSV: A aplicação utiliza uma função parseCsv para processar os dados em formato CSV. Esta função é robusta, capaz de lidar com vírgulas dentro de campos de texto (delimitados por aspas).

•
Tratamento de Dados: Durante o carregamento, os dados são normalizados. Valores monetários (como renda, patrimônio, saldo) são convertidos de strings (ex: "R$ 1.234,56") para números. Datas de nascimento são convertidas para objetos Date do JavaScript.

2. Tela Principal e Listagem de Clientes

•
Exibição em Cards: Os clientes são exibidos em uma lista de cartões (client-card).

•
Paginação: A lista de clientes é paginada. O usuário pode navegar entre as páginas e selecionar a quantidade de itens por página (10, 16, 32 ou 64), funcionalidade implementada no componente App.tsx.

•
Layout Alternável: Existe um botão que permite ao usuário alternar o layout da lista de clientes entre vertical e horizontal.

3. Busca, Filtragem e Ordenação

•
Busca Simples e Avançada: O componente App.tsx implementa uma lógica de busca. O usuário pode pesquisar por:

•
Nome do cliente

•
CPF/CNPJ

•
Email

•
Informações da agência (nome, endereço ou código)


•
Filtro por Idade: A busca avançada permite filtrar clientes por uma faixa de idade (mínima e máxima).

•
Ordenação: Os resultados podem ser ordenados por:

•
Nome (ascendente ou descendente)

•
Renda Anual (ascendente ou descendente)

•
Patrimônio (ascendente ou descendente)



4. Detalhes do Cliente

•
Visualização Completa: Ao clicar em um card de cliente, o usuário é levado a uma tela de detalhes (src/components/ClientDetail.jsx).

•
Informações Exibidas: Esta tela mostra todos os dados do cliente, incluindo informações pessoais, financeiras e da sua agência.

•
Listagem de Contas: A tela de detalhes também busca e exibe todas as contas bancárias associadas àquele cliente, mostrando tipo, saldo, limite de crédito e crédito disponível.

5. Relatórios e Visualização de Dados

•
Página de Relatórios: O sistema possui uma seção de relatórios (src/components/Reports.jsx).

•
Gráficos de Pizza: Esta seção exibe 5 gráficos de pizza que categorizam os clientes com base em:

•
Faixa de Saldo

•
Faixa de Limite de Crédito

•
Faixa de Crédito Disponível

•
Faixa de Renda Anual (em múltiplos do salário mínimo)

•
Faixa Etária


•
Exportação para Excel: Há um botão funcional para exportar os dados dos gráficos para um arquivo Excel (.xlsx), utilizando a biblioteca xlsx.

Tecnologias e Bibliotecas Verificadas

•
React e TypeScript: Estrutura principal da aplicação.

•
react-chartjs-2: Para a criação dos gráficos na página de relatórios.

•
chartjs-plugin-datalabels: Para exibir os percentuais nos gráficos.

•


