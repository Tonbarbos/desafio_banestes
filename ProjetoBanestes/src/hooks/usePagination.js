
import { useState, useMemo } from 'react';

const OPCOES_ITENS_POR_PAGINA = [16, 32];

export const usePaginacao = (itens) => {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(OPCOES_ITENS_POR_PAGINA[0]);

  const totalPaginas = useMemo(() => {
    return Math.ceil(itens.length / itensPorPagina);
  }, [itens.length, itensPorPagina]);

  const itensAtuais = useMemo(() => {
    const indiceInicio = (paginaAtual - 1) * itensPorPagina;
    const indiceFim = indiceInicio + itensPorPagina;
    return itens.slice(indiceInicio, indiceFim);
  }, [itens, paginaAtual, itensPorPagina]);

  const aoMudarPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaAtual(pagina);
    }
  };

  const aoMudarItensPorPagina = (e) => {
    setItensPorPagina(Number(e.target.value));
    setPaginaAtual(1); // Reinicia para a primeira página quando a quantidade de itens por página muda
  };

  return {
    paginaAtual,
    itensPorPagina,
    setItensPorPagina: aoMudarItensPorPagina,
    totalPaginas,
    itensAtuais,
    aoMudarPagina,
    OPCOES_ITENS_POR_PAGINA,
  };
};


