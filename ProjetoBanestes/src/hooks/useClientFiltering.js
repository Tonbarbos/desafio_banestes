
import { useState, useMemo } from 'react';

const calcularIdade = (dataNascimento) => {
  const diferencaMs = Date.now() - dataNascimento.getTime();
  const dataIdade = new Date(diferencaMs);
  return Math.abs(dataIdade.getUTCFullYear() - 1970);
};

export const useFiltragemClientes = (clientes, contas) => {
  const [termoBusca, setTermoBusca] = useState("");
  const [mostrarBuscaAvancada, setMostrarBuscaAvancada] = useState(false);
  const [filtrarPorAgencia, setFiltrarPorAgencia] = useState(false);
  const [idadeMinima, setIdadeMinima] = useState("");
  const [idadeMaxima, setIdadeMaxima] = useState("");

  const clientesFiltrados = useMemo(() => {
    let clientesAtuais = [...clientes];

    if (termoBusca) {
      clientesAtuais = clientesAtuais.filter(cliente => {
        const correspondeNome = cliente.nome.toLowerCase().includes(termoBusca.toLowerCase());
        const correspondeCpfCnpj = cliente.cpfCnpj.includes(termoBusca);
        const correspondeEmail = cliente.email.toLowerCase().includes(termoBusca.toLowerCase());
        
        const correspondeAgencia = filtrarPorAgencia && cliente.agencia && (
            cliente.agencia.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
            cliente.agencia.endereco.toLowerCase().includes(termoBusca.toLowerCase()) ||
            String(cliente.agencia.codigo).includes(termoBusca)
        );

        return correspondeNome || correspondeCpfCnpj || correspondeEmail || correspondeAgencia;
      });
    }

    const min = parseInt(idadeMinima);
    const max = parseInt(idadeMaxima);
    if (!isNaN(min) || !isNaN(max)) {
      clientesAtuais = clientesAtuais.filter(cliente => {
        const idade = calcularIdade(cliente.dataNascimento);
        const isMinValido = isNaN(min) || idade >= min;
        const isMaxValido = isNaN(max) || idade <= max;
        return isMinValido && isMaxValido;
      });
    }

    return clientesAtuais;
  }, [clientes, contas, termoBusca, filtrarPorAgencia, idadeMinima, idadeMaxima]);

  return {
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
    clientesFiltrados,
  };
};


