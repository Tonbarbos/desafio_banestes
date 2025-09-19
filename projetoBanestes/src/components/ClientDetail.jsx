import React, { useMemo } from 'react';
import '../App.css';

const ClientDetail = ({ client, allContas, onBack }) => {
  if (!client) {
    return <div className="client-detail-container">Cliente não encontrado.</div>;
  }

  const clientContas = useMemo(() => {
    return allContas.filter(conta => conta.cpfCnpjCliente === client.cpfCnpj);
  }, [allContas, client.cpfCnpj]);

  return (
    <div className="client-detail-container">
      <button onClick={onBack} className="back-button">Voltar</button>
      <h2 style={{ color: '#e0e0e0' }}>Detalhes do Cliente: {client.nome}</h2>
      <div className="client-info">
        <p><strong>ID:</strong> {client.id}</p>
        <p><strong>CPF/CNPJ:</strong> {client.cpfCnpj}</p>
        {client.rg && <p><strong>RG:</strong> {client.rg}</p>}
        <p><strong>Data de Nascimento:</strong> {client.dataNascimento.toLocaleDateString()}</p>
        {client.nomeSocial && <p><strong>Nome Social:</strong> {client.nomeSocial}</p>}
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Endereço:</strong> {client.endereco}</p>
        <p><strong>Renda Anual:</strong> R$ {client.rendaAnual.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>Patrimônio:</strong> R$ {client.patrimonio.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>Estado Civil:</strong> {client.estadoCivil}</p>
        <p><strong>Agência:</strong> {client.nomeAgencia || 'N/A'} ({client.codigoAgencia})</p>
        {client.enderecoAgencia && <p><strong>Endereço da Agência:</strong> {client.enderecoAgencia}</p>}
      </div>

      <h3>Contas:</h3>
      {clientContas.length > 0 ? (
        <div className="accounts-list">
          {clientContas.map(conta => (
            <div key={conta.id} className="account-card">
              <p><strong>ID da Conta:</strong> {conta.id}</p>
              <p><strong>Tipo:</strong> {conta.tipo}</p>
              <p><strong>Saldo:</strong> {conta.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              <p><strong>Limite de Crédito:</strong> {conta.limiteCredito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              <p><strong>Crédito Disponível:</strong> {conta.creditoDisponivel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              <p><strong>Agência:</strong> {conta.nomeAgencia || 'N/A'} ({conta.codigoAgencia})</p>
              {conta.enderecoAgencia && <p><strong>Endereço da Agência:</strong> {conta.enderecoAgencia}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p>Nenhuma conta encontrada para este cliente.</p>
      )}
    </div>
  );
};

export default ClientDetail;


