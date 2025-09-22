
import React from 'react';

export function PaginationControls({
  currentPage,
  totalPages,
  handlePageChange,
}) {
  return (
    <div className="pagination">
      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        Anterior
      </button>
      <span>Página {currentPage} de {totalPages}</span>
      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Próxima
      </button>
    </div>
  );
}


