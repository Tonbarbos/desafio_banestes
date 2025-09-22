# desafio_banestes: Sistema de Gestão de Clientes

## Visão Geral

Este projeto é uma aplicação web de página única (Single Page Application - SPA) desenvolvida com **React** e **TypeScript**. Seu objetivo principal é fornecer uma interface intuitiva para a gestão de informações bancárias de clientes, incluindo funcionalidades de visualização, busca, filtragem, ordenação e detalhamento de dados. Além disso, o sistema oferece uma seção de relatórios com gráficos para análise.

Os dados são consumidos em tempo real de planilhas do Google Sheets, garantindo que as informações estejam sempre atualizadas. A aplicação é projetada para ser responsiva, adaptando-se a diversos dispositivos e tamanhos de tela, e segue as melhores práticas de design e acessibilidade para uma excelente experiência do usuário.

Link do Projeto: https://projetobanestesdanton.netlify.app

## Funcionalidades Implementadas

### 1. Carregamento de Dados Externos

*   **Fonte de Dados:** O sistema busca dados de clientes, contas e agências de três URLs distintas do Google Sheets, conforme implementado em `src/utils/dataFetcher.js`.
*   **Parsing de CSV:** Uma função robusta de `parseCsv` é utilizada para processar os dados em formato CSV, lidando com vírgulas dentro de campos de texto delimitados por aspas.
*   **Tratamento e Normalização:** Durante o carregamento, valores monetários (renda, patrimônio, saldo) são convertidos de strings para números, e datas de nascimento são transformadas em objetos `Date`.

### 2. Tela Principal e Listagem de Clientes

*   **Exibição em Cards:** Clientes são apresentados em uma lista de cartões (`client-card`).
*   **Paginação:** A lista de clientes é paginada, permitindo a navegação entre páginas e a seleção da quantidade de itens exibidos por página (10, 16, 32 ou 64).
*   **Layout Alternável:** Um botão permite alternar o layout da lista de clientes entre visualizações vertical e horizontal.

### 3. Busca, Filtragem e Ordenação

*   **Busca Simples e Avançada:** O componente `App.tsx` implementa uma lógica de busca que permite pesquisar por:
    *   Nome do cliente
    *   CPF/CNPJ
    *   Email
    *   Informações da agência (nome, endereço ou código)
*   **Filtro por Idade:** A busca avançada inclui a opção de filtrar clientes por uma faixa etária (idade mínima e máxima).
*   **Ordenação:** Os resultados podem ser ordenados por Nome, Renda Anual ou Patrimônio, em ordem ascendente ou descendente.

### 4. Detalhes do Cliente

*   **Visualização Completa:** Ao selecionar um cliente, o usuário é direcionado a uma tela de detalhes (`src/components/ClientDetail.jsx`) que exibe todas as informações pessoais, financeiras e da agência associada.
*   **Listagem de Contas:** A tela de detalhes também lista todas as contas bancárias do cliente, mostrando tipo, saldo, limite de crédito e crédito disponível.

### 5. Relatórios e Visualização de Dados

*   **Página de Relatórios:** Uma seção dedicada a relatórios (`src/components/Reports.jsx`) apresenta análises visuais dos dados.
*   **Gráficos de Pizza:** São exibidos 5 gráficos de pizza que categorizam os clientes com base em:
    *   Faixa de Saldo
    *   Faixa de Limite de Crédito
    *   Faixa de Crédito Disponível
    *   Faixa de Renda Anual (em múltiplos do salário mínimo)
    *   Faixa Etária
*   **Exportação para Excel:** É possível exportar os dados dos gráficos para um arquivo Excel (.xlsx) utilizando a biblioteca `xlsx`.

## Tecnologias Utilizadas

*   **React 18:** Framework JavaScript para construção da interface do usuário.
*   **TypeScript:** Adiciona tipagem estática ao JavaScript, melhorando a manutenibilidade e a detecção de erros.
*   **Tailwind CSS:** Framework de estilos utilitários para um desenvolvimento rápido e consistente da UI.
*   **Vite:** Ferramenta de build moderna que proporciona um ambiente de desenvolvimento rápido.
*   **react-chartjs-2:** Para a criação dos gráficos.
*   **chartjs-plugin-datalabels:** Para exibir os percentuais nos gráficos.

## Estrutura do Projeto

A estrutura de arquivos do projeto é organizada da seguinte forma:

projetoBanestes/
├── components.json
├── eslint.config.js
├── jsconfig.json
├── package.json
├── pnpm-lock.yaml
├── src/
│   ├── App.jsx
│   ├── App.tsx
│   ├── assets/
│   │   ├── App.css
│   │   ├── App.js
│   │   └── react.svg
│   ├── components/
│   │   ├── ClientCard.jsx
│   │   ├── ClientDetail.jsx
│   │   ├── ClientListHeader.jsx
│   │   ├── ItemsPerPageSelector.jsx
│   │   ├── PaginationControls.jsx
│   │   ├── Reports.jsx
│   │   └── ui/
│   │       ├── accordion.jsx
│   │       ├── alert-dialog.jsx
│   │       ├── alert.jsx
│   │       ├── aspect-ratio.jsx
│   │       ├── avatar.jsx
│   │       ├── badge.jsx
│   │       ├── breadcrumb.jsx
│   │       ├── button.jsx
│   │       ├── calendar.jsx
│   │       ├── card.jsx
│   │       ├── carousel.jsx
│   │       ├── chart.jsx
│   │       ├── checkbox.jsx
│   │       ├── collapsible.jsx
│   │       ├── command.jsx
│   │       ├── context-menu.jsx
│   │       ├── dialog.jsx
│   │       ├── drawer.jsx
│   │       ├── dropdown-menu.jsx
│   │       ├── form.jsx
│   │       ├── hover-card.jsx
│   │       ├── input-otp.jsx
│   │       ├── input.jsx
│   │       ├── label.jsx
│   │       ├── menubar.jsx
│   │       ├── navigation-menu.jsx
│   │       ├── pagination.jsx
│   │       ├── popover.jsx
│   │       ├── progress.jsx
│   │       ├── radio-group.jsx
│   │       ├── resizable.jsx
│   │       ├── scroll-area.jsx
│   │       ├── select.jsx
│   │       ├── separator.jsx
│   │       ├── sheet.jsx
│   │       ├── sidebar.jsx
│   │       ├── skeleton.jsx
│   │       ├── slider.jsx
│   │       ├── sonner.jsx
│   │       ├── switch.jsx
│   │       ├── table.jsx
│   │       ├── tabs.jsx
│   │       ├── textarea.jsx
│   │       ├── toggle-group.jsx
│   │       ├── toggle.jsx
│   │       └── tooltip.jsx
│   ├── hooks/
│   │   ├── use-mobile.js
│   │   ├── useClientFiltering.js
│   │   ├── useClientSorting.js
│   │   └── usePagination.js
│   ├── index.html
│   ├── lib/
│   │   └── utils.js
│   ├── main.jsx
│   ├── main.tsx
│   ├── netlify.toml
│   └── utils/
│       └── dataFetcher.js
├── tsconfig.json
├── vite.config.js
└── package-lock.json



