import React, { useEffect, useState } from 'react';
import { buscarClientes, buscarContas } from './utils/dataFetcher';
import ClientDetail from './components/ClientDetail';
import Reports from './components/Reports';
import { CabecalhoListaClientes } from './components/ClientListHeader';
import { ClientCard } from './components/ClientCard';
import { PaginationControls } from './components/PaginationControls';
import { ItemsPerPageSelector } from './components/ItemsPerPageSelector';
import { useFiltragemClientes } from './hooks/useClientFiltering';
import { useOrdenacaoClientes } from './hooks/useClientSorting';
import { usePaginacao } from './hooks/usePagination';
import './assets/App.css';

function App() {
  const [clientes, setClientes] = useState([]);
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [showReports, setShowReports] = useState(false);
  const [cardLayout, setCardLayout] = useState('vertical');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesData = await buscarClientes();
        const contasData = await buscarContas();
        setClientes(clientesData);
        setContas(contasData);
      } catch (err) {
        setError('Falha ao carregar os dados. Tente novamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const { 
    termoBusca, 
    setTermoBusca, 
    mostrarBuscaAvancada, 
    setMostrarBuscaAvancada, 
    filtrarPorAgencia, 
    setFiltrarPorAgencia, 
    idadeMinima, 
    setIdadeMinima, 
    idadeMaxima, 
    setIdadeMaxima, 
    clientesFiltrados 
  } = useFiltragemClientes(clientes, contas);

  const { 
    ordenarPor, 
    setOrdenarPor, 
    ordemOrdenacao, 
    setOrdemOrdenacao, 
    clientesOrdenados 
  } = useOrdenacaoClientes(clientesFiltrados);

  const { 
    paginaAtual, 
    itensPorPagina, 
    setItensPorPagina, 
    totalPaginas, 
    itensAtuais, 
    aoMudarPagina, 
    OPCOES_ITENS_POR_PAGINA 
  } = usePaginacao(clientesOrdenados);

  const aoMudarBusca = (event) => {
    setTermoBusca(event.target.value);
    aoMudarPagina(1); // Reseta para a primeira página ao fazer uma nova busca 
  };

  const handleClientClick = (clientId) => {
    setSelectedClientId(clientId);
  };

  const handleBackToList = () => {
    setSelectedClientId(null);
  };

  const toggleCardLayout = () => {
    setCardLayout(prevLayout => (prevLayout === 'vertical' ? 'horizontal' : 'vertical'));
  };

  const selectedClient = clientes.find(cliente => cliente.id === selectedClientId);

  if (loading) {
    return (
      <div className="loading-container fade-in">
        <div className="loading-spinner"></div>
        <h2>Carregando clientes...</h2>
        <p>Por favor, aguarde enquanto carregamos os dados.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container fade-in">
        <h2>Erro ao carregar dados</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      {showReports ? (
        <div className="slide-in-right">
          <Reports clientes={clientes} contas={contas} onBack={() => setShowReports(false)} />
        </div>
      ) : selectedClientId && selectedClient ? (
        <div className="slide-in-right">
          <ClientDetail client={selectedClient} allContas={contas} onBack={handleBackToList} />
        </div>
      ) : (
        <div className="slide-in-left">
          <CabecalhoListaClientes
            termoBusca={termoBusca}
            aoMudarBusca={aoMudarBusca}
            mostrarBuscaAvancada={mostrarBuscaAvancada}
            aoMudarMostrarBuscaAvancada={setMostrarBuscaAvancada}
            filtrarPorAgencia={filtrarPorAgencia}
            aoMudarFiltrarPorAgencia={setFiltrarPorAgencia}
            idadeMinima={idadeMinima}
            aoMudarIdadeMinima={setIdadeMinima}
            idadeMaxima={idadeMaxima}
            aoMudarIdadeMaxima={setIdadeMaxima}
            ordenarPor={ordenarPor}
            aoMudarOrdenarPor={setOrdenarPor}
            ordemOrdenacao={ordemOrdenacao}
            aoMudarOrdemOrdenacao={setOrdemOrdenacao}
            aoMostrarRelatorios={setShowReports}
            alternarLayoutCard={toggleCardLayout}
            layoutCard={cardLayout}
          />

          {itensAtuais.length === 0 ? (
            <div className="text-center" style={{ padding: '4rem 2rem', color: '#666666' }}>
              <h3>Nenhum cliente encontrado</h3>
              <p>Tente ajustar os filtros de busca ou verifique os critérios de pesquisa.</p>
            </div>
          ) : (
            <>
              <div className={`client-list ${cardLayout}`}>
                {itensAtuais.map((cliente) => (
                  <ClientCard key={cliente.id} cliente={cliente} onClick={handleClientClick} />
                ))}
              </div>

              <PaginationControls
                currentPage={paginaAtual}
                totalPages={totalPaginas}
                handlePageChange={aoMudarPagina}
              />

              <ItemsPerPageSelector
                itemsPerPage={itensPorPagina}
                setItemsPerPage={setItensPorPagina}
                options={OPCOES_ITENS_POR_PAGINA}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

