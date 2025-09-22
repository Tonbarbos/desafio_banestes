import React, { useMemo } from 'react';
import '../assets/App.css';

const ClientDetail = ({ client, allContas, onBack }) => {
  if (!client) {
    return (
      <div className="client-detail-container">
        <div className="text-center">
          <h2>Cliente não encontrado</h2>
          <p>Não foi possível encontrar as informações do cliente solicitado.</p>
          <button onClick={onBack} className="back-button">Voltar</button>
        </div>
      </div>
    );
  }

  const clientContas = useMemo(() => {
    return allContas.filter(conta => conta.cpfCnpjCliente === client.cpfCnpj);
  }, [allContas, client.cpfCnpj]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatCpfCnpj = (cpfCnpj) => {
    if (cpfCnpj.length === 11) {
      return cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cpfCnpj.length === 14) {
      return cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return cpfCnpj;
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const totalSaldo = clientContas.reduce((sum, conta) => sum + conta.saldo, 0);
  const totalLimiteCredito = clientContas.reduce((sum, conta) => sum + conta.limiteCredito, 0);
  const totalCreditoDisponivel = clientContas.reduce((sum, conta) => sum + conta.creditoDisponivel, 0);

  return (
    <div className="client-detail-container">
      <button onClick={onBack} className="back-button">← Voltar</button>
      
      <h2>Detalhes do Cliente</h2>
      
      <div className="client-info">
        <h3>Informações Pessoais</h3>
        <p><strong>Nome:</strong> <span>{client.nome}</span></p>
        <p><strong>CPF/CNPJ:</strong> <span>{formatCpfCnpj(client.cpfCnpj)}</span></p>
        {client.rg && <p><strong>RG:</strong> <span>{client.rg}</span></p>}
        <p><strong>Data de Nascimento:</strong> <span>{client.dataNascimento.toLocaleDateString('pt-BR')} ({calculateAge(client.dataNascimento)} anos)</span></p>
        {client.nomeSocial && <p><strong>Nome Social:</strong> <span>{client.nomeSocial}</span></p>}
        <p><strong>Email:</strong> <span>{client.email}</span></p>
        <p><strong>Endereço:</strong> <span>{client.endereco}</span></p>
        <p><strong>Estado Civil:</strong> <span>{client.estadoCivil}</span></p>
      </div>

      <div className="client-info">
        <h3>Informações Financeiras</h3>
        <p><strong>Renda Anual:</strong> <span>{formatCurrency(client.rendaAnual)}</span></p>
        <p><strong>Patrimônio:</strong> <span>{formatCurrency(client.patrimonio)}</span></p>
        <p><strong>Total em Contas:</strong> <span>{formatCurrency(totalSaldo)}</span></p>
        <p><strong>Limite de Crédito Total:</strong> <span>{formatCurrency(totalLimiteCredito)}</span></p>
        <p><strong>Crédito Disponível Total:</strong> <span>{formatCurrency(totalCreditoDisponivel)}</span></p>
      </div>

      <div className="accounts-list">
        <h3>Contas ({clientContas.length})</h3>
        {clientContas.length > 0 ? (
          clientContas.map(conta => (
            <div key={conta.id} className="account-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, color: '#007BFF' }}>Conta #{conta.id}</h4>
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem', 
                  fontWeight: '500',
                  backgroundColor: conta.tipo === 'Corrente' ? '#E8F5E8' : '#FFF3CD',
                  color: conta.tipo === 'Corrente' ? '#28A745' : '#856404'
                }}>
                  {conta.tipo}
                </span>
              </div>
              <p><strong>Saldo:</strong> <span>{formatCurrency(conta.saldo)}</span></p>
              <p><strong>Limite de Crédito:</strong> <span>{formatCurrency(conta.limiteCredito)}</span></p>
              <p><strong>Crédito Disponível:</strong> <span>{formatCurrency(conta.creditoDisponivel)}</span></p>
            </div>
          ))
        ) : (
          <div className="text-center" style={{ padding: '2rem', color: '#666666' }}>
            <p>Nenhuma conta encontrada para este cliente.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetail;

