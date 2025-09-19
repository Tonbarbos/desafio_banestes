import React, { useEffect, useState, useMemo } from 'react';
import { fetchClientes, fetchContas } from './utils/dataFetcher';
import ClientDetail from './components/ClientDetail';
import Reports from './components/Reports';
import './App.css';

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 16, 32];

function App() {
  const [clientes, setClientes] = useState([]);
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filterByAgency, setFilterByAgency] = useState(false);
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [sortBy, setSortBy] = useState('nome');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showReports, setShowReports] = useState(false);
  const [cardLayout, setCardLayout] = useState('vertical');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesData = await fetchClientes();
        const contasData = await fetchContas();
        setClientes(clientesData);
        setContas(contasData);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateAge = (dob) => {
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  const filteredAndSortedClientes = useMemo(() => {
    let currentClientes = [...clientes];

    //Filtragem dos dados
    if (searchTerm) {
      currentClientes = currentClientes.filter(cliente => {
        const matchesName = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCpfCnpj = cliente.cpfCnpj.includes(searchTerm);
        const matchesEmail = cliente.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        
        const matchesAgency = filterByAgency && (
            cliente.nomeAgencia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.enderecoAgencia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(cliente.codigoAgencia).includes(searchTerm)
        );

        return matchesName || matchesCpfCnpj || matchesEmail || matchesAgency;
      });
    }

    // Filtro de Idade
    const min = parseInt(minAge);
    const max = parseInt(maxAge);
    if (!isNaN(min) || !isNaN(max)) {
      currentClientes = currentClientes.filter(cliente => {
        const age = calculateAge(cliente.dataNascimento);
        const isMinValid = isNaN(min) || age >= min;
        const isMaxValid = isNaN(max) || age <= max;
        return isMinValid && isMaxValid;
      });
    }

    // Ordenação
    currentClientes.sort((a, b) => {
      let valA;
      let valB;

      switch (sortBy) {
        case 'patrimonio':
          valA = a.patrimonio;
          valB = b.patrimonio;
          break;
        case 'rendaAnual':
          valA = a.rendaAnual;
          valB = b.rendaAnual;
          break;
        case 'nome':
        default:
          valA = a.nome.toLowerCase();
          valB = b.nome.toLowerCase();
          break;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return currentClientes;
  }, [clientes, contas, searchTerm, filterByAgency, minAge, maxAge, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedClientes.length / itemsPerPage);
  const currentClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedClientes.slice(startIndex, endIndex);
  }, [filteredAndSortedClientes, currentPage, itemsPerPage]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  const selectedClient = useMemo(() => {
    return clientes.find(cliente => cliente.id === selectedClientId);
  }, [clientes, selectedClientId]);

  if (loading) {
    return <div className="fade-in">Carregando clientes...</div>;
  }

  if (error) {
    return <div className="fade-in">Erro: {error}</div>;
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
          <div className="header">
            <h1>Lista de Clientes</h1>
            <div className="header-actions">
              <button className="reports-toggle" onClick={() => setShowReports(true)}>
                Relatórios
              </button>
              <button className="layout-toggle" onClick={toggleCardLayout}>
                Layout {cardLayout === 'vertical' ? 'Horizontal' : 'Vertical'}
              </button>
              <div className="search-container">
                <button className="search-toggle" onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}>
                  {showAdvancedSearch ? 'Fechar Busca' : 'Busca Avançada'}
                </button>
                {showAdvancedSearch && (
                  <div className="advanced-search-panel">
                    <input
                      type="text"
                      placeholder="Pesquisar... (Nome, CPF/CNPJ, Email, Agência)"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <div className="filters-group">
                      <h4>Filtrar por:</h4>
                      <label>
                        <input
                          type="checkbox"
                          checked={filterByAgency}
                          onChange={() => setFilterByAgency(!filterByAgency)}
                        />
                        Agência
                      </label>
                      <div className="age-filter">
                        <label>Idade Mínima:</label>
                        <input
                          type="number"
                          value={minAge}
                          onChange={(e) => setMinAge(e.target.value)}
                          placeholder="Min"
                        />
                        <label>Idade Máxima:</label>
                        <input
                          type="number"
                          value={maxAge}
                          onChange={(e) => setMaxAge(e.target.value)}
                          placeholder="Max"
                        />
                      </div>
                    </div>
                    <div className="sort-group">
                      <h4>Ordenar por:</h4>
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="nome">Nome</option>
                        <option value="rendaAnual">Renda Anual</option>
                        <option value="patrimonio">Patrimônio</option>
                      </select>
                      <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                        {sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={`client-list ${cardLayout}`}>
            {currentClients.map((cliente) => (
              <div key={cliente.id} className="client-card" onClick={() => handleClientClick(cliente.id)}>
                <h2>{cliente.nome}</h2>
                <p>CPF/CNPJ: {cliente.cpfCnpj}</p>
                <p>Email: {cliente.email}</p>
                {/* Removido a exibição direta da agência do cliente aqui, pois a agência é da conta */}
              </div>
            ))}
          </div>
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Anterior
            </button>
            <span>Página {currentPage} de {totalPages}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Próxima
            </button>
          </div>
          <div className="items-per-page-selector">
            <span>Itens por página: </span>
            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
              {ITEMS_PER_PAGE_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
