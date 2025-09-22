
import { useState, useMemo } from 'react';

export const useOrdenacaoClientes = (clientes) => {
  const [ordenarPor, setOrdenarPor] = useState("nome");
  const [ordemOrdenacao, setOrdemOrdenacao] = useState("asc");

  const clientesOrdenados = useMemo(() => {
    const clientesClassificaveis = [...clientes];

    clientesClassificaveis.sort((a, b) => {
      let valorA;
      let valorB;

      switch (ordenarPor) {
        case "patrimonio":
          valorA = a.patrimonio;
          valorB = b.patrimonio;
          break;
        case "rendaAnual":
          valorA = a.rendaAnual;
          valorB = b.rendaAnual;
          break;
        case "nome":
        default:
          valorA = a.nome.toLowerCase();
          valorB = b.nome.toLowerCase();
          break;
      }

      if (valorA < valorB) return ordemOrdenacao === "asc" ? -1 : 1;
      if (valorA > valorB) return ordemOrdenacao === "asc" ? 1 : -1;
      return 0;
    });

    return clientesClassificaveis;
  }, [clientes, ordenarPor, ordemOrdenacao]);

  return {
    ordenarPor,
    setOrdenarPor,
    ordemOrdenacao,
    setOrdemOrdenacao,
    clientesOrdenados,
  };
};


