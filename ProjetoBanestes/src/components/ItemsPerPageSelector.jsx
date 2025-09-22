
import React from 'react';

export function ItemsPerPageSelector({
  itemsPerPage,
  setItemsPerPage,
  options,
}) {
  return (
    <div className="items-per-page-selector">
      <span>Itens por página: </span>
      <select value={itemsPerPage} onChange={setItemsPerPage}>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}


