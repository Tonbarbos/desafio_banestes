import React from 'react';

export function CabecalhoListaClientes({
  termoBusca,
  aoMudarBusca,
  mostrarBuscaAvancada,
  aoMudarMostrarBuscaAvancada,
  filtrarPorAgencia,
  aoMudarFiltrarPorAgencia,
  idadeMinima,
  aoMudarIdadeMinima,
  idadeMaxima,
  aoMudarIdadeMaxima,
  ordenarPor,
  aoMudarOrdenarPor,
  ordemOrdenacao,
  aoMudarOrdemOrdenacao,
  aoMostrarRelatorios,
  alternarLayoutCard,
  layoutCard,
}) {
  return (
    <div className="header">
      <div>
        <h1>Sistema de Clientes</h1>
        <p style={{ color: '#666666', margin: 0 }}>Gerencie e visualize informações dos seus clientes</p>
      </div>
      
      <div className="header-actions">
          <button className="reports-toggle" onClick={() => aoMostrarRelatorios(true)}>
          Relatórios
        </button>
        
        <button 
          className="layout-toggle" 
          onClick={alternarLayoutCard}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontWeight: '500'
          }}
        >
            {layoutCard === 'vertical' ? 'Grid Compacto' : 'Grid Expandido'}
        </button>
        
        <div className="search-container">
          <button className="search-toggle" onClick={() => aoMudarMostrarBuscaAvancada(!mostrarBuscaAvancada)}>
              {mostrarBuscaAvancada ? 'Fechar Busca' : 'Busca Avançada'}
          </button>
          
          {mostrarBuscaAvancada && (
            <div className="advanced-search-panel">
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333333' }}>
                  Pesquisar Cliente
                </label>
                <input
                  type="text"
                  placeholder="Digite nome, CPF/CNPJ ou email..."
                  value={termoBusca}
                  onChange={aoMudarBusca}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div className="filters-group">
                <h4>Filtros</h4>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input
                    type="checkbox"
                    checked={filtrarPorAgencia}
                    onChange={() => aoMudarFiltrarPorAgencia(!filtrarPorAgencia)}
                    style={{ width: 'auto' }}
                  />
                  Filtrar por agência
                </label>
                
                <div className="age-filter" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                      Idade Mínima
                    </label>
                    <input
                      type="number"
                      value={idadeMinima}
                      onChange={(e) => aoMudarIdadeMinima(e.target.value)}
                      placeholder="18"
                      min="18"
                      max="100"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                      Idade Máxima
                    </label>
                    <input
                      type="number"
                      value={idadeMaxima}
                      onChange={(e) => aoMudarIdadeMaxima(e.target.value)}
                      placeholder="65"
                      min="18"
                      max="100"
                    />
                  </div>
                </div>
              </div>
              
              <div className="sort-group">
                <h4>Ordenação</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <select 
                    value={ordenarPor} 
                    onChange={(e) => aoMudarOrdenarPor(e.target.value)}
                    style={{ flex: '1', minWidth: '150px' }}
                  >
                    <option value="nome">Nome</option>
                    <option value="rendaAnual">Renda Anual</option>
                    <option value="patrimonio">Patrimônio</option>
                    <option value="dataNascimento">Idade</option>
                  </select>
                  <button 
                    onClick={() => aoMudarOrdemOrdenacao(ordemOrdenacao === 'asc' ? 'desc' : 'asc')}
                    style={{
                      backgroundColor: ordemOrdenacao === 'asc' ? '#28A745' : '#DC3545',
                      minWidth: '100px'
                    }}
                  >
                    {ordemOrdenacao === 'asc' ? '↑ A-Z' : '↓ Z-A'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

