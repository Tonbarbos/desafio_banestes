import React from 'react';

export function ClientCard({ cliente, onClick }) {
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

  return (
    <div className="client-card" onClick={() => onClick(cliente.id)}>
      <h3>{cliente.nome}</h3>
      <p><strong>CPF/CNPJ:</strong> {formatCpfCnpj(cliente.cpfCnpj)}</p>
      <p><strong>Email:</strong> {cliente.email}</p>
      <p><strong>Renda Anual:</strong> {formatCurrency(cliente.rendaAnual)}</p>
      
      <div className="client-meta">
        <span className="client-status">Ativo</span>
        <small>{cliente.endereco}</small>
      </div>
    </div>
  );
}

