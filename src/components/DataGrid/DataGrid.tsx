import { useState } from "react";
import type { Column, EventInterface } from "../../contracts";

interface DataGridProps {
  data: EventInterface[];
  columns: Column<EventInterface>[];
}
// Potentially make the component generic to accept other data types other than the event I am using? 
export const DataGrid = ({ data, columns }: DataGridProps) => {
  const visibleColumns = columns.filter((col) => col.visible !== false);
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(data.length/itemsPerPage)
  const currentPageData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1)
  }

  const handlePreviousPage = () => {
    setCurrentPage(prev => prev - 1)
  }


  return (
    <div className="data-grid-container">
      <table className="data-grid-table">
        <thead>
          <tr>
            {visibleColumns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((item) => (
            <tr key={item.id}>
              {visibleColumns.map((col) => (
                <td key={col.key}>{String(col.accessor(item))}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="controls">
        <button disabled={currentPage===totalPages} onClick={handleNextPage}>Next</button>
        <p>{currentPage}</p>
        <button disabled={currentPage===1} onClick={handlePreviousPage}>Previous</button>
      </div>
    </div>
  );
};